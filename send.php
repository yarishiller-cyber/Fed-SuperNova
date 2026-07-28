<?php
/**
 * send.php — server-side contact handler for Fed Supernova Simulation Solutions.
 *
 * Sends the contact form to the inbox FROM the server (not the visitor's mail
 * client) and also appends every submission to a protected local log so a lead
 * is never lost, even if mail delivery hiccups.
 *
 * Default transport is PHP mail() with an envelope sender (-f), which is what
 * Hostinger recommends for domain-hosted mailboxes. For guaranteed deliver-
 * ability you can drop a send-config.php next to this file with SMTP creds
 * (see send-config.sample.php); if present, it is used automatically.
 */

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

$INBOX = 'info@sbir-simulation-funding.com';
$FROM  = 'info@sbir-simulation-funding.com';   // must be a real mailbox on this domain

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'method_not_allowed']);
    exit;
}

$raw = file_get_contents('php://input');
$in  = json_decode($raw, true);
if (!is_array($in)) { $in = $_POST; }

function field($in, $k) {
    $v = isset($in[$k]) ? $in[$k] : '';
    return trim(is_string($v) ? $v : '');
}
function clean_header($s) { return preg_replace('/[\r\n]+/', ' ', $s); }

// Honeypot: real users never fill this hidden field.
if (field($in, 'website') !== '') { echo json_encode(['ok' => true]); exit; }

$name    = field($in, 'name');
$email   = field($in, 'email');
$company = field($in, 'company');
$stage   = field($in, 'stage');
$tech    = field($in, 'tech');
$funding = field($in, 'funding');
$message = field($in, 'msg');

if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || mb_strlen($name) > 200 || mb_strlen($message) > 5000) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'invalid_input']);
    exit;
}

$subject = 'New lead — ' . ($company !== '' ? clean_header($company) : clean_header($name));
$lines = [
    'New enquiry from sbir-simulation-funding.com',
    '',
    'Name:            ' . $name,
    'Email:           ' . $email,
    'Company:         ' . ($company !== '' ? $company : '(none yet)'),
    'Stage:           ' . ($stage !== '' ? $stage : '(not given)'),
    'Simulation need: ' . ($tech !== '' ? $tech : '(not given)'),
    'Funding pursued: ' . ($funding !== '' ? $funding : '(not given)'),
    '',
    'Message:',
    ($message !== '' ? $message : '(none)'),
    '',
    'Received: ' . gmdate('Y-m-d H:i:s') . ' UTC · IP ' . ($_SERVER['REMOTE_ADDR'] ?? '?'),
];
$body = implode("\r\n", $lines);

/* ---- Backup: append every lead to a protected log (never lose a lead) ---- */
$dir = __DIR__ . '/leads';
if (!is_dir($dir)) { @mkdir($dir, 0700); @file_put_contents($dir . '/.htaccess', "Require all denied\nDeny from all\n"); }
@file_put_contents(
    $dir . '/leads-' . gmdate('Ym') . '.log',
    '==== ' . gmdate('Y-m-d H:i:s') . " UTC ====\r\n" . $body . "\r\n\r\n",
    FILE_APPEND | LOCK_EX
);

/* ---- Optional SMTP transport (used only if send-config.php exists) ---- */
$sent = false;
$cfgPath = __DIR__ . '/send-config.php';
if (is_file($cfgPath)) {
    $cfg = include $cfgPath; // returns ['host'=>,'port'=>,'user'=>,'pass'=>,'secure'=>'ssl'|'tls']
    if (is_array($cfg) && !empty($cfg['host'])) {
        $sent = smtp_send($cfg, $FROM, $INBOX, $subject, $body, $email, $name);
    }
}

/* ---- Default transport: PHP mail() with envelope sender ---- */
if (!$sent) {
    $headers = [];
    $headers[] = 'From: Fed Supernova Website <' . $FROM . '>';
    $headers[] = 'Reply-To: ' . clean_header($name) . ' <' . clean_header($email) . '>';
    $headers[] = 'MIME-Version: 1.0';
    $headers[] = 'Content-Type: text/plain; charset=UTF-8';
    $headers[] = 'Content-Transfer-Encoding: 8bit';
    $headers[] = 'Message-ID: <' . bin2hex(random_bytes(8)) . '@sbir-simulation-funding.com>';
    $headers[] = 'Date: ' . date('r');
    $headers[] = 'X-Mailer: FedSupernova-Form';
    $encSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
    $sent = @mail($INBOX, $encSubject, $body, implode("\r\n", $headers), '-f' . $FROM);
}

if ($sent) {
    echo json_encode(['ok' => true]);
} else {
    // Lead is still saved in the log above; report failure so the UI can offer a fallback.
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'send_failed']);
}

/* ---------------------------------------------------------------------------
 * Minimal dependency-free SMTP sender (AUTH LOGIN). Returns true on success.
 * ------------------------------------------------------------------------- */
function smtp_send($cfg, $from, $to, $subject, $body, $replyEmail, $replyName) {
    $host = $cfg['host']; $port = (int)($cfg['port'] ?? 465);
    $secure = $cfg['secure'] ?? 'ssl';
    $user = $cfg['user'] ?? $from; $pass = $cfg['pass'] ?? '';
    $remote = ($secure === 'ssl' ? 'ssl://' : '') . $host . ':' . $port;
    $ctx = stream_context_create(['ssl' => ['verify_peer' => true, 'verify_peer_name' => true]]);
    $fp = @stream_socket_client($remote, $errno, $errstr, 15, STREAM_CLIENT_CONNECT, $ctx);
    if (!$fp) { return false; }
    stream_set_timeout($fp, 15);
    $read = function () use ($fp) {
        $data = '';
        while (($line = fgets($fp, 515)) !== false) { $data .= $line; if (isset($line[3]) && $line[3] === ' ') break; }
        return $data;
    };
    $cmd = function ($c) use ($fp, $read) { fputs($fp, $c . "\r\n"); return $read(); };
    $read();
    $ehlo = $cmd('EHLO sbir-simulation-funding.com');
    if ($secure === 'tls') {
        $cmd('STARTTLS');
        if (!stream_socket_enable_crypto($fp, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) { fclose($fp); return false; }
        $cmd('EHLO sbir-simulation-funding.com');
    }
    $ok = function ($r, $codes) { $c = (int)substr($r, 0, 3); return in_array($c, (array)$codes, true); };
    if (!$ok($cmd('AUTH LOGIN'), 334)) { fclose($fp); return false; }
    if (!$ok($cmd(base64_encode($user)), 334)) { fclose($fp); return false; }
    if (!$ok($cmd(base64_encode($pass)), 235)) { fclose($fp); return false; }
    if (!$ok($cmd('MAIL FROM:<' . $from . '>'), 250)) { fclose($fp); return false; }
    if (!$ok($cmd('RCPT TO:<' . $to . '>'), [250, 251])) { fclose($fp); return false; }
    if (!$ok($cmd('DATA'), 354)) { fclose($fp); return false; }
    $headers =
        'From: Fed Supernova Website <' . $from . ">\r\n" .
        'To: <' . $to . ">\r\n" .
        'Reply-To: ' . preg_replace('/[\r\n]+/', ' ', $replyName) . ' <' . preg_replace('/[\r\n]+/', ' ', $replyEmail) . ">\r\n" .
        'Subject: =?UTF-8?B?' . base64_encode($subject) . "?=\r\n" .
        'MIME-Version: 1.0' . "\r\n" .
        'Content-Type: text/plain; charset=UTF-8' . "\r\n" .
        'Date: ' . date('r') . "\r\n\r\n";
    $data = $headers . preg_replace('/^\./m', '..', $body) . "\r\n.";
    if (!$ok($cmd($data), 250)) { fclose($fp); return false; }
    $cmd('QUIT'); fclose($fp);
    return true;
}

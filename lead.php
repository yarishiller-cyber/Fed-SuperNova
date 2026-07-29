<?php
/**
 * lead.php — contact-form handler for Fed Supernova Simulation Solutions.
 *
 * Primary endpoint for the contact form (the page also retries against the
 * legacy send.php if this file is unreachable). Accepts JSON or classic
 * form-encoded POSTs, logs every valid lead to a protected local file so a
 * lead is never lost, then emails the inbox via PHP mail(). The envelope
 * sender (-f) is attempted first — Hostinger's recommended setup — with a
 * plain mail() retry for hosts that reject the -f parameter.
 */

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

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

$too_long = strlen($name) > 400 || strlen($message) > 20000;
if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || $too_long) {
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

/* ---- Backup first: append every lead to a protected log ---- */
$dir = __DIR__ . '/leads';
if (!is_dir($dir)) { @mkdir($dir, 0700); @file_put_contents($dir . '/.htaccess', "Require all denied\nDeny from all\n"); }
@file_put_contents(
    $dir . '/leads-' . gmdate('Ym') . '.log',
    '==== ' . gmdate('Y-m-d H:i:s') . " UTC ====\r\n" . $body . "\r\n\r\n",
    FILE_APPEND | LOCK_EX
);

/* ---- Transport: PHP mail(), envelope sender first, plain retry second ---- */
$headers = [];
$headers[] = 'From: Fed Supernova Website <' . $FROM . '>';
$headers[] = 'Reply-To: ' . clean_header($name) . ' <' . clean_header($email) . '>';
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-Type: text/plain; charset=UTF-8';
$headers[] = 'Date: ' . date('r');
$headers[] = 'X-Mailer: FedSupernova-Form';
$hdr = implode("\r\n", $headers);

$sent = @mail($INBOX, $subject, $body, $hdr, '-f' . $FROM);
if (!$sent) { $sent = @mail($INBOX, $subject, $body, $hdr); }

if ($sent) {
    echo json_encode(['ok' => true]);
} else {
    // The lead is already saved in the log above; tell the UI so it can offer a fallback.
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'send_failed']);
}

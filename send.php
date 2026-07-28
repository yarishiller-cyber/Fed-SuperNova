<?php
/**
 * send.php — server-side contact handler for Fed Supernova Simulation Solutions.
 * Receives the contact form (JSON or form-encoded) and emails it to the inbox,
 * so the message is sent BY the server, not by opening the visitor's mail client.
 *
 * Hostinger runs PHP by default, so no build step or dependency is required.
 * If mail() is ever unreliable, swap the send block for authenticated SMTP.
 */

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

$INBOX = 'info@sbir-simulation-funding.com';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'method_not_allowed']);
    exit;
}

// Accept JSON (fetch) or classic form-encoded POST.
$raw = file_get_contents('php://input');
$in  = json_decode($raw, true);
if (!is_array($in)) { $in = $_POST; }

function field($in, $k) {
    $v = isset($in[$k]) ? $in[$k] : '';
    return trim(is_string($v) ? $v : '');
}

// Honeypot: real users never fill this hidden field. Pretend success for bots.
if (field($in, 'website') !== '') {
    echo json_encode(['ok' => true]);
    exit;
}

$name    = field($in, 'name');
$email   = field($in, 'email');
$company = field($in, 'company');
$stage   = field($in, 'stage');
$tech    = field($in, 'tech');
$funding = field($in, 'funding');
$message = field($in, 'msg');

if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'invalid_input']);
    exit;
}

// Strip CR/LF from anything that touches a header to prevent header injection.
function clean_header($s) { return preg_replace('/[\r\n]+/', ' ', $s); }

$safe_email   = clean_header($email);
$safe_name    = clean_header($name);
$safe_company = clean_header($company);

$subject = 'New lead — ' . ($company !== '' ? $safe_company : $safe_name);

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
    '— sent by the website contact form',
];
$body = implode("\r\n", $lines);

$headers = [];
$headers[] = 'From: Fed Supernova Website <' . $INBOX . '>';
$headers[] = 'Reply-To: ' . $safe_name . ' <' . $safe_email . '>';
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-Type: text/plain; charset=UTF-8';
$headers[] = 'X-Mailer: FedSupernova-Form';

$sent = @mail($INBOX, '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, implode("\r\n", $headers));

if ($sent) {
    echo json_encode(['ok' => true]);
} else {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'send_failed']);
}

<?php
/**
 * OPTIONAL: guaranteed-delivery SMTP for the contact form.
 *
 * By default send.php uses PHP mail(), which works on Hostinger for a mailbox
 * on this domain. If you ever want authenticated SMTP (best deliverability),
 * copy this file to send-config.php and fill in your Hostinger email password.
 * send.php will then send through SMTP automatically. Keep send-config.php out
 * of git (it is already in .gitignore).
 *
 * Hostinger SMTP (Business Email): host smtp.hostinger.com, port 465 (ssl).
 */
return [
    'host'   => 'smtp.hostinger.com',
    'port'   => 465,
    'secure' => 'ssl',                                  // 'ssl' (465) or 'tls' (587)
    'user'   => 'info@sbir-simulation-funding.com',
    'pass'   => 'YOUR_MAILBOX_PASSWORD_HERE',
];

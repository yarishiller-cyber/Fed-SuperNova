<?php
/** lead.php — contact handler. Emails info@meddevice-simulation-funding.com server-side, logs every lead. */
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');
$INBOX = 'info@meddevice-simulation-funding.com'; $FROM = 'info@meddevice-simulation-funding.com';
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['ok'=>false,'error'=>'method_not_allowed']); exit; }
$raw = file_get_contents('php://input'); $in = json_decode($raw, true); if (!is_array($in)) { $in = $_POST; }
function field($in,$k){ $v = isset($in[$k])?$in[$k]:''; return trim(is_string($v)?$v:''); }
function ch($s){ return preg_replace('/[\r\n]+/',' ',$s); }
if (field($in,'website') !== '') { echo json_encode(['ok'=>true]); exit; }
$name=field($in,'name'); $email=field($in,'email'); $phone=field($in,'phone'); $interest=field($in,'interest'); $msg=field($in,'msg');
if ($name===''||!filter_var($email,FILTER_VALIDATE_EMAIL)||strlen($name)>400||strlen($msg)>20000){ http_response_code(422); echo json_encode(['ok'=>false,'error'=>'invalid_input']); exit; }
$subject='New lead — '.ch($name);
$lines=['New enquiry from meddevice-simulation-funding.com','','Name:            '.$name,'Email:           '.$email,'Phone:           '.($phone!==''?$phone:'(not given)'),'Funding interest:'.($interest!==''?' '.$interest:' (not given)'),'','Message:',($msg!==''?$msg:'(none)'),'','Received: '.gmdate('Y-m-d H:i:s').' UTC · IP '.($_SERVER['REMOTE_ADDR']??'?')];
$body=implode("\r\n",$lines);
$dir=__DIR__.'/leads';
if(!is_dir($dir)){ @mkdir($dir,0700); @file_put_contents($dir.'/.htaccess',"Require all denied\nDeny from all\n"); }
@file_put_contents($dir.'/leads-'.gmdate('Ym').'.log','==== '.gmdate('Y-m-d H:i:s')." UTC ====\r\n".$body."\r\n\r\n",FILE_APPEND|LOCK_EX);
$h=['From: MedDevice Simulation Solutions Website <'.$FROM.'>','Reply-To: '.ch($name).' <'.ch($email).'>','MIME-Version: 1.0','Content-Type: text/plain; charset=UTF-8','Date: '.date('r'),'X-Mailer: Fleet-Form'];
$hdr=implode("\r\n",$h);
$sent=@mail($INBOX,$subject,$body,$hdr,'-f'.$FROM); if(!$sent){ $sent=@mail($INBOX,$subject,$body,$hdr); }
if($sent){ echo json_encode(['ok'=>true]); } else { http_response_code(500); echo json_encode(['ok'=>false,'error'=>'send_failed']); }

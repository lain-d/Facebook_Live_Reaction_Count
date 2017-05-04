<?php
$access_token = "EAAH5qCyWCdcBAP0ddTZBNbVRdmqd43TZCnBJGFEwRZAmO76hlrXfWmVzBXO5xEsochEnlrQ88Tkrwm2B63KzXctLxXQ8RU6KKM9sWEFsGZAaBzmmMUoqVjfir1n5ufXgW8btvZAL41bNJ5S0IceHKUCioOLTqCLZCZCOOMlNz5fRAZDZD";
$verify_token = "lhhbot";
$hub_verify_token = null;

if(isset($_REQUEST['hub_challenge'])) {
    $challenge = $_REQUEST['hub_challenge'];
    $hub_verify_token = $_REQUEST['hub_verify_token'];
}


if ($hub_verify_token === $verify_token) {
    echo $challenge;
}
?>
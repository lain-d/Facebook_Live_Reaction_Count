<?php
$access_token = "EAAEt9EOplQYBAG8sK393u2ZAqniFCzDKIw5S49hZAgWBiuFu9VZCHffkD1DZBBVZAxjpSweQV4VcKThEDItgJhTGwnCctTxQgbG8btCkSKm2f6OYF1JsZBZB8w6jfs2dMfvd2NwYAOgiZAvft966qIPhHoa2phxuKosDVt8qaLrZBcQZDZD";
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


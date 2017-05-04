<?php
$access_token = "EAAEt9EOplQYBAF40Ozha2JVnlZAxzt7ZC8x8VWq8BObJDz4WYk1HbsZA4SYPJkM2J7vfZCYB3Bv3e8lZCuUNQR8GsWHyZA5F9UMenB5w2QWqnOx3faPAZA5sWRjT3kp2P89SJRy0dXOxyTr1PlkfvQXDSZCzOxmnkYxZCNAmPEZA5VJwZDZD";
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
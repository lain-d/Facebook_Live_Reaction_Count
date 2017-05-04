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
$input = json_decode(file_get_contents('php://input'), true);
 
$sender = $input['entry'][0]['messaging'][0]['sender']['id'];
$message = $input['entry'][0]['messaging'][0]['message']['text'];

$url = 'https://graph.facebook.com/v2.6/me/messages?access_token='.$access_token;
$ch = curl_init($url);

$jsonData = '{
    "recipient":{
        "id":"'.$sender.'"
    },
   "message":{
   	"text":"'.$sender.'"
}
}';
$jsonDataEncoded = $jsonData;
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonDataEncoded);
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
if(!empty($input['entry'][0]['messaging'][0]['message'])){
    $result = curl_exec($ch);
}

?>


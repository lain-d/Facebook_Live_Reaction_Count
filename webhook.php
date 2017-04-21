 $challenge = $_REQUEST['hub_challenge'];
  $verify_token = $_REQUEST['hub_verify_token'];

  if ($verify_token === 'mtvton000294') {
  echo $challenge;
  }
  //Token of app
 $row = "Token";


 $input = json_decode(file_get_contents('php://input'), true);

//Receive user
$sender = $input['entry'][0]['messaging'][0]['sender']['id'];
 //User's message
 $message = $input['entry'][0]['messaging'][0]['message']['text'];



//Where the bot will send message
 $url = 'https://graph.facebook.com/v2.6/me/messages?access_token='.$row;


 $ch = curl_init($url);

//Answer to the message adds 1
if($message)
{
 $jsonData = '{
    "recipient":{
        "id":"'.$sender.'"
      }, 
    "message":{
        "text":"'.$message. ' 1' .'"
      }
 }';
};



 $json_enc = $jsonData;

 curl_setopt($ch, CURLOPT_POST, 1);

 curl_setopt($ch, CURLOPT_POSTFIELDS, $json_enc);

 curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));  

 if(!empty($input['entry'][0]['messaging'][0]['message'])){
    $result = curl_exec($ch);
 }
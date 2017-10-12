<?php
require('vendor/autoload.php');
$redis = new Predis\Client(getenv('REDIS_URL'));
if($redis)
{
echo "it works";
$value = $redis->get('message');

// Hello world
print($value); 
echo ($redis->exists('message')) ? "Oui" : "please populate the message key";
}

?>
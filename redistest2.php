<?php
require('vendor/autoload.php');
$redis = new Predis\Client(getenv('REDIS_URL'));
if($redis)
{
echo "it works";
$value = $redis->get('HAHA');
$value2 = $redis->get('LOVE');

// Hello world
print($value); 
print($value2); 


}

?>
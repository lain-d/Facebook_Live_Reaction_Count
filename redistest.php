<?php
require('vendor/autoload.php');
$redis = new Predis\Client(getenv('REDIS_URL'));
if($redis)
{
echo "it works";
}
?>
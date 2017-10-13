<?php
require('../vendor/autoload.php');
header("Content-type: text/xml");
$redis = new Predis\Client(getenv('REDIS_URL'));
if (isset($redis))
{
$emojis = ["LIKE", "LOVE", "WOW", "HAHA", "SAD", "ANGRY" ];
$results = $redis->mGet($emojis);

$resultXML = "";
foreach ($emojis  as $key => $value) {
    // $arr[3] will be updated with each value from $arr...
    $resultXML+= "<".$value.">".$results[$key]."</".$value.">.";
}
echo "<?xml version=\"1.0\"?><results>".$resultXML."</results>";
}

?>
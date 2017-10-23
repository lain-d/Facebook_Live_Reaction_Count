<?php
require('../vendor/autoload.php');
header("Content-type: text/xml");
$redis = new Predis\Client(getenv('REDIS_URL'));
if (isset($redis))
{
$emojis = ["LIKE", "LOVE", "WOW", "HAHA", "SAD", "ANGRY"];
$results = $redis->mGet($emojis);

echo "<?xml version=\"1.0\"?><r>";
echo "<choice1>SAD</choice1><choice2>HAHA</choice2><choice3>WOW</choice3><choice4>LOVE</choice4>";
foreach ($emojis  as $key => $value) {
    echo "<".$value.">".$results[$key]."</".$value.">";
}
echo "</r>";
}

?>

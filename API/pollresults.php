<?php
require('../vendor/autoload.php');
$redis = new Predis\Client(getenv('REDIS_URL'));
if (isset($redis))
{
$emojis = ["LIKE", "LOVE", "WOW", "HAHA", "SAD", "ANGRY"];
$results = $redis->mGet($emojis);

echo "<?xml version=\"1.0\"?><r>";
foreach ($emojis  as $key => $value) {
    echo "<".$value.">".$results[$key]."</".$value.">";
}
echo "</r>";
}

?>
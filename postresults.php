<?php
require('vendor/autoload.php');
$redis = new Predis\Client(getenv('REDIS_URL'));
echo "hello";
print_r($_POST);

if(isset($_POST['dataSets'])){
 $obj = json_decode($_POST['dataSets']);
foreach ($obj as $key => $value)
{
	$redis->set($key, $value);
	echo $key." ".$value;
}
}
else
{
	echo "bad data";
}
echo "end";
?>


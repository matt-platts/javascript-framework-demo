<?php

$user=$_REQUEST['username'];
$pw = $_REQUEST['password'];

if ($user == "mattplatts@gmail.com" && $pw == "test"){

	setcookie("UserId", "982374982734", time()+3600, "/");
	echo '{"error":false,"loggedIn":true,"userId":"1394627536288257669","isParent":true,"isChild":false,"isGroupAdmin":false,"groupId":null,"showStore":true}';exit;

} else {

	echo '{"error":true,"loggedIn":false}';
	exit;

}
?>

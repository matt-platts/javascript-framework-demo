<?

	setcookie("UserId", "", time()-3600, "/");
	echo '{"error":false,"loggedIn":false, "loggedOut":true}';
	exit;
?>

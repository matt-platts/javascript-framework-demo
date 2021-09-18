<?php
if (!$_COOKIE['UserId']){

	header("HTTP/1.1 401 Unauthorized");
	echo '{"message":"Login Required"}';exit;

} else {

	$message='{"user":{"userId":"1403605484494189569","title":"Mr","firstName":"' . $_COOKIE['UserId'] .'","lastName":"Platts","nickname" :"Dad","gender":"MALE","mothersMaidenName":null,"dob":"1973-06-15","email":"mattplatts@gmail.com","status" :"ACTIVE","imageId":null,"familyImageId":null,"type":"PUBLIC","username":"mattplatts@gmail.com","created" :"2014-06-24 11:24:44","joinFormStatus":"FINISHED","relation":{"relationType":"NONE"},"imageUrl":null,"userType":{"USER":true,"ADMIN":false},"familyName":"Platts","kycChecks":[],"pktmnyDay"
	:"6","loginPin":false}}';

	echo $message; 

}
?>

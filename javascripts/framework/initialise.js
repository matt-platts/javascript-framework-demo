// User editable configuration 
var apiPath = "https://www.mattplatts.com/demo/js-framework-api/";
var loadStyle = 1; // 1 - As sections become ready, 2 - In order of listing in pageRegister, 3 - All at once
var currentUserVar = "$$_current_$$";
var _homePage = "home";
var _loginPage = "login";
var _view_container = "view-container" // id of div which contains the entire view
var homeURL = "https://www.mattplatts.com/demo/js-framework/";
var _user = new user;

// when reloading areas of the page, good to hide things like footers so they don't appear to spring up the screen and down again as the middle section loads..
var hideSectionDuringLoad = ["mainRightAlt", "mainLeftAlt", "computer-image", "mainInner", "top_text", "progress_bar", "footer", "pre_footer"];
var hideSectionDuringPageCalls = ["footer", "pre_footer"];

// Cache and minify
cachingOnOff = true;
minifiedJS = false;
if(minifiedJS){
	minifiedDir="production/";
} else{
	minifiedDir="";
}

// Load Json files descrigin each page and page block, with associated api calls, js, stylesheets and auth for each`
pageRegister = new Object();
$.ajax({
	url: 'templates/register/pages.json',
	type: 'GET',
	async: false,
	dataType: 'json',
	success: function(data){
		pageRegister = data;
	}
});

blockRegister = new Object();
$.ajax({
	url: 'templates/register/blocks.json',
	type: 'GET',
	async: false,
	dataType: 'json',
	success: function(data){
		blockRegister = data;
	}
});

// Set up vars for makePageCalls - should be able to delete this with a little tweaking as it's in the object
var currentPage=new Object();
var updateTimers = new Object();
var pageCallInOp=false;
var timeout= new Object();
var timeoutIncrementer=0;
var pageLoadQueue=Array();

var currentPageIdentifier;
var previousPageIdentifier;
var viewingAsId;
var currentFamilyId;
var PageCallInOp = false;

// mobile detect
is_mobile=0;
windowWidth=screen.width;
mobileDevices = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/;
if (navigator.userAgent.match(mobileDevices) || windowWidth<640){
    is_mobile=1;
}

// Read request vars - required for password reset 
var resetToken = null;
var resetUser = null;
if (location.search){
	queryString=(location.search.replace("?",""));
	queryArray=queryString.split("&");
	for (i=0;i<queryArray.length;i++){
		queryPair=queryArray[i].split("=");
		if (queryPair[0]=="user"){
		    resetUser=queryPair[1];
		} else if (queryPair[0]=="token"){
		    resetToken=queryPair[1];
		}
	}
}

// Init
var hash;
var referral =  window.location.hash.match(/ref_[\w]{2,4}_[\d]+_[a-zA-Z]{2}/) ? window.location.hash : null;

if(!!referral){
	createCookie('referralLink',referral.substr(1),30);
	window.location.href= '/referrals';
}

hash = window.location.hash.substring(1).split("_");

/* The original way of getting query strings from the url was to split the url after the hash at the underscore.
 * This does not allow any url paramaters to contain underscores however. This is basically legacy code but some parts of the system still use it */

var preventHashChange=0;
if (hash[0]=="password" && resetUser && resetToken){
	preventHashChange=1;
}

//Render default page - login
if (typeof(hash[0]) != "undefined" && hash[0] != "" && hash[0] != "login" && hash[0] != "undefined") {

	userType=_user.getUserTypes();
	var allowedAccess = false;
	if (pageRegister[hash[0]] == undefined){
		alert("Default page");
		makePageCalls(_homePage);
	}
	for (var i = 0; i < userType.length; i++) {
		if($.inArray(userType[i], pageRegister[hash[0]].allowedUserTypes) != -1){
			if(hash.length<2) {
				hash[1]="$$_current_$$";
			}
			viewingAsId = hash[1];
			if (hash[2]){
				storedTokenValue=hash[2];
			}

			// 3 lines below are a copy of the above, using the reset token instead..
			if (resetToken){
				storedTokenValue=resetToken;
			}
			makePageCalls(hash[0]);
			allowedAccess = true;
			break;
		}
	}
	if(!allowedAccess) {
		viewingAsId = currentUserVar;
		makePageCalls("login");
	}

} else if (hash[0] != "login") {

	alert("Calling checkLoginAndDirect at 1");
	_user.checkLoginAndDirect();

} else {

	makePageCalls(_loginPage);

}

/* This code below is about removing url paramaters (the type wwhich are separated by underscores) once the framework has gotten hold of the value */
$(window).bind('hashchange', function(){
	if(pageCallInOp != true && !preventHashChange){
		hash = window.location.hash.substring(1).split("_");
		if (typeof(hash[0]) == "undefined" || hash[0]=="login") {
			alert("Calling checkLoginAndDirect at 3");
			checkLoginAndDirect();
		} else {

			if(hash.length<2) {
				hash[1]="$$_current_$$";
			}

			viewingAsId = hash[1];
			userType=_user.getUserTypes();
			var allowedAccess = false;
			for (var i = 0; i < userType.length; i++) {
				if($.inArray(userType[i], pageRegister[hash[0]].allowedUserTypes) != -1){
					makePageCalls(hash[0]);
					allowedAccess = true;
					break;
				}
			}
			if(!allowedAccess) {
				viewingAsId = currentUserVar;
				if (window.location.hostname.match(/cuser/)){
					top.location="/#login"; // by not doing make page calls we force a redirect if the user is signed up
				} else {
					top.location="#login"; // by not doing make page calls we force a redirect if the user is signed up
				}
			}
		}
	}
});

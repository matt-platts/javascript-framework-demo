// login.js

$(document).ready(function(){
	if(readCookie("returningUser")) {
		var returningUser = readCookie("returningUser");
		$('#username').val(returningUser);
	}
});

// check for a return signup string
function check_for_retarget_on_login(userVar){
	if (location.search){
		var search_pairs=location.search.split("&");
		for (i=0;i<search_pairs.length;i++){
		    	search_pair=search_pairs[i].split("=");
		    	if (search_pair[0]=="?target"){
				$.getScript( "//www.mattplatts.com/demo/js-framework/javascripts/external/track_signup_return.js.php?u=" + userVar + "&t=" + search_pair[1] )
			  	.done(function( script, textStatus ) {
					//alert("Got script");
					path=document.URL.split("?")[0];
					locstr=path + "#login";
					window.location=locstr;
				})
				.fail(function( jqxhr, settings, exception ) {
					//alert("Not got script");
				});
			 }
		}
	}
}

$('.loginBasic').click(function() {
	validateInputsBasic();
        trackEvent('HomePage', 'Login');
    }
);

$(document).keypress(function(e) {
    if(e.which == 13 && $("#loginFormBasic #password").is(":focus")) {
    	$('.loginBasic').click();
    }
});

function childUsesAutoGenPassword(password, firstname){
	//check that the password is not equal to "pass+firstname"
	var passwordToMatch= "pass"+firstname;
	if(password==passwordToMatch){
		return true;
	}
	return false;
}

function validateInputsBasic(){
	var formArray = $("#loginFormBasic").serializeObject();
	var passwordCheck = $("#password").val();

        $.ajax({
        	url: apiPath + 'user/login/api-login',
                async: false,
                data: formArray,
                type: 'POST',
                dataType: 'json',
		success: function( retrievedData ){
			// if a group, redirect to the group page
			if (retrievedData.loggedIn==true && retrievedData.isGroupAdmin==true){

				createCookie("GroupID",retrievedData.groupId);
				globalGroupId = retrievedData.groupId;
				_groupId_ = retrievedData.groupId;
				makePageCalls("schoolsHome");
				return;

		       	}

			if (retrievedData.loggedIn ==true) {

			//GET USER TYPE FOR REDIRECT
			$.ajax({
				url: apiPath + 'user/details/'+ currentUserVar,
				async: false,
				data: {"type" : "basic"},
				type: 'GET',
				dataType: 'json',
				success: function( retrievedData ){
					//ADD USERNAME TO COOKIE LIST FOR RETURNING USERS
					createCookie("returningUser", retrievedData["user"]["username"], 90);

					createCookie("UserId",retrievedData["user"]["userId"],2);

				alert(retrievedData["user"]["userType"]);
					if (retrievedData["user"]["userType"]["CHILD"] == true) {
						viewingAsId = currentUserVar;

						if(retrievedData["user"]["status"]=="PENDING") {
							makePageCalls("childFirstSecurity");
						} else { //if the child is still using the auto-generated password, forward them to change the password.
							if(childUsesAutoGenPassword(passwordCheck, retrievedData["user"].firstName)){
								makePageCalls("childFirstSecurity");
							} else {
								makePageCalls("childSummary");
							}
						}
					};
					if(retrievedData["user"]["userType"]["RELATIVE"] == true && retrievedData["user"]["userType"]["PARENT"] == false) {
						viewingAsId = currentUserVar;
						makePageCalls("relativeSummary");
					};
					if(retrievedData["user"]["userType"]["USER"] == true) {
						alert("ITS A USER type of user");
						makePageCalls("home");		
					};
					if(retrievedData["user"]["userType"]["PARENT"] == true) {
						check_for_retarget_on_login(retrievedData["user"]["userId"]);
						//If parent does not have any children yet, send them to setup kids to complete the setup process
						//fetch kids for this parent
						$.ajax({
							url: apiPath + 'user/details/',
							async: false,
							data: {"childrenOf" : "$$_current_$$"},
							type: 'GET',
							dataType: 'json',
							statusCode : {
								200 : function(data, textStatus, XMLHttpRequest) {
									if (typeof data["users"] == 'undefined' || data["users"] == null) {
										makePageCalls("signupTwo");
									} else {
										var cycleChildVar="";
										var kidscounter=0;
										for (cycleChildVar in data["users"]) {
											kidscounter++;
										}
										if(kidscounter>0){
											//alert("2");
											//check if there is a page identifier present, if there is, take parent to this page instead of the parent summary
											//window.hash holds a comma separated string. First element holds the pageIdentifier of where to go to next.
											var aHash = window.hash;
											var pageID=aHash.shift();
											if (pageID !== "login" && pageID != "undefined" && pageID !== '' && pageID !== "password" && pageID != undefined){
												//redirect to the requested page
												makePageCalls(pageID);
											} else {
											 // if the signup process is not complete, direct user to the appropriate part of signup..
											 if (retrievedData["user"].joinFormStatus=="YOUR_CHILDREN"){
												makePageCallsMobile("signupTwo", "signupTwoM");
											  } else if (retrievedData["user"].joinFormStatus=="YOUR_SECURITY"){
												makePageCallsMobile("signupConfirmID", "signupConfirmIDM");
											  } else if (retrievedData["user"].joinFormStatus=="FUND_ACCOUNT"){

												joinFromDataArray=Array;
												joinFromDataArray["userId"]=retrievedData["user"]["userId"];
												joinFromDataArray["joinFormStatus"]=3;

												$.ajax({
													url: apiPath + 'user/user/api-update-join-form-status',
													data: joinFromDataArray,
													type: 'POST',
													success: function ( joinFromData) {

													}
												});

												makePageCallsMobile("signupConfirmID", "signupConfirmIDM");
											  } else {
												makePageCalls("home");
											  }
											}
										} else {
											makePageCallsMobile("signupTwo", "signupTwoM");
										}
									}
								},
								400 : function(data, textStatus, XMLHttpRequest) {
									makePageCallsMobile("signupTwo", "signupTwoM");
								},
								500 : function(data, textStatus, XMLHttpRequest) {
									makePageCallsMobile("signupTwo", "signupTwoM");
								}
							}
						});
						};
					}
				});

		       } else {
				if(retrievedData["error"]){
					if(retrievedData["errorCode"]==29004){
						//user is already logged in, just forward to the summary screen, depening if it is a child, relative or parent
						document.location.reload();
					} else if (retrievedData["errorCode"]==29111) {
						$("#loginFormBasic input").addClass('error');
						$("#login-unauthorized").html("<label>"+ retrievedData['errorMessage'] +"</label>")
						$("#login-unauthorized").fadeOut(300,function(){ $(this).delay(50).fadeIn()});
						$("#login-unauthorized").attr("style","display:inline !important");
					} else {
						$("#loginFormBasic input").addClass('error');
						$("#login-unauthorized").html("<label>Invalid username or password</label>")
						$("#login-unauthorized").fadeOut(300,function(){ $(this).delay(50).fadeIn()});
						$("#login-unauthorized").attr("style","display:inline !important");
					}
				} else {
					$("#loginFormBasic input").addClass('error');
					$("#login-unauthorized").html("<label>Invalid username or password</label>")
					$("#login-unauthorized").fadeOut(300,function(){ $(this).delay(50).fadeIn()});
					$("#login-unauthorized").attr("style","display:inline !important");
				}
			}
		}
	});

}

$('.forgottenCredentials').click(function() {
	//alert("go to credentials");
	makePageCalls("forgottenCredentials");
});

$('#passwordlabel').focusin(function(){
		//alert("pw");
		//focus on passwordfield - hide passwordlabelfield and show real password field
		$('#passwordlabel').addClass("hidden");
		$('#password').removeClass("hidden");
		$('#password').focus();
		//makePageCalls("forgottenCredentials");
});

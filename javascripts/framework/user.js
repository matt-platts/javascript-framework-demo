/* user.js */

function user(){

/*
 * Function : checkLoginAndDirect
 * Meta: If the user is already logged in when the login page is called, this function is called to redirect the user to where they should be
 *       Otherwise, redirect them to the login page
*/
user.prototype.checkLoginAndDirect = function(){
	alert("Landed on checkLoginAndDirect");
	$.ajax({
		url: apiPath + 'user/details/'+ currentUserVar,
		async: false,
		data: {
			"type" : "basic",
			"debug" : "true2"
		},
		type: 'GET',
		dataType: 'json',
		statusCode:{
			200: function(data, textStatus, XMLHttpRequest) {
				createCookie("UserId",data["user"]["userId"],2);
				if(data["user"]["userType"]["ADMIN"] == true) {
					viewingAsId = currentUserVar;
					makePageCalls("adminHome");
				};
				if(data["user"]["userType"]["USER"] == true) {
					makePageCalls("home");
				};
			},
			401: function() {
				// 401 unauthorized? Direct to login page
				alert("401ing - redir");
				makePageCalls(_loginPage);
			}
		}
	});
};

/* 
 * Function: getUserTypes()
 * Returns: array of user types applicable to the current user - (CHILD,PARENT,RELATIVE)
 * 	    Note that most users will be only one type, but you can be a parent AND a relative
*/
user.prototype.getUserTypes = function(){

	alert("getting user type");
	userTypes = new Array("all");
	$.ajax({
		url: apiPath + 'user/details/'+ currentUserVar,
		async: false,
		data: {
			"type" : "basic",
			"debug" : "true"
		},
		type: 'GET',
		dataType: 'json',
		statusCode:{
		    200: function(data, textStatus, XMLHttpRequest) {
			if(data["user"]["userType"]["CHILD"] == true) {
			    userTypes.push("child");
			};
			if(data["user"]["userType"]["RELATIVE"] == true) {
			    userTypes.push("relative");
			};
			if(data["user"]["userType"]["PARENT"] == true) {
			    userTypes.push("parent");
			};
		    },
		    401: function() {
		       //if( window.location.hash != "#password" ){
	alert("no auth so its external");
			   userTypes.push("external");
		       //}
		    }
		}
	});
	alert(userTypes);
    return userTypes;

}

}

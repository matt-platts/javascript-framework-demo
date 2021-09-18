$(".logout").click(function() {
        $.ajax({
        	url: apiPath + 'user/login/api-logout',
                data: '',
                type: 'GET',
                dataType: 'json',
                success: function(data){
			viewingAsId=currentUserVar;
			window.location=homeURL;
                }
         });
});

$("#feedback-link").click(function() {
    makePageCalls("feedbackForm");
});

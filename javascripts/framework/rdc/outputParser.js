rdc.rdOutputParser = {
		loader :
		{
			mini : '<span class=\'miniloader\'/>',
			thumb : '<span style=\'width:29px\'/>',
		},
		'parseInto': function(listener, value)
		{

			rdc.rdOutputParser[listener.outParserId](value, listener.targetHandler);

		},
		'amount_html': function(response, targetHandler)
		{

			if (response == null)
				var content = this.loader.mini;
			else
			{
				value = parseFloat(response['balance'].realFisBal).toFixed(2);
				var content = '&#163;'+value;
			}

			targetHandler.html(content);
		},
		'spending_html': function(response, targetHandler)
		{

			if (response == null)
				var content = this.loader.mini;
			else
			{
				value = parseFloat(response['balance'].realBal).toFixed(2);
				var content = '&#163;'+value;
			}

			targetHandler.html(content);
		},
		'saving_html': function(response, targetHandler)
		{

			if (response == null)
				var content = this.loader.mini;
			else
			{
				value = parseFloat(response['balance'].savings).toFixed(2);
				var content = '&#163;'+value;
			}

			targetHandler.html(content);
		},
		'av_funds_html': function(response, targetHandler)
		{

			if (response == null) {
				var content = this.loader.mini;
			} else {
				value = parseFloat(response['balance'].avFunds).toFixed(2);
				var content = '&#163;'+value;
			}
			targetHandler.html(content);
		},
		'first_name': function(response, targetHandler){
			if (response == null)
				var content = this.loader.mini;
			else
				var content = response['user'].firstName;

			targetHandler.html(content);
		},
		'callback' : function(response, targetHandler) {

			if (response){
				targetHandler(response);
			}

		},
		'user_thumbnail' : function(response, targetHandler) {
			if (response == null) {
				var content = this.loader.thumb;
			} else {
				var user = response['user'];
				var imgSrc = getProfileImageSrc(user.imageId, user.gender, "PARENT", "small");


				var content = '<img class="tiny-profile-image" src="'+imgSrc+'" alt="'+user.firstName+'" width="29" height="29" />';
			}
			targetHandler.html(content);
		},
		'available_to_spend': function(response, targetHandler){

			if (response == null) {
				var content = this.loader.mini;
			} else {
				value = parseFloat(response['balance'].avFunds).toFixed(2);
				if (value<0){ value="0.00";}
				var content = '&#163;'+value;

				if( $(targetHandler).parent().find(".strikeAmount").length > 0 ) {
				    var sizeStrike = $(targetHandler).attr("id") != "amt_avail" ? (value.length+1)*11 : (value.length+1)*10;
				    var lessMargin = $(targetHandler).attr("id") != "amt_avail" ? 3 : 2;
				    $(targetHandler).parent().find(".strikeAmount").css({
					"width" : sizeStrike + "px",
					"margin-left":  -(sizeStrike - lessMargin) + "px"
				    });
				}

			}

			targetHandler.html(content);
		}
	};

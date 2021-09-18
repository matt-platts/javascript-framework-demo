$.ajaxSetup({
	error: function(xhr, status, err) {
		if (xhr.status == 401 && window.location.hash != "#password") {
			makePageCalls("login");
		}
	}
});


$.fn.serializeObject = function(){
	var o = {};
	var a = this.serializeArray();

	$.each(a, function() {
		if (o[this.name]) {
			if (!o[this.name].push) {
				o[this.name] = [o[this.name]];
			}
			o[this.name].push(this.value || '');
		} else {
			o[this.name] = this.value || '';
		}
	});
       return o;
};

var accountType;
var errorMailMessage="This email address is not valid.";
var errorUsernameMessage="";

// Add this behavior to all text fields
$("input[type=text]").focus(function(){
	this.select();
});

function validateFormNew(formID, accountType, scroll){
	$('#'+ formID +" .error-warning").html("&nbsp;");
	//alert("validate form"+formID);
	//if form validates return true else return false.
    	var errorCount = 0;
    	$('#'+ formID+' :input').each(function() {
        var currentInput = $(this);
	var errorWarning = new Array();

        if ((currentInput.is(".required") && currentInput.val()=='') || (currentInput.is(".numeric") && $(this).val()!="" && !$.isNumeric($(this).val())) || (currentInput.is(".positive") && $(this).val()!="" && parseFloat($(this).val()) < 0) || (currentInput.is(".noZero") && $(this).val()!="" && parseFloat($(this).val()) == 0)) {
            currentInput.addClass('error');
            //check positive
            if(currentInput.is(".positive") && $(this).val()!="" && parseFloat($(this).val()) < 0) {
            	errorWarning.push("Please enter a value higher than or equal to 0.");
                currentInput.addClass('error-input');
            }

          //check positive higher than 0
            if(currentInput.is(".noZero") && $(this).val()!="" && parseFloat($(this).val()) == 0) {
            	errorWarning.push("This field must be a value higher than 0.");
                currentInput.addClass('error-input');
            }

            //check numeric
            if(currentInput.is(".numeric") && $(this).val()!="" && !$.isNumeric($(this).val())) {
                errorWarning.push("This field must be numeric.");
                currentInput.addClass('error-input');
            }

            //check required
            if (currentInput.is(".required") && currentInput.val()=='') {
                if(currentInput.is("select")){
                    errorWarning.push("Please select an option from the drop-down.");
                } else {
                    errorWarning.push("This information is required.");
                }
                currentInput.addClass('error-input');
            }

            if(currentInput.next(".info").is(".info")){
                    currentInput.next(".info").after('<span class=\"error-warning fc_error\" >'+errorWarning.join('<br />')+'</span><div class=\"clear\"> </div>');
	    } else {

                    currentInput.next(".error-warning").hide();
                    currentInput.next('span').children(".error-warning").html('<span class=\"error-warning fc_error\" >'+ errorWarning.join('<br />'));
                    //currentInput.closest(".error-warning").html('<span class=\"error-warning fc_error\" >'+ errorWarning.join('<br />'));
		    if (currentInput.hasClass("lookup-by-id")){
			message_el_name="msg_" + $(this).attr("id");
			$("#" + message_el_name).html('<span class=\"error-warning fc_error\" >'+ errorWarning.join('<br />'));
		    }
		}
				errorCount++;
        } else {
            currentInput.removeClass('error');
            currentInput.removeClass('error-input');
        }

    });

    var moreThanOne=0;
    $('#'+ formID +' .more-than-one input').each(function() {
        var currentCheck = $(this);
        if (currentCheck.is(':checked')) moreThanOne++;
    });
    if(moreThanOne==0 && $('#'+ formID +' .more-than-one input').length>0) errorCount++;

    $('#'+ formID +' .must-be-true').each(function() {
        var currentCheck = $(this);
        if (!currentCheck.is(':checked')) {
            currentCheck.addClass('error');
            errorCount++;
        }
    });

    //check phone numbers
    $('#'+ formID +' .phone').each(function() {
            if($(this).val()!="" && !$.isNumeric($(this).val().replace(/ /g,""))) {

                $(this).addClass('error');
                if($(this).next(".info").is(".info")){
                    $(this).next(".info").after('<span class=\"error-warning\" >This is not a valid phone number.</span><div class=\"clear\"> </div>');
                } else {
                    $(this).after('<span class=\"error-warning\" >This is not a valid phone number.</span><div class=\"clear\"> </div>');
                }
            }
    });

    //check card numbers
    $('#'+ formID +' .card-number').each(function() {
            if(!$(this).validateCreditCard()) {
                $(this).addClass('error');
                if($(this).next(".info").is(".info")){
                    $(this).next(".info").after('<span class=\"error-warning\" >This is not a valid card number.</span><div class=\"clear\"> </div>');
                } else {
                    $(this).after('<span class=\"error-warning\" >This is not a valid card number.</span><div class=\"clear\"> </div>');
                }
                errorCount++;
            }
    });

    //email check
    $('#'+ formID +' #email').each(function() {
        var currentCheck = $(this);
		  if ($(this).val()){
			if (!validateEmail(currentCheck.val(), accountType)) {
			//alert("email check was NOT valid");
			currentCheck.addClass('error');
			if($('#'+ formID +' #email').next(".info").is(".info")){
				$('#'+ formID +' #email').next(".info").after('<span class=\"error-warning\" >'+errorMailMessage+'</span><div class=\"clear\"> </div>');
				} else {
					$('#'+ formID +' #email').after('<span class=\"error-warning\" >'+errorMailMessage+'</span><div class=\"clear\"> </div>');
				}
				errorCount++;
			}
		  }
    });

    //existing email check
    $('#'+ formID +' .email-exist').each(function() {
        var currentCheck = $(this);
        if(!IsEmail(currentCheck.val())) {
        	//alert("email check was NOT valid");
            currentCheck.addClass('error');

            if($(this).next(".info").is(".info")){
                    $(this).next(".info").after('<span class=\"error-warning\" >This is not a valid e-mail address.</span><div class=\"clear\"> </div>');
                } else {
                    $(this).after('<span class=\"error-warning\" >This is not a valid e-mail address.</span><div class=\"clear\"> </div>');
                }
            errorCount++;
        }
    });

  //existing username check
    $('#'+ formID +' .username-exist').each(function() {
        var currentCheck = $(this);
        if (!validateUsername(currentCheck.val(), accountType)) {
        	//alert("username check was NOT valid");
            currentCheck.addClass('error');

            if($(this).next(".info").is(".info")){
                    $(this).next(".info").after('<span class=\"error-warning\" >This username already exists, please enter a different username.</span><div class=\"clear\"> </div>');
                } else {
                    $(this).after('<span class=\"error-warning\" >This username already exists, please enter a different username</span><div class=\"clear\"> </div>');
                }
            errorCount++;
        }
    });

    if($('#'+ formID +' .address-extra').is(":hidden")) {
        errorCount++;
        $("#"+ formID +" .manual-enter").after('<span class=\"error-warning\" >Please use the post code input and options to enter an address.</span><div class=\"clear\"> </div>');
    }

    //Gender check
    var genderSelected = false;
    $("#"+ formID +" .gender").each(function(){
        if($(this).is(":checked")) {
            genderSelected = true;
        }
    });
    if($("#"+ formID +" .gender").length ==0) {
        genderSelected = true;
    }

    if(!genderSelected){
        //$("#"+ formID +" .gender").last().next().after('<span class=\"error-warning\" >Please select a gender.</span><div class=\"clear\"> </div>');
		  $("#" + formID + " #msg_gender").html('<span class=\"error-warning\" >Please select a gender.</span><div class=\"clear\"> </div>');
        errorCount++;
    }

    //Double month and year checks
    if(!checkMonthInputs(formID)){
        errorCount++;
    }
    if(!checkYearInputs(formID)){
        errorCount++;
    }

    //Expiry Date Check
    if($(".expiry-year").length>0 && $(".expiry-year").val().length>0 && $(".expiry-month").val().length>0) {
        var dateString = $('.expiry-year').val() + "/" +  $('.expiry-month').val() +  "/01";
        var expiryDate = new Date(dateString);
        var cDate = new Date();
        var currentString = cDate.getFullYear() + "/" +  (cDate.getMonth()+1) +  "/01";
        var currentDate = new Date(currentString);
        if(expiryDate<currentDate){
            $(".expiry-year").after('<span class=\"error-warning\" >The expiry date has already passed.</span><div class=\"clear\"> </div>');
            errorCount++;
        }
    }
    //
    //Start Date Check
    if($(".start-year").length>0 && $(".start-year").val().length>0 && $(".start-month").val().length>0) {
        var dateString = $('.start-year').val() + "/" +  $('.start-month').val() +  "/01";
        var expiryDate = new Date(dateString);
        var cDate = new Date();
        var currentString = cDate.getFullYear() + "/" +  (cDate.getMonth()+1) +  "/01";
        var currentDate = new Date(currentString);
        if(expiryDate>currentDate){
            $(".start-year").after('<span class=\"error-warning\" >The start date has not yet passed.</span><div class=\"clear\"> </div>');
            errorCount++;
        }
    }
    //

    //DOB check
    if($("#"+ formID +" #dob-day").length>0){
        var dobString = $('#dob-year').val() + "/" +  $('#dob-month').val() +  "/" + $('#dob-day').val();
        var date = new Date(dobString);
        if ( !(date && (date.getMonth() + 1) == $('#dob-month').val() && date.getDate() == Number($('#dob-day').val()))) {
            $('#dob-day').addClass("error");
            $('#dob-month').addClass("error");
            $('#dob-year').addClass("error");

                if($(".dob").next(".info").is(".info")){
                    $(".dob").next(".info").after('<span class=\"error-warning\" >Please insert a valid date.</span><div class=\"clear\"> </div>');
                } else {
                    $(".dob").after('<span class=\"error-warning\" >Please insert a valid date.</span><div class=\"clear\"> </div>');
                }
            errorCount++;
        }
    }

    //Date check
    if($("#"+ formID +" .date-day").length>0){
        var dobString = $('.date-year').val() + "/" +  $('.date-month').val() +  "/" + $('.date-day').val();
        var date = new Date(dobString);
        if( !(date && (date.getMonth() + 1) == $('.date-month').val() && date.getDate() == Number($('.date-day').val()))) {
            $('.date-day').addClass("error");
            $('.date-month').addClass("error");
            $('.date-year').addClass("error");

                if($(".date").next(".info").is(".info")){
                    $(".date").next(".info").after('<span class=\"error-warning\" >Please insert a valid date.</span><div class=\"clear\"> </div>');
                } else {
                    $(".date").after('<span class=\"error-warning\" >Please insert a valid date.</span><div class=\"clear\"> </div>');
                }
            errorCount++;
        }
    }

    //check passwords
    if($(".passwords").length>0){
        var passwordError = 0;
        var passwordErrorWarnings = new Array();
        var passwordsEntered = true;
        if($(".passwords:eq(1)").val()=="" || $(".passwords:eq(0)").val()=="") {
            passwordErrorWarnings.push("Both password fields are required.");
            $(".passwords").addClass('error');
            passwordError++;
            errorCount++;
            passwordsEntered = false;
        }
        if(passwordsEntered && $(".passwords:eq(1)").val()!="" && $(".passwords:eq(1)").val() != $(".passwords:eq(0)").val()) {
            passwordErrorWarnings.push("Both passwords should match.");
            passwordError++;
            errorCount++;
        }
        if(passwordsEntered && $(".passwords:eq(0)").val().length < 6) {
            passwordErrorWarnings.push("Passwords must be at least 6 characters.");
            passwordError++;
            errorCount++;
        }
        if(passwordsEntered && !alphaNumericCheck($(".passwords:eq(0)").val())) {
            passwordErrorWarnings.push("Passwords must only contain letters and numbers.");
            passwordError++;
            errorCount++;
        }

        if(passwordError>0) {
				/*
            $(".passwords").last().next('.warning-required').html(passwordErrorWarnings.join(" ")).removeClass('hidden');
            $(".passwords").after('<span class=\"error-warning\" >'+passwordErrorWarnings.join(" ")+'</span><div class=\"clear\"> </div>');
            $(".passwords").addClass('error');
            $(".passwords").addClass('error');
				*/


				$("#password-error-message").html('<span class=\"error-warning fc_error\" >'+ passwordErrorWarnings.join('<br />'));
        }
    }


	if($('#'+ formID+' .error-warning').first().length >0) {
		//alert(formID);
		if (scroll){
			$('html,body').animate({
			scrollTop: $('#'+ formID+' .error-warning').first().offset().top-180},
			'slow');
		}

	};

	if(errorCount==0){
		return true;
	} else {
		return false;
	}
}

function validateForm(formID, accountType) {
	$('#'+ formID+" .error-warning").remove();
	//alert("validate form"+formID);
	//if form validates return true else return false.
	var errorCount = 0;
    	$('#'+ formID+' :input').each(function() {
        var currentInput = $(this);
        var errorWarning = new Array();

        if ((currentInput.is(".required") && currentInput.val()=='') || (currentInput.is(".numeric") && $(this).val()!="" && !$.isNumeric($(this).val())) || (currentInput.is(".positive") && $(this).val()!="" && parseFloat($(this).val()) < 0) || (currentInput.is(".noZero") && $(this).val()!="" && parseFloat($(this).val()) == 0)) {
            currentInput.addClass('error');
            //check positive
            if(currentInput.is(".positive") && $(this).val()!="" && parseFloat($(this).val()) < 0) {
            	errorWarning.push("This field must be a value higher than or equal to 0.");
                currentInput.addClass('error-input');
            }

          //check positive higher than 0
            if(currentInput.is(".noZero") && $(this).val()!="" && parseFloat($(this).val()) == 0) {
            	errorWarning.push("This field must be a value higher than 0.");
                currentInput.addClass('error-input');
            }

            //check numeric
            if(currentInput.is(".numeric") && $(this).val()!="" && !$.isNumeric($(this).val())) {
                errorWarning.push("This field must be numeric.");
                currentInput.addClass('error-input');
            }

            //check required
            if (currentInput.is(".required") && currentInput.val()=='') {
                if(currentInput.is("select")){
                    errorWarning.push("Please select an option from the drop-down.");
                } else {
								errorWarning.push("This information is required.");
                }
            }

            if(currentInput.next(".info").is(".info")){
                    currentInput.next(".info").after('<span class=\"error-warning fc_error\" >'+errorWarning.join('<br />')+'</span>');
                } else {
						  if (currentInput.attr("id")=="cvv"){}else {
								currentInput.after('<span class=\"error-warning fc_error\" >'+ errorWarning.join('<br />') +'</span>');
						  }
                }
            errorCount++;
        } else {
            currentInput.removeClass('error');
            currentInput.removeClass('error-input');
        }

    });

    var moreThanOne=0;
    $('#'+ formID +' .more-than-one input').each(function() {
        var currentCheck = $(this);
        if (currentCheck.is(':checked')) moreThanOne++;
    });
    if(moreThanOne==0 && $('#'+ formID +' .more-than-one input').length>0) errorCount++;

    $('#'+ formID +' .must-be-true').each(function() {
        var currentCheck = $(this);
        if (!currentCheck.is(':checked')) {
            currentCheck.addClass('error');
            errorCount++;
        }
    });

    //check phone numbers
    $('#'+ formID +' .phone').each(function() {
            if($(this).val()!="" && !$.isNumeric($(this).val().replace(/ /g,""))) {

                $(this).addClass('error');
                if($(this).next(".info").is(".info")){
                    $(this).next(".info").after('<span class=\"error-warning\" >This is not a valid phone number.</span>');
                } else {
                    $(this).after('<span class=\"error-warning\" >This is not a valid phone number.</span>');
                }
            }
    });

    //check card numbers
    $('#'+ formID +' .card-number').each(function() {

            if( !$(this).validateCreditCard() ) {
                $(this).addClass('error');
                if($(this).next(".info").is(".info")){
                    $(this).next(".info").after('<span class=\"error-warning\" >This is not a valid card number.</span>');
                } else {
                    $(this).after('<span class=\"error-warning\" >This is not a valid card number.</span>');
                }
                errorCount++;
            }
    });

    //email check
    $('#'+ formID +' #email').each(function() {
        var currentCheck = $(this);
        if (!validateEmail(currentCheck.val(), accountType)) {
        	//alert("email check was NOT valid");
            currentCheck.addClass('error');

            if($('#'+ formID +' #email').next(".info").is(".info")){
                    $('#'+ formID +' #email').next(".info").after('<span class=\"error-warning\" >'+errorMailMessage+'</span>');
                } else {
                    $('#'+ formID +' #email').after('<span class=\"error-warning\" >'+errorMailMessage+'</span>');
                }
            errorCount++;
        }
    });

    //existing email check
    $('#'+ formID +' .email-exist').each(function() {
        var currentCheck = $(this);
        if(!IsEmail(currentCheck.val())) {
        	//alert("email check was NOT valid");
            currentCheck.addClass('error');

            if($(this).next(".info").is(".info")){
                    $(this).next(".info").after('<span class=\"error-warning\" >This is not a valid e-mail address.</span>');
                } else {
                    $(this).after('<span class=\"error-warning\" >This is not a valid e-mail address.</span>');
                }
            errorCount++;
        }
    });

  //existing username check
    $('#'+ formID +' .username-exist').each(function() {
        var currentCheck = $(this);
        if (!validateUsername(currentCheck.val(), accountType)) {
        	//alert("username check was NOT valid");
            currentCheck.addClass('error');

            if($(this).next(".info").is(".info")){
                    $(this).next(".info").after('<span class=\"error-warning\" >This username already exists, please enter a different username.</span>');
                } else {
                    $(this).after('<span class=\"error-warning\" >This username already exists, please enter a different username</span>');
                }
            errorCount++;
        }
    });

    if($('#'+ formID +' .address-extra').is(":hidden")) {
        errorCount++;
        $("#"+ formID +" .manual-enter").after('<span class=\"error-warning\" >Please use the post code input and options to enter an address.</span>');
    }

    //Gender check
    var genderSelected = false;
    $("#"+ formID +" .gender").each(function(){
        if($(this).is(":checked")) {
            genderSelected = true;
        }
    });
    if($("#"+ formID +" .gender").length ==0) {
        genderSelected = true;
    }

    if(!genderSelected){
        $("#"+ formID +" .gender").last().next().after('<span class=\"error-warning\">Please select a gender.</span>');
        errorCount++;
    }

    //Double month and year checks
    if(!checkMonthInputs(formID)){
        errorCount++;
    }
    if(!checkYearInputs(formID)){
        errorCount++;
    }

    //Expiry Date Check
    if($(".expiry-year").length>0 && $(".expiry-year").val().length>0 && $(".expiry-month").val().length>0) {
        var dateString = $('.expiry-year').val() + "/" +  $('.expiry-month').val() +  "/01";
        var expiryDate = new Date(dateString);
        var cDate = new Date();
        var currentString = cDate.getFullYear() + "/" +  (cDate.getMonth()+1) +  "/01";
        var currentDate = new Date(currentString);
        if(expiryDate<currentDate){
            $(".expiry-year").after('<span class=\"error-warning\" >The expiry date has already passed.</span>');
            errorCount++;
        }
    }
    //
    //Start Date Check
    if($(".start-year").length>0 && $(".start-year").val().length>0 && $(".start-month").val().length>0) {
        var dateString = $('.start-year').val() + "/" +  $('.start-month').val() +  "/01";
        var expiryDate = new Date(dateString);
        var cDate = new Date();
        var currentString = cDate.getFullYear() + "/" +  (cDate.getMonth()+1) +  "/01";
        var currentDate = new Date(currentString);
        if(expiryDate>currentDate){
            $(".start-year").after('<span class=\"error-warning\" >The start date has not yet passed.</span>');
            errorCount++;
        }
    }
    //

    //DOB check
    if($("#"+ formID +" #dob-day").length>0){
        var dobString = $('#dob-year').val() + "/" +  $('#dob-month').val() +  "/" + $('#dob-day').val();
        var date = new Date(dobString);
        if ( !(date && (date.getMonth() + 1) == $('#dob-month').val() && date.getDate() == Number($('#dob-day').val()))) {
            $('#dob-day').addClass("error");
            $('#dob-month').addClass("error");
            $('#dob-year').addClass("error");

                if($(".dob").next(".info").is(".info")){
                    $(".dob").next(".info").after('<span class=\"error-warning\" >Please insert a valid date.</span>');
                } else {
                    $(".dob").after('<span class=\"error-warning\" >Please insert a valid date.</span>');
                }
            errorCount++;
        }
    }

    //Date check
    if($("#"+ formID +" .date-day").length>0){
        var dobString = $('.date-year').val() + "/" +  $('.date-month').val() +  "/" + $('.date-day').val();
        var date = new Date(dobString);
        if( !(date && (date.getMonth() + 1) == $('.date-month').val() && date.getDate() == Number($('.date-day').val()))) {
            $('.date-day').addClass("error");
            $('.date-month').addClass("error");
            $('.date-year').addClass("error");

                if($(".date").next(".info").is(".info")){
                    $(".date").next(".info").after('<span class=\"error-warning\" >Please insert a valid date.</span>');
                } else {
                    $(".date").after('<span class=\"error-warning\" >Please insert a valid date.</span>');
                }
            errorCount++;
        }
    }

    //check passwords
    if($(".passwords").length>0){
        var passwordError = 0;
        var passwordErrorWarnings = new Array();
        var passwordsEntered = true;
        if($(".passwords:eq(1)").val()=="" || $(".passwords:eq(0)").val()=="") {
            passwordErrorWarnings.push("Both password fields are required.");
            $(".passwords").addClass('error');
            passwordError++;
            errorCount++;
            passwordsEntered = false;
        }
        if(passwordsEntered && $(".passwords:eq(1)").val()!="" && $(".passwords:eq(1)").val() != $(".passwords:eq(0)").val()) {
            passwordErrorWarnings.push("Both passwords should match.");
            passwordError++;
            errorCount++;
        }
        if(passwordsEntered && $(".passwords:eq(0)").val().length < 6) {
            passwordErrorWarnings.push("Passwords must be at least 6 characters.");
            passwordError++;
            errorCount++;
        }
        if(passwordsEntered && !alphaNumericCheck($(".passwords:eq(0)").val())) {
            passwordErrorWarnings.push("Passwords must only contain letters and numbers.");
            passwordError++;
            errorCount++;
        }

        if(passwordError>0) {
            $(".passwords").last().next('.warning-required').html(passwordErrorWarnings.join(" ")).removeClass('hidden');
            $(".passwords").after('<span class=\"error-warning\" >'+passwordErrorWarnings.join(" ")+'</span>');
            $(".passwords").addClass('error');
            $(".passwords").addClass('error');
        }
    }


    if($('#'+ formID+' .error-warning').first().length >0) {

			 $('html,body').animate({
				 scrollTop: $('#'+ formID+' .error-warning').first().offset().top-180},
			 'slow');

    };

    if(errorCount==0){
        return true;
    } else {
        return false;
    }
}

function checkPasswords(className) {

	var value = $('.' + className).val();
	var errorCount=0;
	var errorWarnings = new Array();

        if($('.' + className+":eq(1)").val() != $('.' + className+":eq(0)").val()) {
            $('.' + className).addClass('error');
            errorWarnings.push("The passwords do not match.");
            errorCount++;
        }

        if($('.' + className+":eq(0)").val().length < 6) {
            $('.' + className).addClass('error');
            errorWarnings.push("Passwords must be at least 6 characters.");
            errorCount++;
        }

        if(!alphaNumericCheck($('.' + className+":eq(0)").val())) {
            $('.' + className).addClass('error');
            errorWarnings.push("Passwords must only contain letters and numbers.");
            errorCount++;
        }

	if(errorCount!=0) {
            if($('.' + className+":eq(1)").next(".info").is(".info")){
                $('.' + className+":eq(1)").next(".info").after('<span class=\"error-warning\" >'+errorWarnings.join('<br />')+'</span><div class=\"clear\"> </div>');
            } else {
                $('.' + className+":eq(1)").after('<span class=\"error-warning\" >'+ errorWarnings.join('<br />') +'</span><div class=\"clear\"> </div>');
            }
	}

    if(errorCount==0) {
        return true;
    } else {
        return false;
    }
}

function checkHigherThan(formId, classNameLower, lowerLabel, classNameHigher, higherLabel) {

	var lowerValue = $(formId+' .' + classNameLower).val();
 	var higherValue = $(formId+' .' + classNameHigher).val();

	var errorCount=0;
	var errorWarnings = new Array();

	if(parseFloat($(formId+' .' + classNameLower).val()) > parseFloat($(formId+' .' + classNameHigher).val())) {
		$(formId+' .' + classNameLower).addClass('error');
		$(formId+' .' + classNameHigher).addClass('error');
		errorWarnings.push(""+lowerLabel+" cannot be higher than the "+higherLabel);
		errorCount++;
        }


	if(errorCount!=0) {
		if ($("#" + classNameLower + "Err")){

		//cuser2.pktmny.com/#home("#"+ formID +" .gender").last().next().after('<span class=\"error-warning\">Please select a gender.</span><div class=\"clear\"> </div>');
		$(formId+' #' + classNameLower + "Err").after('<span class=\"error-warning\" >'+ errorWarnings.join('<br />') +'</span><div class=\"clear\"> </div>');
		} else {
	     $(formId+' .' + classNameLower).after('<span class=\"error-warning\" >'+ errorWarnings.join('<br />') +'</span><div class=\"clear\"> </div>');
	}
	}

	if(errorCount==0) {
		return true;
	} else {
		return false;
	}
}

function differentFrom(classField1, classField2) {

	var firstValue = $('#' + classField1).val();
	var secondValue = $('#' + classField2).val();

	var jQueryObj1 =$('#' + classField1);
	var jQueryObj2 =$('#' + classField2);

	var errorCount=0;
	var errorWarnings = new Array();

	if(firstValue == secondValue) {

	    	jQueryObj1.addClass('error');
	    	jQueryObj2.addClass('error');
	            //errorWarnings.push("Your security questions cannot be the same, please enter 2 different security questions");
	        adaptWarningMessage(jQueryObj1, "Please select 2 different security questions.");
	        jQueryObj1.next('.warning-required').removeClass('hidden');
		errorCount++;
        }


	if(errorCount!=0) {
		$('.' + classField1).after('<span class=\"error-warning\" >'+ errorWarnings.join('<br />') +'</span><div class=\"clear\"> </div>');
	}

	if(errorCount==0) {
		return true;
	} else {
		return false;
	}
}

function alphaNumericCheck(valueToCheck){
	var regex=/^[0-9A-Za-z]+$/; //^[a-zA-z]+$/
	if(regex.test(valueToCheck)){
		return true;
	} else {
		return false;
	}
}

function validateEmail(valueToCheck, checkType){
	if(checkType=="RELATIVE") {
		dataToSend = {"email" : valueToCheck, "type" : checkType};
	} else {
		dataToSend = {"email" : valueToCheck};
	}

	var isValidEmail = true;

	$.ajax({
		url: apiPath + 'user/user/api-check-user-email',
                async: false,
                data: dataToSend,
                type: 'POST',
                dataType: 'json',
		success: function( retrievedData ){
			if(retrievedData["emailExists"]==true){
				isValidEmail = false;
				if(!retrievedData["errorMessage"]==""){
					errorMailMessage = retrievedData["errorMessage"];
				}
			}
		}
	});

	if(!IsEmail(valueToCheck)) { isValidEmail=false; }

	if(isValidEmail) {
		if(!IsEmail(valueToCheck)) isValidEmail=false;
		if(isValidEmail) {
			//alert("true");
			return true;
		} else {
			//alert("false");
			return false;
		}
	}
}

function IsEmail(email) {
	var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	return regex.test(email);
}

function validateUsername(valueToCheck, checkType){

	//Check if the username already exists in the database.
	var dataToSend = {"username" : valueToCheck};
	var isValidUsername = true;

	$.ajax({
	       	url: apiPath + 'user/user/api-check-username',
	       	async: false,
	       	data: dataToSend,
	       	type: 'POST',
	        dataType: 'json',
	       	success: function( retrievedData ){
			if(retrievedData["usernameExists"]==true){
				isValidUsername = false;
				if(!retrievedData["errorMessage"]==""){
					errorUsernameMessage = retrievedData["errorMessage"];
				}
			}
		}
	});

	return isValidUsername;
}

function getProfileImageSrc(imageId, gender, parentChild, size){
	var randomNumber = Math.random();

	if(gender == "UNSELECTED"){
		return apiPath + "media/images/profile-images/"+size+"/boy.jpg";
	}

	if(gender == "NONE") {
		if(imageId!= null && imageId!= 0) {
			return apiPath + "media/image/" + imageId + ".png#e" + randomNumber;
		} else {
			return apiPath + "media/images/profile-images/"+size+"/family.jpg"
		}
	}

	if(imageId!= null && imageId!= 0) {
		return apiPath + "media/image/" + imageId + ".png#e" + randomNumber;
	} else {
		if(gender == "MALE") {
			if(parentChild == "PARENT" || parentChild == "RELATIVE") {
				return apiPath + "media/images/profile-images/"+size+"/man.jpg"
			} else {
				return apiPath + "media/images/profile-images/"+size+"/boy.jpg"
			}
		} else {
			if(parentChild == "PARENT" || parentChild == "RELATIVE") {
				return apiPath + "media/images/profile-images/"+size+"/woman.jpg"
			} else {
				return apiPath + "media/images/profile-images/"+size+"/girl.jpg"
			}
		}
		return apiPath + "media/images/profile-images/"+size+"/man.jpg"
	}
}

function getProfileImageSrcFromUserId (userId, size) {
	userDetails = new Object();
    	$.ajax({
          url: apiPath + 'user/details/'+ userId,
          data: {"type" : "basic"},
          type: 'GET',
          async: false,
          dataType: 'json',
          success: function(data){
            userDetails = data;
          }
	});

	var parentChild = "PARENT";
        if(userDetails["user"]["userType"]["CHILD"] == true) {
        	parentChild = "CHILD";
        }

	return getProfileImageSrc(userDetails["user"].imageId, userDetails["user"].gender, parentChild, size);
}

function checkMonthInputs(formID){

	var monthError=0;

	$("#"+formID+" .month-input").each(function() {
	if($(this).val().length >0) {
		var month = + $(this).val();
		if(month<=0 || month>12 || $(this).val().length !=2) {
			$(this).next(".year-input").after('<span class=\"error-warning\" >The month you have entered is invalid.</span><div class=\"clear\"> </div>');
			monthError++;
		}
	}

        if($(this).val().length==0 && $(this).hasClass("required-month")) {
		$(this).next(".year-input").after('<span class=\"error-warning\" >The month selection is empty.</span><div class=\"clear\"> </div>');
		monthError++;
        }
	});

	if(monthError>0){
        	return false;
	} else {
        	return true;
	}
}

function checkYearInputs(formID){

	var yearError=0;

	$("#"+formID+" .year-input").each(function() {
	if($(this).val().length >0) {
		var year = + $(this).val();
		if($(this).val().length!=4) {
			$(this).after('<span class=\"error-warning\" >The year you have entered is invalid.</span><div class=\"clear\"> </div>');
			yearError++;
		}
	}
        if($(this).val().length==0 && $(this).hasClass("required-year")) {
                $(this).after('<span class=\"error-warning\" >The year selection is empty.</span><div class=\"clear\"> </div>');
                yearError++;
        }
    });

	if(yearError>0){
		return false;
	} else {
		return true;
	}
}

function validateFormOnPage(formID, accountType) {

	//remove all warning-messages on form
	$('#'+ formID+' .warning-required').each(function() {
		var currentInput = $(this);
		currentInput.addClass("hidden");
	});
	$('#'+ formID+' .error').each(function() {
		var currentInput = $(this);
		currentInput.removeClass("error");
	});

	var errorCount = 0;

        //check required
        $('#'+ formID+' :input:not(:hidden).required').each(function() {
            var currentInput = $(this);
            var croppedVal = currentInput.val().substr(0,5);
            if (currentInput.val()=='' || currentInput.val()=='UNSELECTED' || croppedVal=="e.g. ") {
                if(currentInput.is("select")){
                    currentInput.next('.warning-required').removeClass('hidden');
                    currentInput.addClass('error');
                    errorCount++;
                } else {
                	// alert("goes wrong:"+currentInput.attr("name"));
                	currentInput.next('.warning-required').removeClass('hidden');
                    currentInput.addClass('error');
                    errorCount++;
                }
            }
        });

        //check numeric
        $('#'+ formID+' .numeric').each(function() {
            var currentInput = $(this);
            if($(this).val()!="" && !$.isNumeric($(this).val())) {
                adaptWarningMessage(currentInput, "This field must be numeric.");
                currentInput.next('.warning-required').removeClass('hidden');
                currentInput.addClass('error');
                errorCount++;
            }
        });

        //check positive
        $('#'+ formID+' .positive').each(function() {
            var currentInput = $(this);
            if($(this).val()!="" && parseFloat($(this).val()) < 0) {
                adaptWarningMessage(currentInput, "This field must be positive.");
            	currentInput.next('.warning-required').removeClass('hidden');
                currentInput.addClass('error');
                errorCount++;
            }
        });

        //check special characters
        $('#'+ formID+' .specialchars').each(function() {
            var currentInput = $(this);

            var pattern = "[^a-z0-9\-\'\ ]";
        	re = new RegExp(pattern, "gi");
        	var str = currentInput.val();
        	var test = str.match(re);

            if(test!==null) {
                adaptWarningMessage(currentInput, "Unfortunately we are unable to accept special characters in this field.");
                currentInput.next('.warning-required').removeClass('hidden');
                currentInput.addClass('error');
                errorCount++;
            }
        });

        //check passwords
        if($(".passwords").length>0){
            var passwordError = 0;
            var passwordErrorWarnings = new Array();
            var passwordsEntered = true;
            if($(".passwords:eq(1)").val()=="" || $(".passwords:eq(0)").val()=="") {
                passwordErrorWarnings.push("Both password fields are required.");
                $(".passwords").addClass('error');
                passwordError++;
                errorCount++;
                passwordsEntered = false;
            }
            if(passwordsEntered && $(".passwords:eq(1)").val()!="" && $(".passwords:eq(1)").val() != $(".passwords:eq(0)").val()) {
                passwordErrorWarnings.push("Both passwords should match.");
                passwordError++;
                errorCount++;
            }
            if(passwordsEntered && $(".passwords:eq(0)").val().length < 6) {
                passwordErrorWarnings.push("Passwords must be at least 6 characters.");
                passwordError++;
                errorCount++;
            }
            if(passwordsEntered && !alphaNumericCheck($(".passwords:eq(0)").val())) {
                passwordErrorWarnings.push("Passwords must only contain letters and numbers.");
                passwordError++;
                errorCount++;
            }

            if(passwordError>0) {
                $(".passwords").last().next('.warning-required').html(passwordErrorWarnings.join(" ")).removeClass('hidden');
                $(".passwords").addClass('error');
            }
        }

        //check more than one checked
        var moreThanOne=0;
        $('#'+ formID +' .more-than-one input').each(function() {
            var currentCheck = $(this);
            if (currentCheck.is(':checked')) moreThanOne++;
        });
        if(moreThanOne==0 && $('#'+ formID +' .more-than-one input').length>0) errorCount++;


        //check whether check box is true
        $('#'+ formID +' .must-be-true').each(function() {
            var currentCheck = $(this);
            if (!currentCheck.is(':checked')) {
                currentCheck.addClass('error');
                currentCheck.next('.warning-required').removeClass('hidden');
                errorCount++;
            }
        });

        //check phone numbers
        $('#'+ formID +' .phone').each(function() {
            if($(this).val()!="" && !$.isNumeric($(this).val().replace(/ /g,""))) {
                currentInput=$(this);
                adaptWarningMessage(currentInput, "This must be a valid phone number.");
            	currentInput.next('.warning-required').removeClass('hidden');
                currentInput.addClass('error');
                errorCount++;
            }
        });

        //check card numbers
        $('#'+ formID +' .card-number').each(function() {
            if(!$(this).validateCreditCard()) {
                currentInput=$(this);
                adaptWarningMessage(currentInput, "This is not a valid card number.");
            	currentInput.next('.warning-required').removeClass('hidden');
                currentInput.addClass('error');
                errorCount++;
            }
        });

        //email check
        $('#'+ formID +' .email').each(function() {
            var currentCheck = $(this);
            if (!validateEmail(currentCheck.val(), accountType) || !IsEmail(currentCheck.val())) {
                currentInput=$(this);
               // alert("email check");
                adaptWarningMessage(currentInput, errorMailMessage);
            	currentInput.next('.warning-required').removeClass('hidden');
                currentInput.addClass('error');
                errorCount++;
            }
        });

      //email check
        $('#'+ formID +' .confirm-email').each(function() {
            var currentCheck = $(this);
            var other_email=$('#'+ formID +' .email');
            if (currentCheck.val() != other_email.val()) {
                currentInput=$(this);
            	currentInput.next('.warning-required').removeClass('hidden');
                currentInput.addClass('error');
                errorCount++;
            }
        });


        //existing username check
        $('#'+ formID +' .username-exist').each(function() {
            var currentCheck = $(this);
            if(currentCheck.val() != ""){
	            if (!validateUsername(currentCheck.val(), accountType)) {
	            	//alert("username check was NOT valid");

	                var errorUsernameMessage="This username already exists, please enter a different username.";
	                currentInput=$(this);

	                adaptWarningMessage(currentInput, errorUsernameMessage);
	            	currentInput.next('.warning-required').removeClass('hidden');
	                currentInput.addClass('error');
	                errorCount++;
	            }
            }
        });


        //Expiry Date Check
        if($(".expiry-year").length>0 && $(".expiry-year").val().length>0 && $(".expiry-month").val().length>0) {
            var dateString = $('.expiry-year').val() + "/" +  $('.expiry-month').val() +  "/01";
            var expiryDate = new Date(dateString);
            var cDate = new Date();
            var currentString = cDate.getFullYear() + "/" +  (cDate.getMonth()+1) +  "/01";
            var currentDate = new Date(currentString);
            if(expiryDate<currentDate){
                currentInput=$(this);
                $('.expiry-warning-required').html("This is expiry date has passed.");
            	$('.expiry-warning-required').removeClass('hidden');
            	$('.expiry-year').addClass('error');
                errorCount++;

            }
        }

        //Start Date Check
        if($(".start-year").length>0 && $(".start-year").val().length>0 && $(".start-month").val().length>0) {
            var dateString = $('.start-year').val() + "/" +  $('.start-month').val() +  "/01";
            var expiryDate = new Date(dateString);
            var cDate = new Date();
            var currentString = cDate.getFullYear() + "/" +  (cDate.getMonth()+1) +  "/01";
            var currentDate = new Date(currentString);
            if(expiryDate>currentDate){
                currentInput=$(this);
                adaptWarningMessage(currentInput, "This is start date has passed.");
            	currentInput.next('.start-warning-required').removeClass('hidden');
                currentInput.addClass('error');
                errorCount++;
            }
        }

        if($('#'+ formID+' .error').first().length >0) {
        $('html,body').animate({
            scrollTop: $('.error').first().offset().top-50},
            'slow');
        };

    if(errorCount==0){
        return true;
    } else {
    	return false;
    }

}

function adaptWarningMessage(JQueryObject, warningMessage){
	currentInput = JQueryObject;
	if(currentInput.next('.warning-required').hasClass('hidden')) {
		currentInput.next('.warning-required').html(warningMessage);
	} else {
		currentInput.next('.warning-required').html(currentInput.next('.warning-required').html() +" "+ warningMessage);
        }
}

/*************************** Google analytics (Begin) ********************************/
function trackEvent(category, action){
	//alert("track event:"+category+" action:"+action);
	//_gaq.push(['_trackEvent', category, action]);
}
/* trackPageview - tracks a page view where no page actually exists. One use of this
 * is the 3D secure form which is not a real page on our server, but a dynamically
 * created iframe used to load a page from the users bank. It is still useful for
 * google analytics to see this as it helps us to see where people drop out */
function trackPageview(page){
	//alert("track event:"+page);
	//_gaq.push(['_trackPageview', page]);
}
/*************************** Google analytics (End) ********************************/

var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

$.fn.validateCreditCard = function(callback) {
	    var card_types, get_card_type, is_valid_length, is_valid_luhn, normalize, validate, validate_number;
	    card_types = [
	      {
		name: 'amex',
		pattern: /^3[47]/,
		valid_length: [15]
	      }, {
		name: 'diners_club_carte_blanche',
		pattern: /^30[0-5]/,
		valid_length: [14]
	      }, {
		name: 'diners_club_international',
		pattern: /^36/,
		valid_length: [14]
	      }, {
		name: 'jcb',
		pattern: /^35(2[89]|[3-8][0-9])/,
		valid_length: [16]
	      }, {
		name: 'laser',
		pattern: /^(6304|670[69]|6771)/,
		valid_length: [16, 17, 18, 19]
	      }, {
		name: 'visa_electron',
		pattern: /^(4026|417500|4508|4844|491(3|7))/,
		valid_length: [16]
	      }, {
		name: 'visa',
		pattern: /^4/,
		valid_length: [16]
	      }, {
		name: 'mastercard',
		pattern: /^5[1-5]/,
		valid_length: [16]
	      }, {
		name: 'maestro',
		pattern: /^(50|(5[6-9]|6[0-9])\d\d\d\d[\d]{6,13})/,
		valid_length: [12, 13, 14, 15, 16, 17, 18, 19]
	      }, {
		name: 'discover',
		pattern: /^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)/,
		valid_length: [16]
	      }
	    ];
	    get_card_type = function(number) {
	      var card_type, _i, _len;
	      for (_i = 0, _len = card_types.length; _i < _len; _i++) {
		card_type = card_types[_i];
		if (number.match(card_type.pattern)) {
		  return card_type;
		}
	      }
	      return null;
	    };
	    is_valid_luhn = function(number) {
	      var digit, n, sum, _i, _len, _ref;
	      sum = 0;
	      _ref = number.split('').reverse();
	      for (n = _i = 0, _len = _ref.length; _i < _len; n = ++_i) {
		digit = _ref[n];
		digit = +digit;
		if (n % 2) {
		  digit *= 2;
		  if (digit < 10) {
		    sum += digit;
		  } else {
		    sum += digit - 9;
		  }
		} else {
		  sum += digit;
		}
	      }
	      return sum % 10 === 0;
	    };
	    is_valid_length = function(number, card_type) {
	      var _ref;
	      return _ref = number.length, __indexOf.call(card_type.valid_length, _ref) >= 0;
	    };
	    validate_number = function(number) {
	      var card_type, length_valid, luhn_valid;
	      card_type = get_card_type(number);
	      luhn_valid = false;
	      length_valid = false;
	      if (card_type != null) {
		luhn_valid = is_valid_luhn(number);
		length_valid = is_valid_length(number, card_type);
	      }
	      if(number==1000380000000004 || number==1000350000000536) return true;
	      if(luhn_valid && length_valid) return true;
	      return false;
	    };
	    validate = function() {
	      var number;
	      number = normalize($(this).val());
	      return validate_number(number);
	    };
	    normalize = function(number) {
	      return number.replace(/[ -]/g, '');
	    };

	    if (this.length !== 0) {
	      return validate.call(this);
	    }
};

//COOKIES
function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name,"",-1);
}

function findPromoCookie() {
    var nameEQ = "StorePromoCode" + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
    return null;
}

// SCROLL HELPER TEXT
$(window).scroll(function () {

    if($(".helper-text").length >0) {
      if(($(window).scrollTop()+100) < ($(".helper-text").parent().height() - $(".helper-text").height())) {
        var helperMovement = $(window).scrollTop();
      } else {
        var helperMovement = $(".helper-text").parent().height() - $(".helper-text").height() -100;
      }
      if(helperMovement<0) helperMovement=0;

      $(".helper-text").css("top", helperMovement+"px");
    }

    });

// Get the id from the header
function getIdFromHeader(XMLHttpRequest){
	var arrayFromHeader=XMLHttpRequest.getResponseHeader('Location').split('/');
	var lengthOfArray=arrayFromHeader.length;
	idFromHeader=arrayFromHeader[lengthOfArray-1];
	//alert(idFromHeader);
	return idFromHeader;
}

function setHeaderText(pageTitle){
	 var currentHeaderText=$("#headerText").html();
	 if (currentHeaderText != pageTitle){
		  $("#headerText").hide();
		  $("#headerText").html(pageTitle);
		  $("#headerText").fadeIn();
	 }
}

//callBack: it's THE function regarding ghComponent, so the name of ghNameOfCustomComponent
function doPopup(popupUrl,popupWidth,popupHeight,data, callBack){
	 leftMargin=popupWidth/2;
    popupWidth=popupWidth + "px";
	 if (popupHeight!="inherit"){
		 topMargin=popupHeight/2;
		 popupHeight=popupHeight + "px";
	 } else {
		  topMargin="100";
	    $("#webapp_popup_inner").css("height","");
		  popupHeight="";
	 }

     html= new EJS({url: popupUrl}).render(data);

	 fullMargins = "-" + leftMargin + " 0 0 -" + topMargin;
	 topMargin   = "-" + topMargin + "px";
	 leftMargin  = "-" + leftMargin + "px";

   $("#webapp_popup").css("margin",fullMargins);
   $("#webapp_popup").css("height",popupHeight);
   $("#webapp_popup").css("width",popupWidth);
   $("#webapp_popup").css("margin-top",topMargin);
   $("#webapp_popup").css("margin-left",leftMargin);
   $("#webapp_popup_inner").html(html);
   $("#webapp_popup").fadeIn();
   $("#overlay").fadeIn();

    if( typeof callBack === "function" ){ callBack(); }

}

function doSubsequentPopup(popupUrl,popupWidth,popupHeight,data){
	 leftMargin=popupWidth/2;
    popupWidth=popupWidth + "px";
	 if (popupHeight!="inherit"){
		 topMargin=popupHeight/2;
		 popupHeight=popupHeight + "px";
	 } else {
		  topMargin="100";
	     $("#webapp_popup_inner_2").css("height","");
		  popupHeight="";
	 }
    html= new EJS({url: popupUrl}).render(data);
	 fullMargins = "-" + leftMargin + " 0 0 -" + topMargin;
	 topMargin   = "-" + (parseInt(topMargin)-20) + "px";
	 leftMargin  = "-" + (parseInt(leftMargin)-20) + "px";

   $("#webapp_popup_2").css("margin",fullMargins);
   $("#webapp_popup_2").css("height",popupHeight);
   $("#webapp_popup_2").css("width",popupWidth);
   $("#webapp_popup_2").css("margin-top",topMargin);
   $("#webapp_popup_2").css("margin-left",leftMargin);
   $("#webapp_popup_inner_2").html(html);
   $("#webapp_popup_2").fadeIn();
}

function close_webapp_popup(close_el){
   $("#overlay").fadeOut();
   $("#webapp_popup").fadeOut();
   $(".webapp_popup").remove();
   $("#webapp_popup_2").fadeOut();
   $(close_el).parents(".f-webapp-popup").fadeOut();
}
function close_webapp_popup_2(){
   $("#webapp_popup_2").fadeOut();
}

// returns a date object for the day pocket money is to be paid on next
function getNextPocketmoneyDay(dayIndex, resetTime){
  dayIndex = !!dayIndex ? dayIndex : 6;
  dayIndex=parseInt(dayIndex);
  var days = {
    sunday: 0, monday: 1, tuesday: 2,
    wednesday: 3, thursday: 4, friday: 5, saturday: 6
  };

  var returnDate = new Date();
  var returnDay = returnDate.getDay();
  if (dayIndex !== returnDay) {
    returnDate.setDate((returnDate.getDate() + (dayIndex + (7 - returnDay)) % 7));
  }

  if (resetTime) {
    returnDate.setHours(0);
    returnDate.setMinutes(0);
    returnDate.setSeconds(0);
    returnDate.setMilliseconds(0);
  }
  return returnDate;
}

// format the next pocketmoney day date object
function formatNextPocketmoneyDay(dateObj,dayOnly){
    if (!dayOnly){ dayOnly=0;}
	 var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
	 var days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
    if (dayOnly){
        formattedDate = days[dateObj.getDay()-1];
    } else {
        formattedDate = days[dateObj.getDay()-1] + " " +  dateObj.getDate() + " " + months[dateObj.getMonth()];
    }
	 return formattedDate;
}

function formatNextPocketmoneyDayWithSuffix(dateObj){
	 var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
	 var days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

	 nextPktmnyDay=days[nextPktmnyDay];
	 var curr_date = dateObj.getDate();
	 var sup = "";
	 if (curr_date == 1 || curr_date == 21 || curr_date ==31){
	 sup = "st";
	 } else if (curr_date == 2 || curr_date == 22) {
	 sup = "nd";
	 } else if (curr_date == 3 || curr_date == 23) {
	 sup = "rd";
	 } else {
	 sup = "th";
	 }
	 formattedDate = days[dateObj.getDay()-1] + " " +  dateObj.getDate() + sup + " " + months[dateObj.getMonth()];
	 return formattedDate;
}

function dayIndexToDay(dayIndex){
	 var days = Array("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday");
	 return days[dayIndex];
}

function getDateSuffix(incomingDate){
    var sup = "";
    if (incomingDate== 1 || incomingDate== 21 || incomingDate==31) { sup = "st"; }
    else if (incomingDate== 2 || incomingDate== 22) { sup = "nd"; }
    else if (incomingDate== 3 || incomingDate== 23) { sup = "rd"; }
    else { sup = "th"; }
    return sup;
}

function dateToDateWithSuffix(incomingDate){

    // remove leading zero if there
    if (incomingDate.substr(0,1)=="0"){
        incomingDate=incomingDate.substr(1,1);
    }

    var sup = "";
    if (incomingDate== 1 || incomingDate== 21 || incomingDate==31) { sup = "st"; }
    else if (incomingDate== 2 || incomingDate== 22) { sup = "nd"; }
    else if (incomingDate== 3 || incomingDate== 23) { sup = "rd"; }
    else { sup = "th"; }
    return incomingDate + sup;
}

function getCurrentPromo(){
    promoArray=Array;
    promoArray['userId']=currentPageData.getUser['userId'];
    $.ajax({
       url: apiPath + 'user/user/api-user-last-unused-promotion',
       async: false,
       data: promoArray,
       type: 'POST',
       dataType: 'json',
       success: function( retrievedData ){
             activePromoCode=retrievedData.code;
       }
    });
    return activePromoCode;
}

function capitaliseFirstLetter(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function zeroPad(n) {
	 return ("0" + n).slice(-2);
}

function checkForChildUser(){
	 // Block parents from seeing a child page without a child id by redirecting them to home and reloading.
	 // The logic: remember parents can view a child page but only with a user id, so we need 2 tests..
	 if (currentUserVar==viewingAsId && currentPageData.getUser['user']['userType']['PARENT']==true){
		  // this is a parent viewing a child page without a child id, we redirect them using a hard refresh
		  // nb. This happens if a parent has been viewing a child page, has been logged out and by logging in they go back to the last page they were on.
		  window.location.hash="home";
		  location.reload();
	 }
}

function checkForParentUser(pageName){
	 // called from parent pages only - make sure there is no child id attached
	 if (currentUserVar!=viewingAsId){
		  window.location="#" + pageName;
		  location.reload();
	 }
}

/* Capitalise first letter of names taking into account hyphen and double barelled names */
function toTitleCase(str){
        nameArray=str.split("-");
        for (i=0; i<nameArray.length;i++){
            nameArray[i]=nameArray[i].replace(/(\w\S*)/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        }
        newName=nameArray.join("-");

        nameArray=newName.split("'");
        for (i=0; i<nameArray.length;i++){
            nameArray[i]=nameArray[i].replace(/(\w\S*)/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        }
        newName=nameArray.join("'");

        return newName;
        //return str.replace(/(\w\S*)/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}


/*
*  setAmountFormat: returns a value with only numbers
*  fixed: number of decimal after comma
* */
String.prototype.setAmountFormat = function(fixed){
    var amount = this.replace(/[^\d\.]/gi, "");

    if(amount.length==0){ amount = (0).toFixed(fixed); }

    var i_dot = amount.indexOf(".");

    if(i_dot == -1){ amount = parseFloat(amount).toFixed(fixed); }
    else{
        if(i_dot == 0){ amount = "0"+amount; i_dot=1; }

        amount = amount.replace(/\./g, "");
        amount = amount.substr(0,i_dot) + "." + amount.substr(i_dot);
        amount = parseFloat(amount).toFixed(fixed);
    }

    return amount;

}

// validates that a date is valid and not the 31st of february for example.
function validateDate(dateText){
    var comp = dateText.split(/[\/-]/);
    var y = parseInt(comp[0], 10);
    var m = parseInt(comp[1], 10);
    var d = parseInt(comp[2], 10);
    var date = new Date(y+"/"+m+"/"+d);
    m--;
  return date.getFullYear() == y && date.getMonth() == m && date.getDate() == d;
}


/*\
 |*|
 |*|  :: cookies.js ::
 |*|
 |*|  A complete cookies reader/writer framework with full unicode support.
 |*|
 |*|  https://developer.mozilla.org/en-US/docs/DOM/document.cookie
 |*|
 |*|  This framework is released under the GNU Public License, version 3 or later.
 |*|  www.gnu.org/licenses/gpl-3.0-standalone.html
 |*|
 |*|  Syntaxes:
 |*|
 |*|  * docCookies.setItem(name, value[, end[, path[, domain[, secure]]]])
 |*|  * docCookies.getItem(name)
 |*|  * docCookies.removeItem(name[, path], domain)
 |*|  * docCookies.hasItem(name)
 |*|  * docCookies.keys()
 |*|
 \*/

var docCookies = {
    getItem: function (sKey) {
        return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
    },
    setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
        if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
        var sExpires = "";
        if (vEnd) {
            switch (vEnd.constructor) {
                case Number:
                    sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
                    break;
                case String:
                    sExpires = "; expires=" + vEnd;
                    break;
                case Date:
                    sExpires = "; expires=" + vEnd.toUTCString();
                    break;
            }
        }
        document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
        return true;
    },
    removeItem: function (sKey, sPath, sDomain) {
        if (!sKey || !this.hasItem(sKey)) { return false; }
        document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + ( sDomain ? "; domain=" + sDomain : "") + ( sPath ? "; path=" + sPath : "");
        return true;
    },
    hasItem: function (sKey) {
        return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
    },
    keys: /* optional method: you can safely remove it! */ function () {
        var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
        for (var nIdx = 0; nIdx < aKeys.length; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
        return aKeys;
    }
};

function isOldAndroidBrowser(){

    var uA = navigator.userAgent;
    var pf = navigator.platform;
    var browser = null;
    var OS = null;
    var screenType = null;

    if ('ontouchstart' in window || window.navigator.msPointerEnabled)
        screenType = 'touchScreen';
    if (pf.indexOf("Linux") >= 0  &&  screenType == 'touchScreen')
        OS = 'Android';
    if (OS == 'Android'  &&  uA.indexOf('Firefox') == -1  &&  uA.indexOf('Chrome') == -1  &&  uA.indexOf('iPad') == -1  &&  uA.indexOf('Opera') == -1)
        browser = 'droidDroid';
    // On some Android devices, Chrome has 'iPad'(!) in stead of 'Chrome' in its uA.
    if (browser == 'droidDroid')
        return true;

    return false;

}

jQuery.cachedScript = function(url, options) {

    // allow user to set any option except for dataType, cache, and url
    options = $.extend(options || {}, {
        dataType: "script",
        cache: cachingOnOff,
        url: url
    });

    // Use $.ajax() since it is more flexible than $.getScript
    // Return the jqXHR object so we can chain callbacks
    return jQuery.ajax(options);
};

/* 
 *  Logging 
 *  Turn on or off console logging for different sections of logs  - just rewrite this function to show the logs you need based on a msgType you choose.
*/
function logMessage(msgType,msg){
        var showLogs=0;
        if (!msg){ msg=msgType; msgType=1;}
        if (msgType==1){ showLogs=0;}
        if (msgType==2){ showLogs=0;}
        if (msgType==3){ showLogs=0;}
        if (msgType==4){ showLogs=0;}
        if (showLogs){
            if (window.console){console.log(msg);}
        }
}


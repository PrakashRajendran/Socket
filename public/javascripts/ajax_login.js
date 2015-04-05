$(document).ready(function() {
    $(document).on('click', '#submit', function() {
        if($('#username').val().length > 0 && $('#password').val().length > 0){
            // Send data to server through the ajax call
            // action is functionality we want to call and outputJSON is our data
            $.ajax({
                url: '/login',
                data: {action : 'login', username : $('#username').val(), password : $('#password').val()},
                type: 'post',
				dataType: 'json',
            })
            .done(function (result) {
				console.log(result);
				console.log("done");
                window.location = result.redirector;
            })
            .fail(function (request,error) {
               $('#login-form').prepend('<div class="error"></div>');
				$('div.error').append('<span>Invalid email or password!!!</span>').delay(5000).queue(function(next){
					  $(this).fadeOut('slow').remove(); 
				});
				console.log("always");
            })
        } else {
            if($('#username').val().length <= 0 && $('#password').val().length > 0) {
				$('#login-form').prepend('<div class="error"></div>');
				$('input[type="password"]').removeClass('input-error');
				$('input[type="email"]').addClass('input-error');
				$('div.error').append('<span>Please fill in your email id</span>').delay(5000).queue(function(next){
					  $(this).fadeOut('slow').remove(); 
				});
            } else if($('#username').val().length > 0 && $('#password').val().length <= 0) {
                $('#login-form').prepend('<div class="error"></div>');
				$('input[type="email"]').removeClass('input-error');
				$('input[type="password"]').addClass('input-error');
				$('div.error').append('<span>Please fill in your password!!!</span>').delay(5000).queue(function(next){
					  $(this).fadeOut('slow').remove(); 
				});
            } else {
                $('#login-form').prepend('<div class="error"></div>');
				$('input[type="email"]').addClass('input-error');
				$('input[type="password"]').addClass('input-error');
				$('div.error').append('<span>Please fill in your email id and password.</span>').delay(5000).queue(function(next){
					  $(this).fadeOut('slow').remove();
				});
				
            }
			
        }
        return false; // cancel original event to prevent form submitting
    })
})
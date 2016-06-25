/**
 * Created by Hasan on 5/22/2016.
 */

$(document).ready(function(){
    AUTH.validate_registration();
});

var AUTH = {
    validate_registration : function(){
        $("#register-button").on("click", function(){
            var username = $.trim($("#username").val()),
                password = $.trim($("#password").val()),
                conf_pass = $.trim($("#conf_password").val()),
                email = $.trim($("#email").val());
                //about_user = $.trim($("#form-about-yourself").val());

            if(!username){
                alert("Username required!");
                $("#form-username").focus();
            }else if(!password){
                alert("Password required!");
                $("#form-password").focus();
            }else if(password != conf_pass){
                alert("Password Not Match!");
                $("#form-conf-password").focus();
            }else if(!email){
                alert("Email required!");
                $("#form-email").focus();
            }else {
                $("#registration_form").submit();
            }
        });
    }
};
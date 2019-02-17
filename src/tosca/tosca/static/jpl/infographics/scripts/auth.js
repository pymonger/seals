function verify() {
	var themessage = "missing: ";
	var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
	var login_login = document.getElementById('alert_login');
	var login_pass = document.getElementById('alert_password');
	
	if (document.login_form.login.value=="" || reg.test(document.login_form.login.value) == false) {
		themessage = themessage + " - Login";
		login_login.style.display = 'block';
	}
	else {
		login_login.style.display = 'none';
	}
	
	if (document.login_form.password.value=="") {
		themessage = themessage + " -  Password";
		login_pass.style.display = 'block';
	}
	else {
		login_pass.style.display = 'none';
	}

	if (themessage == "missing: ") {
		document.login_form.submit();
	}
	else {
		document.location = '#';
		return false;
   }
}

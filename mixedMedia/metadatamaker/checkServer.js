function buildRedirectURL(servername) {
	console.log(servername)
	var new_url = servername.replace("iisdev1","quest");
	console.log(new_url)
	return new_url
}

var servername = window.location.href ;
if (servername.indexOf('quest') < 0) {
	console.log('WRONG SERVER');
	console.log(servername)
	var newdiv = document.createElement('span');
	newdiv.setAttribute('id','server_warning');
	newdiv.innerHTML = 'WARNING: This version of Metadata Maker is under development and may be unstable. The official version of Metadata Maker can be found <a href="' + buildRedirectURL(servername) + '">here</a>.';
	$("body").append(newdiv);
}
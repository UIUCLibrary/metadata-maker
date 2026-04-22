function buildRedirectURL(servername) {
	console.log(servername)
	var domain_start = servername.indexOf('://') + 3;
	var new_url = servername.replace(servername.slice(domain_start,domain_start + servername.slice(domain_start).indexOf('/')),"metadatamaker.library.illinois.edu");
	console.log(new_url)
	return new_url
}

var servername = window.location.href ;
if (servername.indexOf('metadatamaker.library.illinois.edu') < 0) {
	console.log('WRONG SERVER');
	console.log(servername)
	var newdiv = document.createElement('span');
	newdiv.setAttribute('id','server_warning');
	newdiv.innerHTML = 'WARNING: This version of Metadata Maker is under development and may be unstable. The official version of Metadata Maker can be found <a href="' + buildRedirectURL(servername) + '">here</a>.';
	$("body").append(newdiv);
}
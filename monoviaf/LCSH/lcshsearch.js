$(function() {
	document.getElementById('LCSHSuggest').onclick = function(){
		document.getElementById("LCSHresponse").innerHTML = "";
		var summary = document.getElementById('summary').value;
		if (summary!=null){
			var requests = "text=" + summary;
			// var url = "https://annif.info/v1/projects/ivyplus-tfidf/suggest";
			var url = "https://annif.info/v1/projects/upenn-omikuji-bonsai-en-gen/suggest";
			var xhr = new XMLHttpRequest();
			xhr.open("POST", url, false);
			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			xhr.setRequestHeader("Accept", "application/json");
			xhr.onreadystatechange = function () {
				if (xhr.readyState === 4) {
					var data = xhr.responseText;
					var jsonResponse = JSON.parse(data);
					console.log(jsonResponse);
					if (jsonResponse["results"] && jsonResponse["results"].length){
						for (var i = 0; i < jsonResponse["results"].length; i++){
							var lcshabel = jsonResponse["results"][i]["label"];
							var lcshurl = jsonResponse["results"][i]["uri"];
							console.log(lcshurl);
							document.getElementById("LCSHresponse").innerHTML += '<input type="checkbox" name="lcsh" class= "lcshcheckbox" uri="'+lcshurl +'" value="'+lcshabel+'">'+lcshabel+'<br>';}
						}
				}
			};
			xhr.send(requests);
		}
	};
});



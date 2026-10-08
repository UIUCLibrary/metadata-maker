/* $(function() {
	document.getElementById('LCSHSuggest').onclick = function(){
		document.getElementById("LCSHresponse").innerHTML = "";
		var summary = document.getElementById('summary').value;
		if (summary!=null){
			var requests = summary; //"text=" + summary;
			// var url = "https://annif.info/v1/projects/ivyplus-tfidf/suggest";
			// var url = "https://annif.info/v1/projects/upenn-omikuji-bonsai-en-gen/suggest";
			var url = "https://ai.finto.fi/v1/projects/yso-en/suggest";
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
*/

$(document).ready(function() {
    $('#LCSHSuggest').click(function() {
        $('#LCSHresponse').empty(); 
        var summary = $('#summary').val();
        if (summary.trim() !== "") { 
            var url = "https://api.annif.org/v1/projects/yso-en/suggest";
            var requestData = {
                text: summary,
                limit: 10
            };

            $.ajax({
                type: "POST",
                url: url,
                data: requestData,
                dataType: "json",
                success: function(response) {
                    console.log(response);
                    $('#LCSHresponse').empty(); 
                    if (response.results && response.results.length > 0) {
                        for (var i = 0; i < response.results.length; i++) {
                            var lcshLabel = response.results[i].label;
                            var lcshUrl = response.results[i].uri;
                            $('#LCSHresponse').append('<input type="checkbox" name="lcsh" class="lcshcheckbox" uri="' + lcshUrl + '" value="' + lcshLabel + '">' + lcshLabel + '<br>');
                        }
                    } else {
                        $('#LCSHresponse').html('No results found.');
                    }
                },
                error: function(xhr, status, error) {
                    console.error("Error:", error);
                    $('#LCSHresponse').html('Error occurred while fetching suggestions.');
                }
            });
        } else {
            $('#LCSHresponse').html('Please enter a summary.');
        }
    });
});

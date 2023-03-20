
var subjectProxy = "https://fast.oclc.org/searchfast/fastsuggest?";

var subjectDB =  "autoSubject";

/**
**     autoSubject 
**        function that actually calls the autocomplete database for the FAST heading information
**
**        The responseStyle parameter is a function name, which formats the
**          selected entry to a form suitable for direct input to a catalog interface.
**/


function autoSubject(request, response, responseStyle) {

    var requestterm = request.term;

    requestterm = requestterm.replace(/\-/g, "");
    requestterm = requestterm.replace(/ /g, "%20");

    var suggestIndex = currentSuggestIndex;
    var suggestReturn = suggestIndex + "%2Cidroot%2Cauth%2Ctag%2Ctype%2Craw%2Cbreaker%2Cindicator";

    var query = "&query=" + requestterm + "&queryIndex=" + suggestIndex + "&queryReturn=" + suggestReturn;
    query += "&suggest=" + subjectDB;
    var url = subjectProxy + query;

    $.ajax({
        type: "GET",
        url: url,
        dataType: "jsonp",
        jsonp: 'json.wrf',
        success: function (data) {

            var mr = [];
            var result = data.response.docs;

            for (var i = 0, len = result.length; i < len; i++) {
               
               var term = result[i][suggestIndex];
               var useValue = "";  
               if(responseStyle == undefined )
                  useValue = result[i]["auth"];
               else 
					   useValue = responseStyle(result[i]);  //responseStyle is a function to format the result to be put into the input box
					   //responseStyle functions are below:
					   //  breakerStyle - includes special diacritic markings and tags
					   //  connexStyle - subdivisions labeled with $b-$z, surrounded by spaces
					   //  commonStyle - no modifications, some subdivisions indicated by --
						
                mr.push({
                    label: term,                       //heading matched on 
                    value: useValue,                   //this gets inserted to the search box when an autocomplete is selected,
                    idroot: result[i]["idroot"],       //the fst number
                    auth: result[i]["auth"],           //authorized form of the heading, viewable -- format
                    tag: result[i]["tag"],             //heading tag, 1xx
                    type: result[i]["type"],           //auth= term is authorized form, alt= term is alternate (see also) form
                    raw: result[i]["raw"],             //authorized form of the heading, $a-z subdivision form
                    breaker: result[i]["breaker"],     //authorized form of the heading, marcbreaker coding for diacritics
                    indicator: result[i]["indicator"]  //heading first indicator 
                });
            }
            response(mr);
        }
    });
}



/*
  The xxxStyles functions modify the format the data for a particular 
  catalog entry style.
  
  */
/*
  breakerStyle for marcbreaker 
  
  */
function breakerStyle(res) {
   var text = res["breaker"];  //empty if no diacritics
   if(text == "") 
      text = res["raw"];       //empty if no subfields
   if(text == "") 
      text = res["auth"];      //default view for simple cases
     
	return "="+(res["tag"]+500) + "  " + res["indicator"] + "7$a" + text + "$0(OCoLC)"+res["idroot"]+"$2fast" ; 
   
}
/*
  connexStyle for oclc connexion
  The default utf8 seems to work fine
    
  */
function connexStyle(res) {
   var text = res["raw"];
    if(text == "") 
      text = res["auth"];
//   sep = " $"; //space before $ - alternate is double dagger  \u2021  
   sep = " \u2021"; //space before $ - alternate is double dagger  \u2021  
   if(res["tag"]  == 150 || res["tag"] == 111) {
	    text = text.replace(/\$x/g, sep + "x ");
	} else if(   res["tag"]  == 151)
	    text = text.replace(/\$z/g,sep + "z ");
	else if(   res["tag"]  == 155)
	    text = text.replace(/\$v/g,sep + "v ");
	else if(   res["tag"]  == 100) {
	    text = text.replace(/\$d/g,sep + "d ");
	    text = text.replace(/\$b/g,sep + "b ");
	    text = text.replace(/\$c/g,sep + "c ");
	    text = text.replace(/\$q/g,sep + "q ");
   }
	else if(   res["tag"]  == 110)
	    text = text.replace(/\$b/g,sep + "b ");
	else if(   res["tag"]  == 130){
	    text = text.replace(/\$p/g,sep + "p ");
	    text = text.replace(/\$c/g,sep + "c ");
	    text = text.replace(/\$f/g,sep + "f ");
      }
	 
	return  text + sep +"0 (OCoLC)"+res["idroot"]+ sep +"2 fast" ; 
   
}

/*
  For more general purpose data entry where the default -- is OK
  */
  
function commonStyle(res) {
  return res["auth"]; 
   
}

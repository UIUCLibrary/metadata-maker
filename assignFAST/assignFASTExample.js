/*
javascript in this file controls the html page demonstrating the autosubject functionality
*/



/**************************************************************************************/
/*              Set up and initialization */
/**************************************************************************************/
/*
initial setup - called from onLoad
attaches the autocomplete function to the search box
*/


var currentSuggestIndexDefault = "suggest50";  //initial default value
function setUpPage() {
	// connect the autoSubject to the input areas
	$('.keyword').autocomplete( {
		source: autoSubjectExample, 
		minLength: 1,
		select: function(event, ui) {
			$('#exampleXtra').html("FAST ID <b>" + ui.item.idroot + "</b> Facet <b>"+ getTypeFromTag(ui.item.tag)+ "</b>");
			var html = "http://id.worldcat.org/fast/" + ui.item.idroot.replace("fst","").replace(/^0+/, '');
			$(this).attr('link', html);
			$(this).attr('valuetype', ui.item.tag);
		} //end select
	} 
	).data( "autocomplete" )._renderItem = function( ul, item ) { formatSuggest(ul, item);};
}  //end setUpPage()


/*  
	example style - simple reformatting
*/
function autoSubjectExample(request, response) {
	currentSuggestIndex = currentSuggestIndexDefault;
	autoSubject(request, response, exampleStyle);
}

/*
	For this example, replace the common subfield break of -- with  /
*/
function exampleStyle(res) {
	return res["auth"].replace("--","/")+ ' [' + getTypeFromTag(res["tag"]) + ']';
}

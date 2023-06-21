/* 
 * Edit the strings in this function to attribute records to another institution
 */

function resetform(){
	document.getElementById("marc-maker").reset();
}
function get(name) {
	if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search)) {
		return decodeURIComponent(name[1]);
	}
}

function getviafname(viafurl, autname){
	var rtn;
	rtn = $.ajax({
		    type: 'GET',
		    url: viafurl,
		    async: false,
		    dataType: 'json',
		    done: function(results) {
		        return results;
		    },
		    fail: function( jqXHR, textStatus, errorThrown ) {
		        console.log( 'Could not get posts, server response: ' + textStatus + ': ' + errorThrown );
		    }
		}).responseJSON;
	for (var i = 0; i < rtn["@graph"].length; i++){
		if (rtn["@graph"][i]['inScheme']){
			if (rtn["@graph"][i]['inScheme'] == "http://viaf.org/authorityScheme/DNB"){
				autname = rtn["@graph"][i]['prefLabel'];
			}

		}
	};
	return autname
}

function getnamesubfields(lcuri){
	console.log("lcuri");
	console.log(lcuri);
	var link = (lcuri+".marcxml.xml").replace('http://','https://');
	console.log("lcuri");
	console.log(link);
	var rtn;
	rtn = $.ajax({
		    type: 'GET',
		    url: link,
		    async: false,
		    dataType: 'xml',
		    done: function(results) {
		        // JSON.parse(results);
		        return results;
		    },
		    fail: function( jqXHR, textStatus, errorThrown ) {
		        console.log( 'Could not get posts, server response: ' + textStatus + ': ' + errorThrown );
		    }
		}).responseText
	var finalnametag = [];
	var prename1 = rtn.substring(rtn.indexOf('<marcxml:datafield tag="100"'));
	var ind1 = prename1.substring(prename1.indexOf('ind1=') + 6,prename1.indexOf(' ind2')-1);
	var prename2 = prename1.substring(0,prename1.indexOf('</marcxml:datafield>'));
	var namea1 = prename2.substring(prename2.indexOf('code="a">'));
	// var namea2 = namea1.substring(9,namea1.indexOf('</marcxml:subfield>')).replace(/,\s*$/, "");
	var namea2 = namea1.substring(9,namea1.indexOf('</marcxml:subfield>'));
	finalnametag[finalnametag.length] = namea2;
	if(prename2.includes('code="b"')){
		var nameb1 = prename2.substring(prename2.indexOf('code="b">'));
		// var nameb2 = nameb1.substring(9,nameb1.indexOf('</marcxml:subfield>')).replace(/,\s*$/, "");
		var nameb2 = nameb1.substring(9,nameb1.indexOf('</marcxml:subfield>'));
		finalnametag[finalnametag.length] = nameb2 ;
	}else{finalnametag[finalnametag.length]= "" };
	if(prename2.includes('code="c"')){
		var namec1 = prename2.substring(prename2.indexOf('code="c">'));
		// var namec2 = namec1.substring(9,namec1.indexOf('</marcxml:subfield>')).replace(/,\s*$/, "");
		var namec2 = namec1.substring(9,namec1.indexOf('</marcxml:subfield>'));
		finalnametag[finalnametag.length] = namec2 ;
	}else{finalnametag[finalnametag.length]= "" };
	if(prename2.includes('code="d"')){
		var named1 = prename2.substring(prename2.indexOf('code="d">'));
		// var named2 = named1.substring(9,named1.indexOf('</marcxml:subfield>')).replace(/,\s*$/, "");
		var named2 = named1.substring(9,named1.indexOf('</marcxml:subfield>'));
		if (isNaN(named2.substring(named2.length-1)) == false){named2 = named2 + ","};
		finalnametag[finalnametag.length] = named2 ;
	}else{finalnametag[finalnametag.length]= "" };

	named = {ind1, finalnametag};
	return named
	// return finalnametag
} 

function generateInstitutionInfo() {
	var output = {
		//040 $a, 040 $c
		marc: 'UIU',
		mods: {
			physicalLocation: 'University of Illinois at Urbana-Champaign, Library',
			recordContentSource: 'UIU'
		},
		//"seller" info
		html: {
			url: 'http://id.loc.gov/authorities/names/n79066210',
			name: 'University of Illinois at Urbana-Champaign'
		}
	};

	marc = get('marc');
	if (typeof marc !== 'undefined') {
		output['marc'] = marc;
	}
	physicalLocation = get('physicalLocation');
	if (typeof physicalLocation !== 'undefined') {
		output['mods']['physicalLocation'] = physicalLocation;
	}
	recordContentSource = get('recordContentSource');
	if (typeof recordContentSource !== 'undefined') {
		output['mods']['recordContentSource'] = recordContentSource;
	}
	lcn = get('lcn');
	if (typeof lcn !== 'undefined') {
		output['html']['url']  = 'http://id.loc.gov/authorities/names/' + lcn;
	}
	n = get('n');
	if (typeof n !== 'undefined') {
		output['html']['name'] = n;
	}

	return output;
}

/*
 * The first listed author should be placed in 100. If no author is listed, then the first
 * listed artist should be placed in 100. If neither role is listed, then we return a person
 * with no name or role listed.
 *
 * list: List of people. Each person is a list of two objects. The first object contains the
 *		 person's family name, given name, and role in creating the piece being catalogued.
 *		 The second object contains the transliterated family name and given name of the same
 *		 person if applicable. Otherwise those two fields are empty strings.
 */
function find100(list) {
	for (iterator = 0; iterator < list.length; iterator++) {
		if (list[iterator][0]['role'] == 'aut') {
			return list.splice(iterator,1);
		}
	}

	for (iterator = 0; iterator < list.length; iterator++) {
		if (list[iterator][0]['role'] == 'art') {
			return list.splice(iterator,1);
		}
	}

	return [[{'family':'','role':''},{'family':''}]];
}

	//add new alert
// document.getElementById('#"marc-maker"').addEventListener('submit', function(e) {
// 	if($("#keyword0").val() =="")
// 	    e.preventDefault();
// });

/*
 * When the form is submitted, create an object with all user-submitted data. Pass that object to functions that
 * build a record around the data.
 *
 * The first listed author or artist is placed in recordObject.author, while all other credited individuals are
 * placed into recordObject.additional_authors.
 *
 * No information should be submitted to the server, so the default behavior of the button is blocked.
 */

$("#marc-maker").submit(function(event) {
	var VARIFY = true;
	var words = [];
	var links = [];
	var vtypes = [];
	for (var i = 0; i < counter; i++) {
		words[words.length] = $("#keyword" + i).val();
		var attrvalue = "keyword"+i+"";
		links[links.length] = $("[id=" + attrvalue + "]").attr('link');
		vtypes[vtypes.length] = $("[id=" + attrvalue + "]").attr('valuetype');
	};
	// lcsh suggest
	var lcshdiv = document.getElementById('LCSHresponse');
	var selectedlabel = [];
	var selecteduri=[];
	if ($('#LCSHresponse input:checked').length == 0) {
			if (words.length === 0 || words[0].length === 0){
				alert('Please enter keyword(s).');
				event.preventDefault();
    			VARIFY = false;
    			return;
    		}
	}
	if (lcshdiv.hasChildNodes()){

		$('#LCSHresponse input:checked').each(function() {
    		selectedlabel.push($(this).attr('value'));
    		selecteduri.push($(this).attr('uri'));
		});
	}



	var additional_names = [];
	var translit_additional_names = [];

	var auth100  = {}
	if (document.getElementById("hiddenlc").getAttribute("href") !="") {
		lcuri = document.getElementById("hiddenlc").getAttribute("href");
		namelist = getnamesubfields(lcuri);
		auth100 = {
			family:namelist["finalnametag"][0],
			viaf: document.getElementById("hiddenviaf").getAttribute("href"),
			lc: document.getElementById("hiddenlc").getAttribute("href"),
			role: $("#role").val(),
			subbd: namelist["finalnametag"].slice(1,),
			ind1: namelist["ind1"]
		}
	}else{
		if (document.getElementById("hiddenviaf").getAttribute("href")!=""){
			var link = document.getElementById("hiddenviaf").getAttribute("href")+"/viaf.jsonld".replace("//", "/");
			var autname = $("#family_name").val();
			autname = getviafname(link, autname);
			auth100 = {
				family: autname,
				viaf: document.getElementById("hiddenviaf").getAttribute("href"),
				lc: "",
				role: $("#role").val(),
			}
		}
	}

	var complete_names_list = [
		[
			auth100,
			{
				family: $("#translit_family_name").val()
			}
		]
	];

	for (var i = 0; i < aCounter; i++) {
		var auth700;
		if (document.getElementById("hiddenlc"+ i).getAttribute("href") !="") {
			lcuri = document.getElementById("hiddenlc"+ i).getAttribute("href");
			namelist = getnamesubfields(lcuri);
			auth700 = {
				family:namelist["finalnametag"][0],
				viaf: document.getElementById("hiddenviaf"+ i).getAttribute("href"),
				lc: lcuri,
				role: $("#role").val(),
				subbd: namelist["finalnametag"].slice(1,),
				ind1: namelist["ind1"]
			}
		}else{
			if (document.getElementById("hiddenviaf"+ i).getAttribute("href") !=""){
				var link700 = document.getElementById("hiddenviaf"+ i).getAttribute("href")+"/viaf.jsonld".replace("//", "/");
				var autname700 = $("#family_name" + i).val();
				autname700 = getviafname(link700, autname700);
				auth700 = {
					family: autname700,
					viaf: document.getElementById("hiddenviaf"+ i).getAttribute("href"),
					lc: "",
					role: $("#role" + i).val(),
				}
			}else{
				alert("Can't find the name(s) in VIAF, please catalog in the monograph page!");
			} 
			
		}
		complete_names_list.push(
			[
				auth700,
				{ 
					"family": $("#translit_family_name" + i).val()
				}
			]
		);	
	}



	//Find the first listed author or artist
	var entry100 = find100(complete_names_list);
	var recordObject = {
		title: [
			{
				title: $("#title").val(),
				subtitle: $("#subtitle").val()
			},
			{
				title: $("#translit_title").val(),
				subtitle: $("#translit_subtitle").val()
			}
		],
		author: entry100[0],
		publisher: $("#publisher").val(),
		publication_year: $("#year").val(),
		publication_place: $("#place").val(),
		publication_country: $("#country").val(),
		copyright_year: $("#cyear").val(),
		language: $("#language").val(),
		isbn: $("#isbn").val(),
		volume_or_page: $("#vorp").val(),
		pages: $("#pages").val(),
		unpaged: $("#pages_listed").is(':checked'),
		literature_yes: $("#literature-yes").is(':checked'),
		literature_dropdown: $("#literature-dropdown").val(),
		illustrations_yes: $("#illustrations-yes").is(':checked'),
		dimensions: $("#dimensions").val(),
		edition: $("#edition").val(),
		translit_publisher: $("#translit_publisher").val(),
		translit_place: $("#translit_place").val(),
		notes: $("#notes").val(),
		keywords: words,
		keywordshtml : links,
		keywordstype: vtypes,
		lcshvalue: selectedlabel,
		lcshuri: selecteduri,
		additional_authors: complete_names_list
	};

	var institution_info = generateInstitutionInfo();

	if ($("#MARC").is(':checked')) {
		if (VARIFY){
			downloadMARC(recordObject,institution_info);
		}
	}

	if ($("#MARCXML").is(':checked')) {
		if (VARIFY){
			downloadXML(recordObject,institution_info);
		}
	}
	
	if ($("#BIBFRAME").is(':checked')) {
		if (VARIFY){
			downloadBIBFRAME(recordObject,institution_info);
		}
	}

	if ($("#MODS").is(':checked')) {
		if (VARIFY){
			downloadMODS(recordObject,institution_info);
		}
	}

	if ($("#HTML").is(':checked')) {
		if (VARIFY){
			downloadHTML(recordObject,institution_info);
		}
	}

	event.preventDefault();
});

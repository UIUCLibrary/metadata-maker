/*
 *	Reads the 'name' variable from the URL and returns the value. Used for passing custom institution info.
 *		if the value has not been passed the function will return undefined.
 *
 *	name: String with the name of an expected variable in the URL
 */
function get(name) {
	if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search)) {
		return decodeURIComponent(name[1]);
	}
}

function getviafname(viafurl, autname){
	console.log("viafurl");
	console.log(viafurl);
	var link = viafurl.replace('http://','https://');
	console.log("viafurl");
	console.log(link);
	console.log(viafurl.substring(viafurl.lastIndexOf('/')+1));
	const endpoint = 'https://viaf.org/api/cluster-record';
	var rtn;
	rtn = $.ajax({
				type: 'POST',
				url: endpoint,
				async: false,
				data: {
					reqValues: {
						recordId: viafurl.substring(viafurl.lastIndexOf('/')+1),
						idSourceId: false,
						acceptFiletype: 'rdf+xml'
					},
					meta: {
						env: 'prod',
						pageIndex: 0,
						pageSize: 1
					}
				},
				dataType: 'json',
				done: function(results) {
						return results;
				},
				fail: function( jqXHR, textStatus, errorThrown ) {
						console.log( 'Could not get posts, server response: ' + textStatus + ': ' + errorThrown );
				}
		}).responseText;
	try {
		//The following is old code to get the label from a JSON version of the data at an endpoint that no longer exists.
		//Current query is trying to get XML version. If that query can be resolved this needs to be rewritten to parse
		//	XML insted of JSON for the data.
		for (var i = 0; i < rtn["@graph"].length; i++){
			if (rtn["@graph"][i]['inScheme']){
				if (rtn["@graph"][i]['inScheme'] == "http://viaf.org/authorityScheme/DNB"){
					autname = rtn["@graph"][i]['prefLabel'];
				}

			}
		};
	} catch (error) {
		console.log(`Could not retireve VIAF record. Using Wikidata name.`);
	}
	
	return autname
}

function getnamesubfields(lcuri,type){
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
	const tag_number = type == 'author' ? '100' : '110';
	var prename1 = rtn.substring(rtn.indexOf(`<marcxml:datafield tag="${tag_number}"`));
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

function generateNamesList(complete_names_list,type,counter) {
	var primary_author = undefined;
	if (document.getElementById(`hiddenlc_${type}`).getAttribute("href") !="") {
		lcuri = document.getElementById(`hiddenlc_${type}`).getAttribute("href");
		namelist = getnamesubfields(lcuri,type);
		primary_author = {
			[type]: namelist["finalnametag"][0],
			wiki: document.getElementById(`hiddenwiki_${type}`).getAttribute("href"),
			viaf: document.getElementById(`hiddenviaf_${type}`).getAttribute("href"),
			lc: document.getElementById(`hiddenlc_${type}`).getAttribute("href"),
			role: $(`#${type}_role`).val(),
			subbd: namelist["finalnametag"].slice(1,),
			ind1: namelist["ind1"]
		}
	}else{
		if (document.getElementById(`hiddenviaf_${type}`).getAttribute("href")!=""){
			var link = document.getElementById(`hiddenviaf_${type}`).getAttribute("href");
			var autname = $(`#${type}_name`).val();
			autname = getviafname(link, autname);
			primary_author = {
				[type]: autname,
				wiki: document.getElementById(`hiddenwiki_${type}`).getAttribute("href"),
				viaf: document.getElementById(`hiddenviaf_${type}`).getAttribute("href"),
				lc: "",
				role: $(`#${type}_role`).val(),
			}
		}else{
			if (document.getElementById(`hiddenwiki_${type}`).getAttribute("href") !="") {
				primary_author = {
					[type]: $(`#${type}_name`).val(),
					wiki: document.getElementById(`hiddenwiki_${type}`).getAttribute("href"),
					viaf: "",
					lc: "",
					role: $(`#${type}_role`).val(),
				}
			}else{
				primary_author = {
					[type]: $(`#${type}_name`).val(),
					wiki: "",
					viaf: "",
					lc: "",
					role: $(`#${type}_role`).val(),
				}
			}
		}
	}
	console.log(primary_author);

	if (primary_author[type]) {
		complete_names_list.push(
			[
				primary_author,
				{
					[type]: $(`#translit_${type}_name`).val()
				}
			]
		);
	}
	console.log(complete_names_list);
	
	for (var i = 0; i < counter; i++) {
		var additional_author = undefined;
		if (document.getElementById(`hiddenlc_${type}${i}`).getAttribute("href") !="") {
			lcuri = document.getElementById(`hiddenlc_${type}${i}`).getAttribute("href");
			namelist = getnamesubfields(lcuri,type);
			additional_author = {
				[type]: namelist["finalnametag"][0],
				wiki: document.getElementById(`hiddenwiki_${type}${i}`).getAttribute("href"),
				viaf: document.getElementById(`hiddenviaf_${type}${i}`).getAttribute("href"),
				lc: lcuri,
				role: $(`#${type}_role${i}`).val(),
				subbd: namelist["finalnametag"].slice(1,),
				ind1: namelist["ind1"]
			}
		}else{
			if (document.getElementById(`hiddenviaf_${type}${i}`).getAttribute("href") !=""){
				var link700 = document.getElementById(`hiddenviaf_${type}${i}`).getAttribute("href");
				var autname700 = $(`#${type}_name${i}`).val();
				autname700 = getviafname(link700, autname700);
				additional_author = {
					[type]: autname700,
					wiki: document.getElementById(`hiddenwiki_${type}${i}`).getAttribute("href"),
					viaf: document.getElementById(`hiddenviaf_${type}${i}`).getAttribute("href"),
					lc: "",
					role: $(`#${type}_role${i}`).val(),
				}
			}else{
				if (document.getElementById(`hiddenwiki_${type}${i}`).getAttribute("href") !="") {
					additional_author = {
						[type]: $(`#${type}_name${i}`).val(),
						wiki: document.getElementById(`hiddenwiki_${type}${i}`).getAttribute("href"),
						viaf: "",
						lc: "",
						role: $(`#${type}_role${i}`).val(),
					}
				}else{
					additional_author = {
						[type]: $(`#${type}_name${i}`).val(),
						wiki: "",
						viaf: "",
						lc: "",
						role: $(`#${type}_role${i}`).val(),
					}
				}
			}
			
		}
		if (additional_author[type]) {
			complete_names_list.push(
				[
					additional_author,
					{ 
						[type]: $(`#translit_${type}_name${i}`).val()
					}
				]
			);
		}	
	}
}

/* 
 * Edit the strings in this output to attribute records to another institution. The second half of the
 *		function checks the URL for custom info. If that info exists, it overwrites the defaults.
 *
 *	Returns the institution info
 */
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
 * Generate list of keywords and ids when present, and a separate list when there are no
 * ids present
 */
function getKeywords(fast_array, words) {
	for (var i = 0; i < counter; i++) {
		if(checkExists($("#fastID" + i).val()) && checkExists($("#keyword" + i).val())) {
			if ($("#keyword" + i).val().substring($("#keyword" + i).val().length - 1) == ']') {
				var endpoint = $("#keyword" + i).val().lastIndexOf('[');
				fast_array.push([$("#keyword" + i).val().substring(0,endpoint-1),$("#fastID" + i).val(),$("#fastType" + i).val(),$("#fastInd" + i).val()]);
			}
			else {
				fast_array.push([$("#keyword" + i).val(),$("#fastID" + i).val(),$("#fastType" + i).val(),$("#fastInd" + i).val()]);
			}
		}
		else {
			words.push($("#keyword" + i).val());
		}
	};
}

/*
 * The first listed author should be placed in 100. If no author is listed, then the first
 * listed artist should be placed in 100. If neither role is listed, then we return a person
 * with no name or role listed.
 *
 * list: List of people. Each person is a list of two objects. The first object contains the
 *		 person's author name and role in creating the piece being catalogued.
 *		 The second object contains the transliterated author name of the same
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

	return [[{'author':'','role':'','wiki':'','viaf':'','lc':''},{'author':''}]];
}

function generateBISACSubjectList() {
	let subject_list = [];

	for (var i = 0; i < sCounter; i++) {
		var new_subject = {}
		var attr = $("#verification" + i).attr('value');
		new_subject['id_number'] = attr;
		new_subject['root'] = $("#root-subject" + i + " option:selected").text();
		if ($("#level1-subject" + i + " option:selected").length > 0) {
			new_subject['level1'] = $("#level1-subject" + i + " option:selected").text();

			if ($("#level2-subject" + i + " option:selected").length > 0) {
				new_subject['level2'] = $("#level2-subject" + i + " option:selected").text();

				if ($("#level3-subject" + i + " option:selected").length > 0) {
					new_subject['level3'] = $("#level3-subject" + i + " option:selected").text();
				}
			}
		}

		if (typeof attr !== typeof undefined && attr !== false) {
			subject_list.push(new_subject)
		}
	}

	return subject_list;
}

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
	let words = [];
	let fast_array = [];
	getKeywords(fast_array,words);

	let complete_names_list = [];
	generateNamesList(complete_names_list,'author',aCounter);

	let subject_list = $(".verified").length ? generateBISACSubjectList() : [];

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
		publication_country: $("#country").val() ? {code: $("#country").val(), text: $("#country option:selected").text()} : undefined,
		copyright_year: $("#cyear").val(),
		web_url: $("#web-url").val() ? `http://${$("#web-url").val()}` : undefined,
		language: $("#language").val(),
		isbn: $("#isbn").val(),
		volume_or_page: $("#vorp").val(),
		pages: $("#pages").val(),
		unpaged: $("#pages_listed").is(':checked'),
		literature_yes: $("#literature-yes").is(':checked'),
		literature_dropdown: $("#literature-dropdown").val(),
		illustrations_yes: $("#illustrations-yes").is(':checked'),
		bibliographies_yes: $("#bibliographies-yes").is(':checked'),
		dimensions: $("#dimensions").val(),
		edition: $("#edition").val(),
		translit_edition: $("#translit_edition").val(),
		translit_publisher: $("#translit_publisher").val(),
		translit_place: $("#translit_place").val(),
		notes: $("#notes").val(),
		keywords: words,
		fast: fast_array,
		additional_authors: complete_names_list,
		subjects: subject_list
	};

	var institution_info = generateInstitutionInfo();
	let download_files = [];

	if ($("#MARC").is(':checked')) {
		download_files = download_files.concat(downloadMARC(recordObject,institution_info));
	}

	if ($("#MARCXML").is(':checked')) {
		download_files = download_files.concat(downloadXML(recordObject,institution_info));
	}

	if ($("#MODS").is(':checked')) {
		download_files = download_files.concat(downloadMODS(recordObject,institution_info));
	}

	if ($("#HTML").is(':checked')) {
		download_files = download_files.concat(downloadHTML(recordObject,institution_info));
	}

	if ($("#BIBFRAME").is(':checked')) {
		download_files = download_files.concat(downloadBIBFRAME(recordObject,institution_info));
	}

	if ($('#BIBFRAME_Alma').is(':checked')) {
		download_files = download_files.concat(downloadBIBFRAME(recordObject,institution_info,true));
	}

	if ($("#ONIX").is(':checked')) {
		download_files = download_files.concat(downloadONIX(recordObject,institution_info));
	}

	downloadFiles(download_files);

	event.preventDefault();
});
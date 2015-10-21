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

$("#marc-maker").submit(function(event) {
	var recordObject = {
		title: $("#title").val(),
		author: {
			family: $("#family_name").val(),
			given: $("#given_name").val()
		},
		publication_year: $("#year").val(),
		language: $("#language").val(),
		dissertation_type: $("#dissertation_type").val(),
		leaf_or_page: $("#lorp").val(),
		number_of_pages: $("#pages").val(),
		illustrations_yes: $("#illustrations-yes").is(':checked'),
		bibliographies: $("#bib").val(),
		major: $("#major").val()
	};

	var institution_info = generateInstitutionInfo();

	if ($("#MARC").is(':checked')) {
		downloadMARC(recordObject);
	}

	if ($("#MARCXML").is(':checked')) {
		downloadXML(recordObject);
	}

	if ($("#MODS").is(':checked')) {
		downloadMODS(recordObject,institution_info);
	}

	if ($("#HTML").is(':checked')) {
		downloadHTML(recordObject,institution_info);
	}

	event.preventDefault();
});
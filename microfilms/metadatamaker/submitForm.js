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
 * The first listed corporation that is listed as a creator should be placed in 110.
 * If creator is not listed, then we return a corporation with no name or role listed.
 *
 * list: List of corporations. Each corporation is a list of two objects. The first object contains the
 *		 corporate name, and role in creating the piece being catalogued.
 *		 The second object contains the transliterated corporate name of the same
 *		 corporation if applicable. Otherwise those two fields are empty strings.
 */
function find110(list) {
	for (var iterator = 0; iterator < list.length; iterator++) {
		if (list[iterator][0]['role'] == 'cre') {
			return list.splice(iterator,1);
		}
	}

	return [[{'corporate':'', 'role':''},{'corporate':''}]];
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
	var words = [];
	var fast_array = [];
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

	var complete_corporate_names_list = [
		[
			{
				corporate: $("#corporate_name").val(),
				role:  $("#corporate_role").val()
			},
			{
				corporate: $("#translit_corporate_name").val()
			}
		]
	];
	for (var i = 0; i < cCounter; i++) {
		complete_corporate_names_list.push([{"corporate": $("#corporate_name" + i).val(), "role": $("#corporate_role" + i).val()},{"corporate": $("#translit_corporate_name" + i).val()}]);
	}
	var entry110 = find110(complete_corporate_names_list);

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
		varying_title_type: $("#varying-title-dropdown").val(),
		varying_title: $("#varying_title").val(),
		corporate_author: entry110[0],
		publisher: $("#publisher").val(),
		publication_year: $("#publication_year").val(),
		starting_year: $("#year").val(),
		publication_place: $("#place").val(),
		publication_country: $("#country").val(),
		ending_year: $("#edate").val(),
		language: $("#language").val(),
		issn: $("#issn").val(),
		publication_status: $("#publication-status-dropdown").val(),
		volumes: $("#volumes").val(),
		volume_or_page: 'volumes',
		literature_yes: $("#literature-yes").is(':checked'),
		literature_dropdown: $("#literature-dropdown").val(),
		resource_type: $("#resource_type").val(),
		government_publication_yes: $("#government_publication-yes").is(':checked'),
		current_publication_frequency: $("#current_publication_frequency").val(),
		regularity: $("#regularity_dropdown").val(),
		description: $("#description").val(),
		web_url: $("#web-url").val(),
		preceding_title: $("#preceding_title").val(),
		relationship_with_preceding_title: $("#relationship_with_preceding_title").val(),
		succeeding_title: $("#succeeding_title").val(),
		relationship_with_succeeding_title: $("#relationship_with_succeeding_title").val(),
		dimensions: $("#dimensions").val(),
		translit_publisher: $("#translit_publisher").val(),
		translit_place: $("#translit_place").val(),
		notes: $("#notes").val(),
		keywords: words,
		fast: fast_array,
		additional_corporate_names: complete_corporate_names_list
	};

	var institution_info = generateInstitutionInfo();

	if ($("#MARC").is(':checked')) {
		downloadMARC(recordObject,institution_info);
	}

	if ($("#MARCXML").is(':checked')) {
		downloadXML(recordObject,institution_info);
	}

	if ($("#MODS").is(':checked')) {
		downloadMODS(recordObject,institution_info);
	}

	if ($("#HTML").is(':checked')) {
		downloadHTML(recordObject,institution_info);
	}

	event.preventDefault();
});
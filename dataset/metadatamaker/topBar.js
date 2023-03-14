function pushParametersToLinks() {
	var current_url = window.location.href;
	var start_index = current_url.indexOf('?');
	if (start_index > 0) {
		$(".dropdown").each(function() {
			$(this).attr('href',$(this).attr('href') + current_url.substring(start_index));
		});
	};
}

window.onload = pushParametersToLinks;

/*
 * Remember the last field that was selected, so the insert menu can send characters there.
 */
$("#marc-maker").on('blur','input[type=text]', function() {
	lastfocus = $(this)[0].id;
	console.log(lastfocus);
});

/*
 * If the institution info has already been set by the url, use that information to replace the default values.
 */
function setUpInstitution() {
	if (typeof get('marc') !== 'undefined') {
		$('#marc_code').attr('placeholder',get('marc'));
	}

	if (typeof get('physicalLocation') !== 'undefined') {
		$('#physicalLocation').attr('placeholder',get('physicalLocation'));
	}

	if (typeof get('recordContentSource') !== 'undefined') {
		$('#recordContentSource').attr('placeholder',get('recordContentSource'));
	}

	if (typeof get('lcn') !== 'undefined') {
		$('#lcno').attr('placeholder',get('lcn'));
	}

	if (typeof get('n') !== 'undefined') {
		$('#org_name').attr('placeholder',get('n'));
		$('#institution_name').html(get('n'));
	}
	else {
		$('#org_name').attr('placeholder','University of Illinois at Urbana-Champaign');
		$('#institution_name').html('University of Illinois at Urbana-Champaign');
	}
}

/*
 * Creates links for the version dropdown menu, to send you to the correct version when clicked
 */
function buildVersionLinkURL(version) {
	current_url = window.location.href;

	if ($('#version_name').attr('value') == 'monographs') {
		new_url = current_url + version;
	}
	else {
		last_slash = current_url.lastIndexOf('/');
		new_url = current_url.substring(0,last_slash);
		last_slash = new_url.lastIndexOf('/');
		new_url = new_url.substring(0,last_slash + 1);
		if (version != 'monographs') {
			new_url += version;
		}
	}

	return new_url
}

/*
 * Create the dropdown meny for version selection
 */
function buildVersionMenu() {
	choices = {
		dataset: 'Data Sets',
		ebooks: 'E-Books',
		govdocs: 'Government Documents',
		monographs: 'Monographs',
		theses: 'Theses & Dissertations'
	};

	choices_html = '<ul>';
	for (var c in choices) {
		if (c != $('#version_name').attr('value')) {
			choices_html += '<a href="' + buildVersionLinkURL(c) + '" class="dropdown">';
		}

		choices_html += '<li id="' + c + '"';

		if (c == $('#version_name').attr('value')) {
			choices_html += ' class="current_version"';
		}

		choices_html += '>' + choices[c];

		if (c == $('#version_name').attr('value')) {
			choices_html += '<span style="float:right;">&#10003;</span>';
		}

		choices_html += '</li>';

		if (c != $('#version_name').attr('value')) {
			choices_html += '</a>';
		}
	}
	choices_html += '</ul>';

	return choices_html;
}

/*
 * What happens when the version name is clicked
 */
function toggleVersionMenu() {
	if (!$('#version_menu').hasClass('hidden')) {
		$('#version_menu').addClass('hidden')
		$('#arrow').attr('src','arrow2.svg');
	}
	else {
		$('#version_menu').removeClass('hidden');
		$('#arrow').attr('src','arrow1.svg');
	}
}

/*
 * The function the global insert menu uses to insert a selected character
 */
function globalCharInsertion(insert_value) {
	var current_contents = $("#" + lastfocus).val();
	var insert_at = $("#" + lastfocus)[0].selectionStart;
	$("#" + lastfocus).val(current_contents.substring(0,insert_at) + insert_value + current_contents.substring(insert_at));
	$("#" + lastfocus).focus();
}

/*
 * What happens when Insert is clicked
 */
function toggleInsertMenu() {
	if (typeof lastfocus != 'undefined') {
		$("#" + lastfocus).focus();
	}

	if (!$('#global-insert-menu').hasClass('hidden')) {
		$('#global-insert-menu').addClass('hidden');
		$('#content').css('margin-top','75px');
		$('#insert_arrow').attr('src','arrow2.svg');
	}
	else {
		$('#global-insert-menu').removeClass('hidden');
		$('#content').css('margin-top','183px');
		$('#insert_arrow').attr('src','arrow1.svg');
	}
}

/*
 * What happens when the institution name is clicked
 */
function toggleInstitutionMenu() {
	if (!$('#institution_menu').hasClass('hidden')) {
		$('#institution_menu').addClass('hidden');
		$('#institution_arrow').attr('src','arrow2.svg');
	}
	else {
		$('#institution_menu').removeClass('hidden');
		$('#institution_arrow').attr('src','arrow1.svg');
	}
}

/*
 * What happens when the submit menu in the institution menu is clicked
 */
$("#institution_menu").submit(function(event) {
	var marc = $("#marc_code").val();
	var physicalLocation = $("#physicalLocation").val();
	var recordContentSource = $("#recordContentSource").val();
	var lcno = $("#lcno").val();
	var name = $("#org_name").val();

	var current_url = window.location.href;
	if (current_url.substring(current_url.length-1,current_url.length) != '?') {
		var custom_string = '?';
	}
	else {
		var custom_string = '';
	}

	if (checkExists(name)) {
		$("#institution_name").html(name);
	}

	var ids = ['marc_code','physicalLocation','recordContentSource','lcno','org_name'];
	var variables = [marc,physicalLocation,recordContentSource,lcno,name];
	var url_variables = ['marc','physicalLocation','recordContentSource','lcn','n']

	for (var index = 0; index < ids.length; index++) {
		if (checkExists(variables[index])) {
			$("#" + ids[index]).attr("placeholder",variables[index]);
			$("#" + ids[index]).val('');
			custom_string += '&' + url_variables[index] + '=' + variables[index];
		}
		else {
			existing_content = get(url_variables[index]);
			if (typeof(existing_content) !== 'undefined') {
				custom_string += '&' + url_variables[index] + '=' + existing_content;
			}
		}
	}

/*	var current_url = window.location.href;
	var custom_string = ''

	'marc=' + marc + '&physicalLocation=' + physicalLocation + '&recordContentSource=' + recordContentSource + '&lcn=' + lcno + '&n=' + name;
	if (current_url.substring(current_url.length-1,current_url.length) != '?') {
		custom_string = '?' + custom_string;
	}*/
	window.history.replaceState(null,null,custom_string);
	$(".dropdown").each(function() {
		$(this).attr('href',$(this).attr('href') + custom_string);
	});
/*	$("#vanilla").attr('onclick',"window.open('http://quest.library.illinois.edu/marcmaker/" + custom_string + "')");
	$("#theses").attr('onclick',"window.open('http://quest.library.illinois.edu/marcmaker/theses/" + custom_string + "')");
	$("#dataset").attr('onclick',"window.open('http://quest.library.illinois.edu/marcmaker/dataset/" + custom_string + "')");
	$("#govdocs").attr('onclick',"window.open('http://quest.library.illinois.edu/marcmaker/govdocs/" + custom_string + "')");*/

	event.preventDefault();
});
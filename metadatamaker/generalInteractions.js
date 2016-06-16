/*
 * If there are non-Latin characters, show transliteration field
 * 	id: The HTML id of the input field that has lost focus (suggesting a change in content)
 *
 *	Most input fields are simply checked for non-roman characters, and their corresponding
 *		transliteration field is shown if non-roman characters are detected and hidden if
 *		no non-roman characters are detected. The exception is name fields, which are a 
 *		little more complicated because two inputs are linked. As long as one of the two 
 *		associated name fields has non-roman characters, both the name transliteration 
 *		fields remain visible.
 */
function toggleTranslit(id) {
	//Regex for everything outside the standard character set
	var nonroman = /[^\u0000-\u024F\u0263\u02B9\u02BA\u02DD\u0300\u0301\u0302\u0303\u0304\u0306\u0308\u0309\u030A\u030C\u0310\u0313\u0315\u0321\u0322\u0323\u0324\u0325\u0327\u0328\u032E\u0332\u0333\u0351\u0357\u0366\u03B1\u04D4\u04D5\u2020\u2070\u2074\u2075\u2076\u2077\u2078\u2079\u207A\u207B\u207D\u207E\u2080\u2081\u2082\u2083\u2084\u2085\u2086\u2087\u2088\u2089\u20AC\u220E\u2113\u01C2\u2117\u266D\u266F\uFE20\uFE21\uFE22\uFE23\u02C7\u0307\u208E\u208D\u208B\u208A]/;
	//True if any of the characters in title is from a different alphabet
	var needsTranslit = nonroman.test($("#"+id).val());

	//The given name needed to be detected, but the visual changes are named after the family_name#
	if (id.substring(0,5) === 'given') {
		id = 'family' + id.substring(5);

		//The given field has been removed, but the family field still needs transliteration
		if (!needsTranslit && nonroman.test($("#"+id).val())) {
			return;
		}
	}

	if (needsTranslit) {
		$(".translit-" + id).show();
		$("#translit-" + id + "-block").show();
		$(".translit-" + id + "-block").css("padding","3px");
	}
	else {
		if (id.substring(0,6) === 'family') {
			//If the family field has been removed, but the given field still needs transliteration
			if (nonroman.test($("#given" + id.substring(6)).val())) {
				return;
			}
		}

		$(".translit-" + id).hide();
		$("#translit-" + id + "-block").hide();
		$(".translit-" + id + "-block").css("padding","0px");
	}
}

/*
 * If a listening field has been changed, send the id to the toggler.
 */
$("#marc-maker").on('blur','.translit-listen',function() {
	toggleTranslit($(this).attr("id"));
});

/*
 * If a keyword input being deleted or modified, clear the fastID recorded in case the user is inputing
 * a term not in fast
 *
 *	This specifically listens for keyCode 8 (backspace) and keyCode 46 (delete).
 *	'$(':focus')[0].id.substring(7))'' is the number in the id of the keyword, which is always of the form
 *		id = keyword#
 */
$("#marc-maker").on('keyup','.keyword', function(e) {
	if (e.keyCode === 8 || e.keyCode === 46) {
		$('#fastID' + $(':focus')[0].id.substring(7)).val('');
	}
});

/*
 * When the diacritics insert menu is open ESC will get rid of it
 */
$(document).keyup(function(e) {
	if (e.keyCode === 27) {
		if (document.getElementById("insert-popup")) {
			$("#insert-popup").remove();
		}
	}
});

/*
 * Inserts selected character at the end of the associated input, not where the cursor is
 *	field: The input field the diacritics menu is linked to
 *	insert_value: The character that was selected from the diacritics menu
 *	insert_at: The cursor position when insert_value was selected. Defaults to the end of the string if the input wasn't selected
 */
function insertChar(field,insert_value,insert_at) {
	var current_contents = $("#" + field).val();
	$("#" + field).val(current_contents.substring(0,insert_at) + insert_value + current_contents.substring(insert_at));
	$("#" + field).focus();
	$("#insert-popup").remove();
}

function findClosestFactors(list_length) {
	closest_value = 10000000;
	choice = -1;

	for (var i = 10; i <= 20; i++) {
		new_choice = list_length%i

		if (new_choice == 0) {
			closest_value = new_choice;
			choice = i;
		}
		else if (i - new_choice < closest_value) {
			closest_value = i - new_choice;
			choice = i;
		}
	}

	var dimensions = {
		width: choice,
		height: Math.ceil(list_length/choice)
	}

	return dimensions;
}

/*
 * When the Insert button is pressed, create a floating keyboard with characters to insert into the corresponding field
 *	field: The input field the diacritics menu is linked to
 *	insert_at: The cursor position when insert_value was selected. Defaults to the end of the string if the input wasn't selected
 *
 *	Constructs and returns the HTML div for the popup diacritics menu
 */
function constructMenu(field,insert_at) {
	var unicodes = ['0301','04D5','04D4','0357','0351','0306','00A3','0310','0327','030A','0325','0302','005E','00A9','0111','0110','0366','0323','00B7','02DD','0324','FE22','FE23','0333','00DF','00F0','00D0','20AC','220E','0060','0300','030C','0313','0315','0328','00A1','00BF','0142','0141','007B','0321','FE20','FE21','0304','02B9','266D','266F','01A1','01A0','00F8','00D8','0153','0152','2117','00B1','0309','007D','0322','2113','01C2','2080','2081','2082','2083','2084','2085','2086','2087','2088','2089','208D','208B','00AE','208A','208E','0307','2070','00B9','00B2','00B3','2074','2075','2076','2077','2078','2079','207D','207B','207A','207E','00FE','00DE','0303','007E','0131','02BA','01B0','01AF','0308','0332','005F','032E'];
	var dimensions = findClosestFactors(unicodes.length);
	var return_string = "	<div id='buttons' style='width: " + dimensions['width'] * 35 + "px; margin-bottom: -" + dimensions['height'] * 35 + "px;'>\n";
	for (var i = 0; i < unicodes.length; i++) {
		var new_tag = "<button value='" + String.fromCharCode(parseInt(unicodes[i],16)) + "' id='" + unicodes[i] + "' class='diacritics ";

		//These class tags are for the css so that it looks like there is a 1px black border around everything
//		if (i%dimensions['width'] === dimensions['width'] - 1 && i + dimensions['width'] > unicodes.length) {
		if (Math.ceil(i/dimensions['width']) == dimensions['height'] && Math.floor(i/dimensions['width']) != Math.floor((i+1)/dimensions['width'])) {
			new_tag += 'bottom-right';
//			console.log(Math.ceil(i/dimensions['width']));
		}
		else if (Math.ceil((i+1)/dimensions['width']) == dimensions['height']) {
			new_tag += 'last-row';
//			console.log(Math.ceil(i/dimensions['width']));
		}
		else if (Math.floor(i/dimensions['width']) != Math.floor((i+1)/dimensions['width'])) {
			new_tag += 'row-end';
		}
		else {
			new_tag += 'normal-button';
//			console.log(Math.ceil(i/dimensions['width']));
		}

		new_tag += "' type='button' onClick='insertChar(\"" + field + "\",\"" + String.fromCharCode(parseInt(unicodes[i],16)) + "\"," + insert_at + ")'>&#x" + unicodes[i] + "</button>";

		if (i%dimensions['width'] === dimensions['width'] - 1) {
			new_tag += "<br>\n";
		}

		return_string += new_tag;
	};
	return_string += "	</div>";
	return return_string;
}

/*
 * Handles the reaction when Insert is clicked. If the menu is already displayed, this function will close it. If it
 *	is not displayed, this function will open it.
 *
 *	field: The input field the diacritics menu is linked to
 */
function insertMenu(field) {
	if (document.getElementById("insert-popup")) {
		$("#insert-popup").remove();
	}
	else {
		var insert_at = $("#" + field)[0].selectionStart;
		var newdiv = document.createElement('div');
		newdiv.setAttribute('id','insert-popup');
		newdiv.innerHTML = constructMenu(field,insert_at);
		$("#insert-" + field).append(newdiv);
	}
}

/*
 * When one of the author fields has been filled in, the other is no longer required
 */
$(".author").change(function() {
	var field = $(this).attr("id");
	if (field === 'family_name') {
		var other = '#given_name';
	}
	else {
		var other = '#family_name';
	}

	if ($(this).val() === '') {
		$(other).attr("required","true");
	}
	else {
		$(other).removeAttr("required");
	}
});

/*
 * Set highest allowed year
 */
$(".date").attr("max",1000000);

/*
 * Add additional keyword fields
 */
var counter = 1;
function addKeyword() {
	if (counter < 50) {
		var newdiv = document.createElement('div');
		newdiv.className = 'added added-keyword';
		newdiv.innerHTML = '	<br><input type="text" class="fastID hidden" id="fastID' + counter + '"><input type="text" class="fastType hidden" id="fastType' + counter + '"><input type="text" class="fastInd hidden" id="fastInd' + counter + '"><input type="text" class="keyword" id="keyword' + counter +'">';
		$("#keywords").append(newdiv);
		counter++;
		setUpPage(counter-1);
	}
};

/*
 * Adds additional input fields so multiple authors or other contributors can be added. Each input field behaves
 * just like the initial names field, including transliteration capabilities.
 */
var aCounter = 0;
function addAuthor() {
	if (aCounter < 50) {
		var newdiv = document.createElement('div');
		newdiv.className = 'added';
		newdiv.setAttribute('id','family_name' + aCounter + '-block');
		newdiv.innerHTML = '<label for="family_name' + aCounter + '" class="insert insert_family_name additional_insert" onClick=\'insertMenu("family_name' + aCounter + '");\'>Insert Diacritics</label><label for="given_name' + aCounter + '" class="insert insert_given_name additional_insert" onClick=\'insertMenu("given_name' + aCounter + '");\'>Insert Diacritics</label><br>';
		newdiv.innerHTML += '<div id="insert-family_name' + aCounter + '" class="additional_menu"></div><div id="insert-given_name' + aCounter + '" class="insert-given_name additional_menu"></div>';
		newdiv.innerHTML += '<span class="added-author"><input type="text" class="author translit-listen" id="family_name' + aCounter + '" placeholder="Family Name">, <input type="text" class="author translit-listen" id="given_name' + aCounter + '" placeholder="Given Name"> <select name="role' + aCounter + '" id="role'  + aCounter + '"><option value="art">artist</option><option selected value="aut">author</option><option value="ctb">contributor</option><option value="edt">editor</option><option value="ill">illustrator</option><option value="trl">translator</option></select></span>';
		$("#author-block").append(newdiv);
		var translit_div = document.createElement('div');
		translit_div.className = 'translit-family_name' + aCounter + '-block translit-block translit-author hidden';
		translit_div.setAttribute('id','translit-family_name' + aCounter + '-block');
		translit_div.innerHTML = '<label for="translit_family_name' + aCounter + '" class="insert insert_family_name hidden translit translit-family_name' + aCounter + '" onClick=\'insertMenu("translit_family_name' + aCounter + '");\'>Insert Diacritics</label><label for="translit_given_name' + aCounter + '" class="insert insert_given_name hidden translit translit-family_name' + aCounter + '" onClick=\'insertMenu("translit_given_name' + aCounter + '");\'>Insert Diacritics</label><br>';
		translit_div.innerHTML += '<div id="insert-translit_family_name' + aCounter + '"></div><div id="insert-translit_given_name' + aCounter + '"  class="insert-given_name"></div>';
		translit_div.innerHTML += '<input type="text" id="translit_family_name' + aCounter + '" class="hidden translit translit-family_name' + aCounter + '" placeholder="Transliterated Family Name"><span class="hidden translit-family_name' + aCounter + '">, </span><input type="text" id="translit_given_name' + aCounter + '" class="hidden translit translit-family_name' + aCounter + '" placeholder="Transliterated Given Name">';
		$("#family_name" + aCounter + '-block').append(translit_div);
		aCounter++;
	}
}

/*
 * Make all the conditionally required fields required, hide any fields that were revealed, remove fields that
 * were added
 */
$(":reset").click(function() {
	$(".conditional").attr("required","true");
	$(".conditional").removeAttr("disabled");
	$(".hidden").hide();
	$(".added").remove();
	$(".translit-block").css("padding","0px");
	counter = 1;
	aCounter = 0;
});

/*
 * The checkboxes that remove the required element from their associated field are all part of the class called listed, and
 *	all have an id with the form [associated input id]_listed. Once cliked, the associated field is no longer required, and
 *	is disabled until the box is unclicked. Both family name and given name will be disabled and not required if the name 
 *	checkbox is clicked, but will remain active if one of the fields is already filled in. If a box is unchecked, the field is
 *	reverted to normal.
 */
$(".listed").click(function() {
	var field = $(this).attr("id");
	field = field.substring(0,field.length-7);

	if (field !== "author") {
		field = '#' + field;
	}
	else {
		field = "." + field;
		if ($("#family_name").val() !== '' || $("#given_name").val() !== '') {
			return;
		}
	}

	if ($(this).is(':checked')) {
		$(field).removeAttr("required");
		$(field).attr("disabled","true");
	}
	else {
		$(field).attr("required","true");
		$(field).removeAttr("disabled");
	}
});

/*
 * Show or hide the literature dropdown based on response to radio button
 */
$("input:radio[name=literature]").click(function() {
	var value = $(this).val();
	if (value === "yes") {
		$("#literature-dropdown").show();
	}
	else {
		$("#literature-dropdown").hide();
	}
});

/*
 * Check that an optional field has been input
 *	attr: the field being checked
 *
 *	Return true if the field contains valid content, otherwise return false.
 */
function checkExists(attr) {
	if (typeof(attr) !== "undefined" && attr !== '' && attr !== null) {
		return true;
	}
	else {
		return false;
	}
}

/*
 * Once specific processing for a format has been done, create, and then download the resulting record
 *	text: One long string that will be written to the file
 *	filetype: What kind of file is being written (MARC,MARCXML,MODS,HTML)
 */
function downloadFile(text,filetype) {
	var download_file = document.createElement('a');

	if (filetype === 'mrc') {
		var header = 'data:application/marc;charset=utf-8,';
	}
	else if (filetype === 'html') {
		var header = 'data:text/html;charset=utf-8,';
	}
	else {
		var header = 'data:text/plain;charset=utf-8,';
	}

	download_file.setAttribute('href',header + encodeURIComponent(text));
	if (checkExists($("#filename").val())) {
		var filename = $("#filename").val();
	}
	else {
		var filename = 'record';
	}

	if (filetype === 'xml') {
		filename += '_MARCXML';
	}
	else if (filetype === 'mods') {
		filename += '_MODS';
		filetype = 'xml';
	}

	download_file.setAttribute('download', filename + '.' + filetype);
	var clickReplacement = new MouseEvent('click', {
		'view': window,
		'bubbles': true,
		'cancleable': false
	});
	download_file.dispatchEvent(clickReplacement);
}

/*
 * Return the current time in the format yyyymmddhhmmss.s in GMT
 */
function getTimestamp() {
	var date = new Date();
	date = date.toISOString();
	return date.substring(0,4) + date.substring(5,7) + date.substring(8,10) + date.substring(11,13) + date.substring(14,16) + date.substring(17,21);
}

function buildSubjectMenus(taxonomy,iteration) {
	root_subject = '\n\t\t\t<select id="root-subject' + iteration + '" class="root-subject">\n\t\t\t\t<option selected value=""></option>'
/*	level1_subject = '\n\t\t\t<select id="level1-subject' + iteration + '" class="level1-subject hidden">\n\t\t\t\t<option selected value=""></option>'
	level2_subject = '\n\t\t\t<select id="level2-subject' + iteration + '" class="level2-subject hidden">\n\t\t\t\t<option selected value=""></option>'
	level3_subject = '\n\t\t\t<select id="level3-subject' + iteration + '" class="level3-subject hidden">\n\t\t\t\t<option selected value=""></option>'*/

	for (var root in taxonomy) {
		root_subject += '\n\t\t\t\t<option>' + root + '</option>';

/*		for (var level1 in taxonomy[root]) {
			level1_subject += '\n\t\t\t\t<option class="hidden level1 ' + root.replace('&','AND').replace(/[,()]/g,'').replace(/ /g,'_') + '"';

			if ('id_number' in taxonomy[root][level1]) {
				level1_subject += ' value="' + taxonomy[root][level1]['id_number'] + '"';
			}
			level1_subject += '>' + level1 + '</option>'

			for (var level2 in taxonomy[root][level1]) {
				if (level2 != 'id_number' && level2 != 'action' && level2 != 'goto' && level2 != 'see also') {
					level2_subject += '\n\t\t\t\t<option class="hidden level2 ' + root.replace('&','AND').replace(/[,()]/g,'').replace(/ /g,'_') + '_' + level1.replace('&','and').replace(/[,()]/g,'').replace(/ /g,'_') + '"';
					if ('id_number' in taxonomy[root][level1][level2]) {
						level2_subject += ' value="' + taxonomy[root][level1][level2]['id_number'] + '"';
					}
					level2_subject += '>' + level2 + '</option>';

					for (var level3 in taxonomy[root][level1][level2]) {
						if (level3 != 'id_number' && level3 != 'action' && level3 != 'goto' && level3 != 'see also') {
							level3_subject += '\n\t\t\t\t<option class="hidden level3 ' + root.replace('&','AND').replace(/[,()]/g,'').replace(/ /g,'_') + '_' + level1.replace('&','and').replace(/[,()]/g,'').replace(/ /g,'_') + '_' + level2.replace('&','and').replace(/[,()]/g,'').replace(/ /g,'_') + '"';
							if ('id_number' in taxonomy[root][level1][level2][level3]) {
								level3_subject += ' value="' + taxonomy[root][level1][level2][level3]['id_number'] + '"';
							}
							level3_subject += '>' + level3 + '</option>';
						}
					}
				}
			}
		}*/
	}

	root_subject += '\n\t\t\t</select>';
/*	level1_subject += '\n\t\t\t</select><br>';
	level2_subject += '\n\t\t\t</select><br>';
	level3_subject += '\n\t\t\t</select><br>';*/

	return root_subject
}

var sCounter = 1;
function addSubject() {
	if (counter < 50) {
		var newdiv = document.createElement('div');
		newdiv.className = 'added added-subject';
		newdiv.setAttribute('id','subject' + sCounter + '-block');
		newdiv.innerHTML = buildSubjectMenus(getBISG(),sCounter);
		$("#subject_headings").append(newdiv);
		sCounter++;
	}
};

var subjectIDs = {};

function setSubject(path,root,block_number) {
	progression = ['root-subject','level1-subject','level2-subject','level3-subject']

	if (path[0] !== path[0].toUpperCase() || path[0] == 'LGBT' || path[0] == 'AIDS & HIV') {
		path.unshift(root)
	}
	console.log(path)

	var starting_point = 0
	var path_step_counter = 0
//	console.log(path)

	while (path[path_step_counter] != "") {
//		console.log("Option to find: " + path[path_step_counter])
		var number_of_options = $('#' + progression[starting_point] + block_number).children('option').length;
		var option_index = 1;
		var proceed = true;
//		console.log("Selection: " + '#' + progression[starting_point] + block_number)
		while (option_index < number_of_options && proceed) {
			var selected_option_text = $('#' + progression[starting_point] + block_number + ' option:eq(' + option_index + ')').text()
			var selected_option_class = $('#' + progression[starting_point] + block_number + ' option:eq(' + option_index + ')').attr("class")

//			console.log("Current text: " + selected_option_text)
//			console.log("Current class: " + selected_option_class)
//			console.log("Proceed: " + proceed)

			if (selected_option_class == null) {
				if (selected_option_text == path[path_step_counter]) {
					$('#' + progression[starting_point] + block_number + ' option:eq(' + option_index + ')').prop('selected', true);
					$('#' + progression[starting_point] + block_number).trigger('change')
					proceed = false
//					console.log("Selected")
				}
			}
			else {
				var root_presence = selected_option_class.indexOf(path[0].replace('&','AND').replace(/[,()]/g,'').replace(/ /g,'_'))
//				console.log(selected_option_text)
//				console.log(path[path_step_counter])
//				console.log("Match to: " + root_presence)
				if ((root_presence != -1) && (selected_option_text == path[path_step_counter])) {
					$('#' + progression[starting_point] + block_number + ' option:eq(' + option_index + ')').prop('selected', true);
//					console.log("Changing: #" + progression[starting_point] + block_number)
					$('#' + progression[starting_point] + block_number).trigger('change')
//					console.log("FROM SETSUBJECT: ")
//					console.log($('#' + progression[starting_point+1] + block_number).attr('class'))

//					var hidden_status = selected_option_class.indexOf('hidden')
//					if (hidden_status != -1) {
//						$('#' + progression[starting_point] + block_number).removeClass('hidden');
//						$('#' + progression[starting_point] + block_number + ' option:eq(' + option_index + ')').removeClass('hidden');
//					}

					proceed = false
//					console.log("Selected")
				}
			}
			option_index += 1;
//			console.log("More options to look through? ")
//			console.log(option_index < number_of_options)
//			console.log("Option not found: " + proceed)
		}
		path_step_counter += 1;
		starting_point += 1;
	}
//	console.log('#level2-subject' + block_number)
//	console.log($('#level2-subject' + block_number).attr('class'))
}

/*	If a subject with an id_number has already been selected, we don't want to select it again.
	Not only would that be a waste of space, it also leads to infinite loops when two id_numbers
	point to each other through a SEE ALSO. So we modify paths to remove any paths that lead to
	an id_number listed in subjectIDs.*/
function removeRedundantPaths(paths,root) {
	var new_unique_paths = []
	console.log(subjectIDs)

	for (path in paths) {
		test_path = []

		if (paths[path][0] !== paths[path][0].toUpperCase()) {
			test_path.push(root)
		}

		test_path = test_path.concat(paths[path])
		var taxonomy = getBISG();


		var test_path_pointer = 0
		var taxonomy_pointer = taxonomy
		var look_for_id_number = -1
//		console.log(taxonomy_pointer)
		while (test_path[test_path_pointer] != '') {
			if ('id_number' in taxonomy_pointer[test_path[test_path_pointer]]) {
				look_for_id_number = taxonomy_pointer[test_path[test_path_pointer]]['id_number']
			}

			if ('leaves' in taxonomy_pointer[test_path[test_path_pointer]]) {
				taxonomy_pointer = taxonomy_pointer[test_path[test_path_pointer]]['leaves']
			}
//			console.log(taxonomy_pointer)
			test_path_pointer += 1
		}
		console.log(look_for_id_number)
		console.log("HERE")

		var found = false
		for (value in subjectIDs) {
//			console.log(subjectIDs[value])
			if (subjectIDs[value] == look_for_id_number) {
				found = true
			}
		}

		if (!found) {
			new_unique_paths.push(paths[path])
		}

		console.log("HERE2")

//		console.log("Test Path:")
//		console.log(test_path)
//		console.log(paths[path])
	}

	return new_unique_paths
}

function runSEEALSO(paths,root) {
//	console.log("SEE ALSO")
//	console.log(paths)
	for (alternative in paths) {
		addSubject();
		setSubject(paths[alternative],root,sCounter-1)
	}
}

function runGOTO(paths,root,bloc_number) {
//	console.log("GOTO")
//	console.log(paths)
	setSubject(paths[0],root,bloc_number);

	if (paths.length > 1) {
		runSEEALSO(removeRedundantPaths(paths.slice(1),root),root);
	}
}

function takeAction(action,paths,root,bloc_number) {
	console.log(subjectIDs)
	if (action == 'goto') {
		runGOTO(paths,root,bloc_number);
	}
	else if (action == 'see also') {
		runSEEALSO(removeRedundantPaths(paths,root),root);
	}
};

function fillDynamicSubjectMenu(content,iteration,level,path,select_parent) {
	select_parent.append('<option selected value=""></option>')
	//var output_html = '\t\t\t\t<option selected value=""></option>'
	var new_option = '<option class="' + level + ' ' + path[0].replace('&','AND').replace(/[,()]/g,'').replace(/ /g,'_')
	for (var instance in content) {
//		console.log(instance)

//		var new_option = '\n\t\t\t\t<option class="' + level + ' ' + path[0].replace('&','AND').replace(/[,()]/g,'').replace(/ /g,'_')
		for (var pathcount = 1; pathcount < path.length; pathcount++) {
			new_option += '_' + path[pathcount].replace('&','and').replace(/[,()]/g,'').replace(/ /g,'_')
		}
		new_option += '"'

		if ('id_number' in content[instance]) {
			new_option += ' value="' + content[instance]['id_number'] + '"';
		}
		new_option += '>' + instance + '</option>';

		select_parent.append(new_option);

		new_option = '<option class="' + level + ' ' + path[0].replace('&','AND').replace(/[,()]/g,'').replace(/ /g,'_')

/*		level3_subject += '\n\t\t\t\t<option class="hidden level3 ' + root.replace('&','AND').replace(/[,()]/g,'').replace(/ /g,'_') + '_' + level1.replace('&','and').replace(/[,()]/g,'').replace(/ /g,'_') + '_' + level2.replace('&','and').replace(/[,()]/g,'').replace(/ /g,'_') + '"';
		if ('id_number' in taxonomy[root][level1][level2][level3]) {
			level3_subject += ' value="' + taxonomy[root][level1][level2][level3]['id_number'] + '"';
		}
		level3_subject += '>' + level3 + '</option>';*/
	}
//	console.log(output_html)
//	return output_html
}

function buildDynamicSubjectMenu(taxonomy,iteration,level,parent_level,path) {
//	var newdiv = document.createElement('select');
//	newdiv.className = level + '-subject';
//	newdiv.setAttribute('id',level + '-subject' + sCounter);
	var taxonomy_pointer = taxonomy[path[0]]['leaves']
//	console.log(taxonomy_pointer)
	var path_pointer = 1
	while (path_pointer < path.length) {
//		console.log(taxonomy_pointer)
		taxonomy_pointer = taxonomy_pointer[path[path_pointer]]['leaves']
		path_pointer += 1
	}

	if (!$.isEmptyObject(taxonomy_pointer)) {
		var newdiv = $("<select></select>").attr('id',level + '-subject' + iteration).addClass(level + '-subject');
		fillDynamicSubjectMenu(taxonomy_pointer,iteration,level,path,newdiv)
//		console.log(newdiv)
	//	newdiv.innerHTML = buildSubjectMenus(getBISG(),sCounter);
//		console.log("#" + parent_level + '-subject' + iteration)
	//	$("#" + 'subject' + iteration + '-block').append($('<br>'));
		$("#" + 'subject' + iteration + '-block').append(newdiv);
	}
}

function checkSubjectIDs(selected,bloc_number) {
	if ('id_number' in selected) {
		var present = false

		for (var value in subjectIDs) {
			if (subjectIDs[value] == selected['id_number']) {
				present = true
			}
		}

		if (!present) {
			subjectIDs[bloc_number] = selected['id_number']
		}
	}
}

/*
 * If a subject heading selector has been changed, show and hide the appropriate fields.
 */
$("#subject_headings").on('change','.root-subject',function() {
	var bloc_number = $(this).attr('id').substring("root-subject".length);
	var selected = $("#root-subject" + bloc_number + " option:selected").text();
	var class_name = "." + selected.replace('&','AND').replace(/[,()]/g,'').replace(/ /g,'_');
	$("#level3-subject" + bloc_number).remove();
	$("#level2-subject" + bloc_number).remove();
	$("#level1-subject" + bloc_number).remove();
/*	$(".level3").addClass('hidden')
	$("#level3-subject" + bloc_number).addClass('hidden');
	$("#level3-subject" + bloc_number + " option:eq(0)").prop('selected', true);
	$(".level2").addClass('hidden')
	$("#level2-subject" + bloc_number).addClass('hidden');
	$("#level2-subject" + bloc_number + " option:eq(0)").prop('selected', true);
	$("#level1-subject" + bloc_number + " option:eq(0)").prop('selected', true);*/

	if (selected != '') {
		buildDynamicSubjectMenu(getBISG(),bloc_number,'level1','root',[selected])
	}

/*	if (class_name.length > 1) {
		if (selected != '') {
			buildDynamicSubjectMenu(getBISG(),bloc_number,'level1','root',[selected])
			$(".level1").addClass('hidden');
			$("#level1-subject" + bloc_number).removeClass('hidden');
			$(class_name).removeClass('hidden');
		}
		else {
			$(".level1").addClass('hidden');
			$("#level1-subject" + bloc_number).addClass('hidden');
			$(class_name).addClass('hidden');
		}
	}
	else {
		$(".level1").addClass('hidden');
		$("#level1-subject" + bloc_number).addClass('hidden');
		$(class_name).addClass('hidden');
	}*/
});

$("#subject_headings").on('change','.level1-subject',function() {
//	console.log("LEVEL1 HANDLER FIRES")
	var bloc_number = $(this).attr('id').substring("level1-subject".length);
	var root = $("#root-subject" + bloc_number + " option:selected").text();
	var selected = $("#level1-subject" + bloc_number + " option:selected").text();
	var class_name = "." + root.replace('&','AND').replace(/[,()]/g,'').replace(/ /g,'_') + "_" + selected.replace('&','and').replace(/[,()]/g,'').replace(/ /g,'_');
/*	$(".level3").addClass('hidden')
	$("#level3-subject" + bloc_number).addClass('hidden');
	$("#level3-subject" + bloc_number + " option:eq(0)").prop('selected', true);
	$("#level2-subject" + bloc_number + " option:eq(0)").prop('selected', true);*/
	$("#level3-subject" + bloc_number).remove();
	$("#level2-subject" + bloc_number).remove();

	if ($("#level1-subject" + bloc_number + " option:selected").attr('value')) {
		$('#selection_id' + bloc_number).html($("#level1-subject" + bloc_number + " option:selected").attr('value'));
	}
	else {
		$('#selection_id' + bloc_number).html('');
	}

	var taxonomy = getBISG();

	if (selected != '') {
		buildDynamicSubjectMenu(taxonomy,bloc_number,'level2','level1',[root,selected])
	}

/*	console.log(class_name)
	console.log($(class_name).length)
	if ($(class_name).length > 0) {
		if (selected != '') {
			buildDynamicSubjectMenu(taxonomy,bloc_number,'level2','level1',[root,selected])
			$(".level2").addClass('hidden');
			$("#level2-subject" + bloc_number).removeClass('hidden');
			$(class_name).removeClass('hidden');
		}
		else {
			$(".level2").addClass('hidden');
			$("#level2-subject" + bloc_number).addClass('hidden');
			$(class_name).addClass('hidden');
		}
	}
	else {
		console.log("MADE IT TO THE CORRECT PLACE")
		$(".level2").addClass('hidden');
		$("#level2-subject" + bloc_number).addClass('hidden');
		$(class_name).addClass('hidden');
	}*/

	checkSubjectIDs(taxonomy[root]['leaves'][selected],bloc_number)

	if ('action' in taxonomy[root]['leaves'][selected]) {
		takeAction(taxonomy[root]['leaves'][selected]['action'],taxonomy[root]['leaves'][selected][taxonomy[root]['leaves'][selected]['action']],root,bloc_number)
	}
});

$("#subject_headings").on('change','.level2-subject',function() {
	var bloc_number = $(this).attr('id').substring("level2-subject".length);
	var root = $("#root-subject" + bloc_number + " option:selected").text();
	var selected1 = $("#level1-subject" + bloc_number + " option:selected").text();
	var selected = $("#level2-subject" + bloc_number + " option:selected").text();
	var class_name = "." + root.replace('&','AND').replace(/[,()]/g,'').replace(/ /g,'_') + "_" + selected1.replace('&','and').replace(/[,()]/g,'').replace(/ /g,'_') + "_" + selected.replace('&','and').replace(/[,()]/g,'').replace(/ /g,'_');
/*	$("#level3-subject" + bloc_number + " option:eq(0)").prop('selected', true);*/
	$("#level3-subject" + bloc_number).remove();

	if ($("#level2-subject" + bloc_number + " option:selected").attr('value')) {
		$('#selection_id' + bloc_number).html($("#level2-subject" + bloc_number + " option:selected").attr('value'));
	}
	else {
		$('#selection_id' + bloc_number).html('');
	}

	var taxonomy = getBISG();

	if (selected != '') {
		buildDynamicSubjectMenu(taxonomy,bloc_number,'level3','level2',[root,selected1,selected])
	}

/*	if ($(class_name).length > 0) {
		if (selected != '') {
			buildDynamicSubjectMenu(taxonomy,bloc_number,'level3','level2',[root,selected1,selected])
			$(".level3").addClass('hidden');
			$("#level3-subject" + bloc_number).removeClass('hidden');
			$(class_name).removeClass('hidden');
		}
		else {
			$(".level3").addClass('hidden');
			$("#level3-subject" + bloc_number).addClass('hidden');
			$(class_name).addClass('hidden');
		}
	}
	else {
		$(".level3").addClass('hidden');
		$("#level3-subject" + bloc_number).addClass('hidden');
		$(class_name).addClass('hidden');
	}*/

	checkSubjectIDs(taxonomy[root]['leaves'][selected1]['leaves'][selected],bloc_number)

	if ('action' in taxonomy[root]['leaves'][selected1]['leaves'][selected]) {
		takeAction(taxonomy[root]['leaves'][selected1]['leaves'][selected]['action'],taxonomy[root]['leaves'][selected1]['leaves'][selected][taxonomy[root]['leaves'][selected1]['leaves'][selected]['action']],root,bloc_number)
	}
});

$("#subject_headings").on('change','.level3-subject',function() {
	var bloc_number = $(this).attr('id').substring("level3-subject".length);
	var root = $("#root-subject" + bloc_number + " option:selected").text();
	var selected1 = $("#level1-subject" + bloc_number + " option:selected").text();
	var selected2 = $("#level2-subject" + bloc_number + " option:selected").text();
	var selected = $("#level3-subject" + bloc_number + " option:selected").text();
	if ($("#level3-subject" + bloc_number + " option:selected").attr('value')) {
		$('#selection_id' + bloc_number).html($("#level3-subject" + bloc_number + " option:selected").attr('value'));
	}
	else {
		$('#selection_id' + bloc_number).html('');
	}

	var taxonomy = getBISG();

	checkSubjectIDs(taxonomy[root]['leaves'][selected1]['leaves'][selected2]['leaves'][selected],bloc_number)

	if ('action' in taxonomy[root]['leaves'][selected1]['leaves'][selected2]['leaves'][selected]) {
		takeAction(taxonomy[root]['leaves'][selected1]['leaves'][selected2]['leaves'][selected]['action'],taxonomy[root]['leaves'][selected1]['leaves'][selected2]['leaves'][selected][taxonomy[root]['leaves'][selected1]['leaves'][selected2]['leaves'][selected]['action']],root,bloc_number)
	}
});
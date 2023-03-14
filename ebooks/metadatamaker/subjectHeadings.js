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
		newdiv.className = 'added added-subject subject-block';
		newdiv.setAttribute('id','subject' + sCounter + '-block');
		newdiv.innerHTML = '<div id="verification' + sCounter + '" class="verification unverified">Invalid Subject Heading <span style="color: red;">&#x2717;</span></div>' + buildSubjectMenus(getBISAC(),sCounter);
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
		var taxonomy = getBISAC();


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
	//	newdiv.innerHTML = buildSubjectMenus(getBISAC(),sCounter);
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

	$('#verification' + bloc_number).html('Invalid Subject Heading <span style="color: red;">&#x2717;</span>');
	$("#verification" + bloc_number).removeClass('verified');
	$("#verification" + bloc_number).addClass('unverified');
	$("#verification" + bloc_number).removeAttr('value');
	$("#subject" + bloc_number + "-block").removeClass('valid');

	if (selected != '') {
		buildDynamicSubjectMenu(getBISAC(),bloc_number,'level1','root',[selected])
	}

/*	if (class_name.length > 1) {
		if (selected != '') {
			buildDynamicSubjectMenu(getBISAC(),bloc_number,'level1','root',[selected])
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
		$('#verification' + bloc_number).html('Valid Subject Heading <span style="color: #1D84F6;">&#x2713;</span>');
		$("#verification" + bloc_number).removeClass('unverified');
		$("#verification" + bloc_number).addClass('verified');
		$("#verification" + bloc_number).attr('value',$("#level1-subject" + bloc_number + " option:selected").attr('value'));
		$("#subject" + bloc_number + "-block").addClass('valid');
	}
	else {
		$('#verification' + bloc_number).html('Invalid Subject Heading <span style="color: red;">&#x2717;</span>');
		$("#verification" + bloc_number).removeClass('verified');
		$("#verification" + bloc_number).addClass('unverified');
		$("#verification" + bloc_number).removeAttr('value');
		$("#subject" + bloc_number + "-block").removeClass('valid');
	}

	var taxonomy = getBISAC();

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
		$('#verification' + bloc_number).html('Valid Subject Heading <span style="color: #1D84F6;">&#x2713;</span>');
		$("#verification" + bloc_number).removeClass('unverified');
		$("#verification" + bloc_number).addClass('verified');
		$("#verification" + bloc_number).attr('value',$("#level2-subject" + bloc_number + " option:selected").attr('value'));
		$("#subject" + bloc_number + "-block").addClass('valid');
	}
	else {
		$('#verification' + bloc_number).html('Invalid Subject Heading <span style="color: red;">&#x2717;</span>');
		$("#verification" + bloc_number).removeClass('verified');
		$("#verification" + bloc_number).addClass('unverified');
		$("#verification" + bloc_number).removeAttr('value');
		$("#subject" + bloc_number + "-block").removeClass('valid');
	}

	var taxonomy = getBISAC();

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
		$('#verification' + bloc_number).html('Valid Subject Heading <span style="color: #1D84F6;">&#x2713;</span>');
		$("#verification" + bloc_number).removeClass('unverified');
		$("#verification" + bloc_number).addClass('verified');
		$("#verification" + bloc_number).attr('value',$("#level3-subject" + bloc_number + " option:selected").attr('value'));
		$("#subject" + bloc_number + "-block").addClass('valid');
	}
	else {
		$('#verification' + bloc_number).html('Invalid Subject Heading <span style="color: red;">&#x2717;</span>');
		$("#verification" + bloc_number).removeClass('verified');
		$("#verification" + bloc_number).addClass('unverified');
		$("#verification" + bloc_number).removeAttr('value');
		$("#subject" + bloc_number + "-block").removeClass('valid');
	}

	var taxonomy = getBISAC();

	checkSubjectIDs(taxonomy[root]['leaves'][selected1]['leaves'][selected2]['leaves'][selected],bloc_number)

	if ('action' in taxonomy[root]['leaves'][selected1]['leaves'][selected2]['leaves'][selected]) {
		takeAction(taxonomy[root]['leaves'][selected1]['leaves'][selected2]['leaves'][selected]['action'],taxonomy[root]['leaves'][selected1]['leaves'][selected2]['leaves'][selected][taxonomy[root]['leaves'][selected1]['leaves'][selected2]['leaves'][selected]['action']],root,bloc_number)
	}
});
/*
 * When the insert menu is open ESC will get rid of it
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
 */
function insertChar(field,insert_value) {
	var current_contents = $("#" + field).val();
	$("#" + field).val(current_contents + insert_value);
	$("#" + field).focus();
	$("#insert-popup").remove();
}

/*
 * When the Insert button is pressed, create a floating keyboard with characters to insert
 */
function constructMenu(field) {
	var unicodes = ['0301','04D5','04D4','0357','0351','0306','00A3','0310','0327','030A','0325','0302','005E','00A9','0111','0110','0366','0323','00B7','02DD','0324','FE22','FE23','0333','00DF','00F0','00D0','20AC','0060','0300','030C','0313','0315','0328','00A1','00BF','0142','0141','007B','0321','FE20','FE21','0304','02B9','266D','266F','01A1','01A0','00F8','00D8','0153','0152','2117','00B1','0309','007D','0322','2113','2080','2081','2082','2083','2084','2085','2086','2087','2088','2089','2070','00B9','00B2','00B3','2074','2075','2076','2077','2078','2079','207D','207E','207B','207A','00FE','00DE','0303','007E','0131','02BA','01B0','01AF','0308','0332','005F','032E','03B1','2020','0263','00AE'];
	var return_string = "	<div id='buttons'>\n";
	for (var i = 0; i < unicodes.length; i++) {
		var new_tag = "<button value='" + String.fromCharCode(parseInt(unicodes[i],16)) + "' id='" + unicodes[i] + "' class='diacritics ";

		if (i%14 === 13 && i + 14 > unicodes.length) {
			new_tag += 'bottom-right';
		}
		else if (i + 14 >= unicodes.length) {
			new_tag += 'last-row';
		}
		else if (i%14 === 13) {
			new_tag += 'row-end';
		}
		else {
			new_tag += 'normal-button';
		}

		new_tag += "' type='button' onClick='insertChar(\"" + field + "\",\"" + String.fromCharCode(parseInt(unicodes[i],16)) + "\")'>&#x" + unicodes[i] + "</button>";

		if (i%14 === 13) {
			new_tag += "<br>\n";
		}

		return_string += new_tag;
	};
	return_string += "	</div>";
	return return_string;
}

/*
 * Insert special characters into field
 */
function insertMenu(field) {
	if (document.getElementById("insert-popup")) {
		$("#insert-popup").remove();
	}
	else {
		var newdiv = document.createElement('div');
		newdiv.setAttribute('id','insert-popup');
		newdiv.innerHTML = constructMenu(field);
		$("#insert-" + field).append(newdiv);
	}
}

/*
 * when one of the author fields has been filled in, the other is no longer required
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
 * Set highest allowed year to next year
 */
//var present = new Date().getFullYear();
$(".date").attr("max",1000000);

/*
 * Make all the conditionally required fields required
 */
$(":reset").click(function() {
	$(".conditional").attr("required","true");
	$(".conditional").removeAttr("disabled");
});

/*
 * Check that an optional field has been input
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
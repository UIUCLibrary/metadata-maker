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

/*	There are some blocks of numbers 4 or 5 digits long that require leading zeros if the number isn't big enough to
 *	fill all the digits.
 *
 *	content: The number that needs to go into the field
 *	type: Determines the number of digits to output
 *			- 'length' will output 4 digits
 *			- anything else will output 5 digits
 */
function addZeros(content,type) {
	var str = content.toString();
	if (type === 'length') {
		var num_zeros = 4 - str.length;
	}
	else {
		var num_zeros = 5 - str.length;
	}
	var output = '';
	for (var i = 0; i < num_zeros; i++) {
		output += '0';
	};
	output += str;
	return output;
}

/*
 * returns the length of a UTF-8 string in bytes. Acounts for the varying lengths of characters.
 */
function getByteLength(text) {
	var byteLength = 0;
	for (var i = 0; i < text.length; i++) {
		var c = text[i];
		
		if ( c <= '\u007F' && c >= '\u0000') {
			byteLength += 1;
		}
		else if ( c >= '\u0080' && c <= '\u07FF') {
			byteLength += 2;
		}
		else if ( c >= '\u0800' && c <= '\uFFFF') {
			byteLength += 3;
		}
		else if ( c >= '\u10000' && c <= '\u1FFFFF') {
			byteLength += 4;
		}
	}
	return byteLength;
}

/*
 * Generates the MARC format's 008 controlfield for books
 */
function create008Field(record) {
	var controlfield008 = '';

	var timestamp = getTimestamp();
	timestamp = timestamp.substring(2,8);

	controlfield008 += timestamp;

	if (checkExists(record.publication_year) && checkExists(record.copyright_year)) {
		controlfield008 += 't' + record.publication_year + record.copyright_year;
	}
	else if (checkExists(record.publication_year)) {
		controlfield008 += 's' + record.publication_year + '    ';
	}
	else if (checkExists(record.copyright_year)) {
		controlfield008 += 't' + record.copyright_year + record.copyright_year;
	}
	else {
		controlfield008 += 'nuuuuuuuu';
	}

	controlfield008 += 'ilu';

	if (checkExists(record.illustrations_yes) && record.illustrations_yes == true) {
		controlfield008 += 'a   ';
	}
	else {
		controlfield008 += '    '
	}

	controlfield008 += '       000 ';

	if (checkExists(record.literature_yes) && checkExists(record.literature_dropdown)) {
		controlfield008 += record.literature_dropdown;
	}
	else {
		controlfield008 += '0';
	}

	controlfield008 += ' ' + record.language + ' d';

	return controlfield008;
}

/*
 * Crate MARC subfield
 */
function createSubfield(code,content) {
	return String.fromCharCode(31) + code + content;
}

/*
 * Crate MARC field, containing all the appropriate subfields
 */
function createContent(ind,subfields) {
	var content = String.fromCharCode(30) + ind;
	for (var i = 0; i < subfields.length; i++) {
		content += subfields[i];
	}
	return content;
}

/*
 * For use in the fill functions. The MARC equivalent of createMARCXMLField. The input tag is unused but is needed
 * so the two equivalent functions take the same input.
 */
function createContentFill(tag,ind1,ind2,subfields) {
	return createContent(ind1+ind2,subfields);
}

/*
 * Create entry in the directory portion of the MARC record for a field in the content portion
 */
function createDirectory(number,content,head) {
	return number + addZeros(getByteLength(content),'length') + addZeros(head,'head');
}

/*
 * Create a MARCXML subfield
 */
function createMARCXMLSubfield(code,content) {
	return '    <subfield code="' + code + '">' + content + '</subfield>\n';
}

/*
 * Create a datafield from the tag, the two ind's, and an array of subfields.
 */
function createMARCXMLField(tag,ind1,ind2,subfields) {
	var datafield = '  <datafield tag="' + tag + '" ind1="' + ind1 + '" ind2="' + ind2 + '">\n';
	for (var i = 0; i < subfields.length; i++) {
		datafield += subfields[i];
	}
	datafield += '  </datafield>\n';
	return datafield;
}

/*
 * Only for English and French non-filing characters
 */
function getNonfilingCount(title,lang) {
	if (lang === 'eng') {
		if (title.substring(0,2) === 'A ') {
			return '2';
		}
		else if (title.substring(0,3) === 'An ') {
			return '3';
		}
		else if (title.substring(0,4) === 'The ') {
			return '4';
		}
		else {
			return '0';
		}
	}
	else {
		if (title.substring(0,2) === "L'") {
			return '2';
		}
		else if (title.substring(0,3) === 'Le ' || title.substring(0,3) === 'La ') {
			return '3';
		}
		else if (title.substring(0,4) === 'Les ') {
			return '4';
		}
		else {
			return '0';
		}
	}
}

function fillTitle(record,head,fieldFunc,subfieldFunc) {
	//author_array[0] contains the contents of the first author field
	var title_ind1 = checkExists(record.author['family']) || checkExists(record.author['given']) ? '1' : '0';

	if (record.language === 'eng' || record.language === 'fre') {
		var title_ind2 = getNonfilingCount(record.title,record.language);
	}
	else {
		var title_ind2 = '0';
	}

	var title_subfields = [];
	title_subfields.push(subfieldFunc('a',record.title + '.'));

	var title = fieldFunc('245',title_ind1,title_ind2,title_subfields);
	//MARC
	if (head !== null) {
		var title_directory = createDirectory('245',title,head);
		return [title_directory,title];
	}
	//MARCXML
	else {
		return title;
	}
}

function fillPublication(record,head,fieldFunc,subfieldFunc) {
	var subfields = [subfieldFunc('a','Urbana, Ill. :'),subfieldFunc('b','University of Illinois at Urbana-Champaign,'),subfieldFunc('c',record.publication_year)];
	var pub = fieldFunc('264',' ','1',subfields);

	//MARC
	if (head !== null) {
		var pub_directory = createDirectory('264',pub,head);
		return [pub_directory,pub];
	}
	//MARCXML
	else {
		return pub;
	}
}

function fillAuthor(record,head,fieldFunc,subfieldFunc) {
	var role_index = { 'art': 'artist', 'aut': 'author', 'ctb': 'contributor', 'edt': 'editor', 'ill': 'illustrator', 'trl': 'translator'}

	var author_content = '';
	if(checkExists(record.author['family']) && checkExists(record.author['given'])) {
		author_content = record.author['family'] + ', ' + record.author['given'] + ',';
	}
	else if (checkExists(record.author['family']) || checkExists(record.author['given'])) {
		if (checkExists(record.author['family'])) {
			author_content = record.author['family'] + ','
		}
		else {
			author_content = record.author['given'] + ','
		}
	}
	else {
		return head !== null ? ['',''] : '';
	}

	var author_subfields = [subfieldFunc('a',author_content),subfieldFunc('e','author.'),subfieldFunc('4','aut')];
	var author = fieldFunc('100','1',' ',author_subfields);

	//MARC
	if (head !== null) {
		var author_directory = createDirectory('100',author,head);
		return [author_directory,author];
	}
	//MARCXML
	else {
		return author;
	}
}

function fillPhysical(record,head,fieldFunc,subfieldFunc) {
	var label = 'pages';
	if (record.number_of_pages == 1) {
		label = label.substring(0,label.length-1);
	}

	var subfields = []
	subfields.push(subfieldFunc('a',record.number_of_pages + ' ' + label + '. ;'));
	var physical = fieldFunc('300',' ',' ',subfields);

	//MARC
	if (head !== null) {
		var physical_directory = createDirectory('300',physical,head);
		return [physical_directory,physical];
	}
	//MARCXML
	else {
		return physical;
	}
}

function fillDissertationType(record,head,fieldFunc,subfieldFunc) {
	var pub_subfields = [];

	pub_subfields.push(subfieldFunc('b',record.dissertation_type + '.'));
	pub_subfields.push(subfieldFunc('c','University of Illinois at Urbana-Champaign'));
	pub_subfields.push(subfieldFunc('d',record.publication_year + '.'));

	var pub = fieldFunc('502',' ','1',pub_subfields);

	//MARC
	if (head !== null) {
		var pub_directory = createDirectory('502',pub,head);
		return [pub_directory,pub];
	}
	//MARCXML
	else {
		return pub;
	}
}

function fillBibliography(record,head,fieldFunc,subfieldFunc) {
	var full_string = 'p. ' + record.bibliographies;

	if (full_string.indexOf('-') != -1) {
		full_string = 'p' + full_string; 
	}

	var bib = fieldFunc('504',' ',' ',subfieldFunc('a',full_string));

	//MARC
	if (head != null) {
		var bib_directory = createDirectory('504',bib,head);
		return [bib_directory,bib];
	}
	//MARCXML
	else {
		return bib;
	}
}

function fillMajor(record,head,fieldFunc,subfieldFunc) {
	var subfields = [];
	subfields.push(subfieldFunc('a','Theses'));
	subfields.push(subfieldFunc('x','UIUC'));
	subfields.push(subfieldFunc('y',record.publication_year));
	subfields.push(subfieldFunc('x',record.major));

	var major_data = fieldFunc('690',' ',' ',subfields);

	//MARC
	if (head != null) {
		var major_directory = createDirectory('690',major_data,head);
		return [major_directory,major_data];
	}
	//MARCXML
	else {
		return major_data;
	}
}

function downloadMARC(record) {
	var head = 0;

	var timestamp_content = String.fromCharCode(30) + getTimestamp();
	var timestamp_directory = createDirectory('005',timestamp_content,head);
	head += timestamp_content.length;

	var controlfield008_content = String.fromCharCode(30) + create008Field(record);
	var controlfield008_directory = createDirectory('008',controlfield008_content,head);
	head += controlfield008_content.length;

	var title = fillTitle(record,head,createContentFill,createSubfield);
	head += getByteLength(title[1]);

	var author = fillAuthor(record,head,createContentFill,createSubfield);
	head += getByteLength(author[1]);

	var pub = fillPublication(record,head,createContentFill,createSubfield);
	head += getByteLength(pub[1]);

	var physical = fillPhysical(record,head,createContentFill,createSubfield);
	head += getByteLength(physical[1]);

	var default1_content = createContent('  ',[createSubfield('a','text'),createSubfield('b','txt'),createSubfield('2','rdacontent')]);
	var default1_directory = createDirectory('336',default1_content,head);
	head += default1_content.length;

	var default2_content = createContent('  ',[createSubfield('a','unmediated'),createSubfield('b','n'),createSubfield('2','rdamedia')]);
	var default2_directory = createDirectory('337',default2_content,head);
	head += default2_content.length;

	var default3_content = createContent('  ',[createSubfield('a','volume'),createSubfield('b','nc'),createSubfield('2','rdacarrier')]);
	var default3_directory = createDirectory('338',default3_content,head);
	head += default3_content.length;

	var dissertation = fillDissertationType(record,head,createContentFill,createSubfield);
	head += getByteLength(dissertation[1]);

	var bib = fillBibliography(record,head,createContentFill,createSubfield);
	head += getByteLength(bib[1]);

	var major = fillMajor(record,head,createContentFill,createSubfield);
	head += getByteLength(major[1]);

	var end = String.fromCharCode(30) + String.fromCharCode(29);
	var text = timestamp_directory + controlfield008_directory + title[0] + author[0] + pub[0] + physical[0] + default1_directory + default2_directory + default3_directory + dissertation[0] + bib[0] + major[0] + timestamp_content + controlfield008_content + title[1] + author[1] + pub[1] + physical[1] + default1_content + default2_content + default3_content + dissertation[1] + bib[1] + major[1] + end;
	var leader_len = getByteLength(text) + 24;
	var directory_len = 25 + timestamp_directory.length + controlfield008_directory.length + title[0].length + author[0].length + pub[0].length + physical[0].length + default1_directory.length + default2_directory.length + default3_directory.length + dissertation[0].length + bib[0].length + major[0].length;
	var leader = addZeros(leader_len,'leader') + 'ntm a22' + addZeros(directory_len,'leader') + 'ki 4500';
	text = leader + text;
	downloadFile(text,'mrc');
}

function downloadXML(record) {
	var startText = '<?xml version="1.0" encoding="utf-8"?>\n<record xmlns="http://www.loc.gov/MARC21/slim" xsi:schemaLocation="http://www.loc.gov/MARC21/slim http://www.loc.gov/standards/marcxml/schema/MARC21slim.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">\n  <leader>01447ntm a2200397ki 4500</leader>\n  <controlfield tag="001"></controlfield>\n';
	
	var formatted_date = getTimestamp();
	var timestamp = '  <controlfield tag="005">' + formatted_date + '</controlfield>\n';
	
	var controlfield008 = create008Field(record);
	controlfield008 = '  <controlfield tag="008">' + controlfield008 + '</controlfield>\n';

	var title = fillTitle(record,null,createMARCXMLField,createMARCXMLSubfield);
	var author = fillAuthor(record,null,createMARCXMLField,createMARCXMLSubfield);
	var pub = fillPublication(record,null,createMARCXMLField,createMARCXMLSubfield);
	var physical = fillPhysical(record,null,createMARCXMLField,createMARCXMLSubfield);
	var default1 = createMARCXMLField('336',' ',' ',[createMARCXMLSubfield('a','text'),createMARCXMLSubfield('b','txt'),createMARCXMLSubfield('2','rdacontent')]) + createMARCXMLField('337',' ',' ',[createMARCXMLSubfield('a','unmediated'),createMARCXMLSubfield('b','n'),createMARCXMLSubfield('2','rdamedia')]) + createMARCXMLField('338',' ',' ',[createMARCXMLSubfield('a','volume'),createMARCXMLSubfield('b','nc'),createMARCXMLSubfield('2','rdacarrier')]);
	var dissertation = fillDissertationType(record,null,createMARCXMLField,createMARCXMLSubfield);
	var bibliography = fillBibliography(record,null,createMARCXMLField,createMARCXMLSubfield);
	var major = fillMajor(record,null,createMARCXMLField,createMARCXMLSubfield);

	var endText ='</record>\n';

	var text = startText + timestamp + controlfield008 + title + author + pub + physical + default1 + dissertation + bibliography + major + endText;
	downloadFile(text,'xml');
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
		number_of_pages: $("#pages").val(),
		bibliographies: $("#bib").val(),
		major: $("#major").val()
	};

	if ($("#MARC").is(':checked')) {
		downloadMARC(recordObject);
	}

	if ($("#MARCXML").is(':checked')) {
		downloadXML(recordObject);
	}

	event.preventDefault();
});
//If there are non-Latin characters, show transliteration field
function toggleTranslit(id) {
	//Regex for everything outside the standard character set
	var nonroman = /[^\u0000-\u024F\u0263\u02B9\u02BA\u02DD\u0300\u0301\u0302\u0303\u0304\u0306\u0308\u0309\u030A\u030C\u0310\u0313\u0315\u0321\u0322\u0323\u0324\u0325\u0327\u0328\u032E\u0332\u0333\u0351\u0357\u0366\u03B1\u04D4\u04D5\u2020\u2070\u2074\u2075\u2076\u2077\u2078\u2079\u207A\u207B\u207D\u207E\u2080\u2081\u2082\u2083\u2084\u2085\u2086\u2087\u2088\u2089\u20AC\u2113\u2117\u266D\u266F\uFE20\uFE21\uFE22\uFE23]/;
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

//If a listening field has been changed, send the id to the toggler.
$("#marc-maker").on('change','.translit-listen',function() {
	toggleTranslit($(this).attr("id"));
});

$(document).keyup(function(e) {
	if (e.keyCode === 27) {
		if (document.getElementById("insert-popup")) {
			$("#insert-popup").remove();
		}
	}
});

function insertChar(field,insert_value) {
	var current_contents = $("#" + field).val();
	$("#" + field).val(current_contents + insert_value);
	$("#" + field).focus();
	$("#insert-popup").remove();
}

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

//Insert special characters into field
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

//when one of the author fields has been filled in, the other is no longer required
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

//Set highest allowed year to next year
var present = new Date().getFullYear();
$(".date").attr("max",present+1);

//Add keyword fields
var counter = 1;
function addKeyword() {
	if (counter < 50) {
		var newdiv = document.createElement('div');
		newdiv.className = 'added';
		newdiv.innerHTML = '	<br><input type="text" class="keyword" id="keyword' + counter +'">';
		$("#keywords").append(newdiv);
		counter++;
	}
};

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

//Make all the conditionally required fields required
$(":reset").click(function() {
	$(".conditional").attr("required","true");
	$(".conditional").removeAttr("disabled");
	$(".hidden").hide();
	$(".added").remove();
	$(".translit-block").css("padding","0px");
	counter = 1;
});

//If the attribute is listed, make it not required
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

//Show or hide the literature dropdown based on response to radio button
$("input:radio[name=literature]").click(function() {
	var value = $(this).val();
	if (value === "yes") {
		$("#literature-dropdown").show();
	}
	else {
		$("#literature-dropdown").hide();
	}
});

//Check that an optional field has been input
function checkExists(attr) {
	if (typeof(attr) !== "undefined" && attr !== '' && attr !== null) {
		return true;
	}
	else {
		return false;
	}
}

//Once specific processing for a format has been done, create, and then download the resulting record
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

//Return the current time in the format yyyymmddhhmmss.s in GMT
function getTimestamp() {
	var date = new Date();
	date = date.toISOString();
	return date.substring(0,4) + date.substring(5,7) + date.substring(8,10) + date.substring(11,13) + date.substring(14,16) + date.substring(17,21);
}

/*	There are some blocks of numbers 4 or 5 digits long that require leading zeros if the number isn't big enough to
	fill all the digits.

	content: The number that needs to go into the field
	type: Determines the number of digits to output
			- 'length' will output 4 digits
			- anything else will output 5 digits
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

//returns the length of a UTF-8 string in bytes. Acounts for the varying lengths of characters.
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

//Generates the MARC format's 008 controlfield for books
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

	if (checkExists(record.publication_country)) {
		controlfield008 += record.publication_country;
		if (record.publication_country.length === 2) {
			controlfield008 += ' ';
		}
	}
	else {
		controlfield008 += 'xx ';
	}

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

function createSubfield(code,content) {
	return String.fromCharCode(31) + code + content;
}

function createContent(ind,subfields) {
	var content = String.fromCharCode(30) + ind;
	for (var i = 0; i < subfields.length; i++) {
		content += subfields[i];
	}
	return content;
}

//For use in the fill functions
function createContentFill(tag,ind1,ind2,subfields) {
	return createContent(ind1+ind2,subfields);
}

//Create entry in the directory portion of the MARC record for a field in the content portion
function createDirectory(number,content,head) {
	return number + addZeros(getByteLength(content),'length') + addZeros(head,'head');
}

function createMARCXMLSubfield(code,content) {
	return '    <subfield code="' + code + '">' + content + '</subfield>\n';
}

//Create a datafield from the tag, the two ind's, and an array of subfields.
function createMARCXMLField(tag,ind1,ind2,subfields) {
	var datafield = '  <datafield tag="' + tag + '" ind1="' + ind1 + '" ind2="' + ind2 + '">\n';
	for (var i = 0; i < subfields.length; i++) {
		datafield += subfields[i];
	}
	datafield += '  </datafield>\n';
	return datafield;
}

function fillISBN(record,head,fieldFunc,subfieldFunc) {
	if (checkExists(record.isbn)) {
		var isbn = fieldFunc('020',' ',' ',[subfieldFunc('a',record.isbn)]);

		//MARC
		if (head !== null) {
			var isbn_directory = createDirectory('020',isbn,head);
			return [isbn_directory,isbn];
		}
		//MARCXML
		else {
			return isbn;
		}
	}
	else {
		return head !== null ? ['',''] : '';
	}
}

function fillAuthor(record,head,fieldFunc,subfieldFunc) {
	//Transliteration is in author_array[1], normal author input in author_array[0]
	var latin_index = checkExists(record.author[1]['family']) || checkExists(record.author[1]['given']) ? 1 : 0;
	var role_index = { 'art': 'artist', 'aut': 'author', 'ctb': 'contributor', 'edt': 'editor', 'ill': 'illustrator', 'trl': 'translator'}

	var author_content = '';
	if(checkExists(record.author[latin_index]['family']) && checkExists(record.author[latin_index]['given'])) {
		author_content = record.author[latin_index]['family'] + ', ' + record.author[latin_index]['given'] + ',';
	}
	else if (checkExists(record.author[latin_index]['family']) || checkExists(record.author[latin_index]['given'])) {
		if (checkExists(record.author[latin_index]['family'])) {
			author_content = record.author[latin_index]['family'] + ','
		}
		else {
			author_content = record.author[latin_index]['given'] + ','
		}
	}
	else {
		return head !== null ? ['',''] : '';
	}

	var author_subfields = [subfieldFunc('a',author_content),subfieldFunc('e', role_index[record.author[0]['role']] + '.'),subfieldFunc('4',record.author[0]['role'])];
	if (latin_index === 1) {
		author_subfields.push(subfieldFunc('6','880-03'));
	}
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
	var title_ind1 = checkExists(record.author[0]['family']) || checkExists(record.author[0]['given']) ? '1' : '0';
	var latin_index = checkExists(record.title[1]['title']) || checkExists(record.title[1]['subtitle']) ? 1 : 0;

	if (record.language === 'eng' || record.language === 'fre') {
		var title_ind2 = getNonfilingCount(record.title[latin_index]['title'],record.language);
	}
	else {
		var title_ind2 = '0';
	}

	var title_subfields = [];
	if (checkExists(record.title[0]['subtitle'])) {
		title_subfields.push(subfieldFunc('a',record.title[latin_index]['title'] + ' :'),subfieldFunc('b',record.title[latin_index]['subtitle'] + '.'));
	}
	else {
		title_subfields.push(subfieldFunc('a',record.title[latin_index]['title'] + '.'));
	}

	if (latin_index === 1) {
		title_subfields.push(subfieldFunc('6','880-01'));
	}

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

function fillEdition(record,head,fieldFunc,subfieldFunc) {
	if (checkExists(record.edition)) {
		if (record.edition.substring(record.edition.length-1,record.edition.length) === '.') {
			record.edition = record.edition.substring(0,record.edition.length-1);
		}
		var edition = fieldFunc('250',' ',' ',[subfieldFunc('a',record.edition + '.')]);

		//MARC
		if (head !== null) {
			var edition_directory = createDirectory('250',edition,head);
			return [edition_directory,edition];
		}
		//MARCXML
		else {
			return edition;
		}
	}
	else {
		return head !== null ? ['',''] : '';
	}
}

function fillPublication(record,head,fieldFunc,subfieldFunc) {
	var pub_subfields = [];
	if (checkExists(record.publication_place)) {
		if (checkExists(record.translit_place)) {
			pub_subfields.push(subfieldFunc('a',record.translit_place + ' :'));
		}
		else {
			pub_subfields.push(subfieldFunc('a',record.publication_place + ' :'));
		}
	}
	else {
		pub_subfields.push(subfieldFunc('a','[Place of publication not identified] :'));
	}

	if (checkExists(record.publisher)) {
		if (checkExists(record.translit_publisher)) {
			pub_subfields.push(subfieldFunc('b',record.translit_publisher + ','));
		}
		else {
			pub_subfields.push(subfieldFunc('b',record.publisher + ','));
		}
	}
	else {
		pub_subfields.push(subfieldFunc('b','[publisher not identified],'));
	}

	if (checkExists(record.publication_year)) {
		pub_subfields.push(subfieldFunc('c',record.publication_year + '.'));
	}
	else if (checkExists(record.copyright_year)) {
		pub_subfields.push(subfieldFunc('c','[' + record.copyright_year + ']'));
	}
	else {
		pub_subfields.push(subfieldFunc('c','[date of publication not identified]'));
	}

	if (checkExists(record.translit_publisher)  || checkExists(record.translit_place)) {
		pub_subfields.push(subfieldFunc('6','880-02'));
	}

	var pub = fieldFunc('264',' ','1',pub_subfields);

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

function fillCopyright(record,head,fieldFunc,subfieldFunc) {
	if (checkExists(record.copyright_year)) {
		var copyright = fieldFunc('264',' ','4',[subfieldFunc('c','\u00A9' + record.copyright_year)]);

		//MARC
		if (head !== null) {
			var copyright_directory = createDirectory('264',copyright,head);
			return [copyright_directory,copyright];
		}
		//MARCXML
		else {
			return copyright;
		}
	}
	else {
		return head !== null ? ['',''] : '';
	}
}

function fillPhysical (record,head,fieldFunc,subfieldFunc) {
	var physical_subfields = [];

	if (record.pages === '0' || record.unpaged || (record.volume_or_page === 'volumes' && record.pages === '1')) {
		var pages_string = '1 volume (unpaged)';
	}
	else if (record.pages === '1') {
		var pages_string = '1 page';
	}
	else {
		var pages_string = record.pages + ' ' + record.volume_or_page;
	}

	if (checkExists(record.illustrations_yes) && record.illustrations_yes == true) {
		physical_subfields.push(subfieldFunc('a',pages_string + ' :'),subfieldFunc('b','illustrations ;'));
	}
	else {
		physical_subfields.push(subfieldFunc('a',pages_string + ' ;'));
	}
	physical_subfields.push(subfieldFunc('c',record.dimensions + ' cm'));
	var physical = fieldFunc('300',' ',' ',physical_subfields);

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

function fillNotes(record,head,fieldFunc,subfieldFunc) {
	if (checkExists(record.notes)) {
		var notes = fieldFunc('500',' ',' ',[subfieldFunc('a',record.notes)]);

		//MARC
		if (head !== null) {
			var notes_directory = createDirectory('500',notes,head);
			return [notes_directory,notes];
		}
		//MARCXML
		else {
			return notes;
		}
	}
	else {
		return head !== null ? ['',''] : '';
	}
}

function fillKeywords(record,head,fieldFunc,subfieldFunc) {
	var keywords_content = '';
	var keywords_directory = '';
	for (var c = 0; c < record.keywords.length; c++) {
		if (record.keywords[c] !== '') {
			var new_content = fieldFunc('653',' ',' ',[subfieldFunc('a',record.keywords[c])]);
			keywords_content += new_content;

			//MARC
			if (head !== null) {
				var new_directory = createDirectory('653',new_content,head);
				head += getByteLength(new_content);
				keywords_directory += new_directory;
			}
		}
	}

	//MARC
	if (head !== null) {
		return [keywords_directory,keywords_content,head];
	}
	//MARCXML
	else {
		return keywords_content;
	}
}

function fillAdditionalAuthors(record,head,fieldFunc,subfieldFunc) {
	if (checkExists(record.additional_authors)) {
		var authors = '';
		var authors_directory = '';
		var translit_counter = 4;
		var role_index = { 'art': 'artist', 'aut': 'author', 'ctb': 'contributor', 'edt': 'editor', 'ill': 'illustrator', 'trl': 'translator'}

		for (var i = 0; i < record.additional_authors.length; i++) {
			if (checkExists(record.additional_authors[i][0]['family']) || checkExists(record.additional_authors[i][0]['given'])) {
				var latin_index = checkExists(record.additional_authors[i][1]['family']) || checkExists(record.additional_authors[i][1]['given']) ? 1 : 0;

				if (checkExists(record.additional_authors[i][latin_index]['family']) && checkExists(record.additional_authors[i][latin_index]['given'])) {
					var authors_content = record.additional_authors[i][latin_index]['family'] + ', ' + record.additional_authors[i][latin_index]['given'] + ',';
				}
				else if (checkExists(record.additional_authors[i][latin_index]['family']) || checkExists(record.additional_authors[i][latin_index]['given'])) {
					if (checkExists(record.additional_authors[i][latin_index]['family'])) {
						var authors_content = record.additional_authors[i][latin_index]['family'] + ',';
					}
					else {
						var authors_content = record.additional_authors[i][latin_index]['given'] + ',';
					}
				}

				var authors_subfield = [subfieldFunc('a',authors_content),subfieldFunc('e',role_index[record.additional_authors[i][0]['role']] + '.'),subfieldFunc('4',record.additional_authors[i][0]['role'])];
				if (latin_index === 1) {
					if (translit_counter < 10) {
						var translit_index = '0' + translit_counter;
					}
					else {
						var translit_index = translit_counter;
					}
					authors_subfield.push(subfieldFunc('6','880-' + translit_index));
					translit_counter++;
				}
				var new_content = fieldFunc('700','1',' ',authors_subfield);
				authors += new_content;

				//MARC
				if (head !== null) {
					var new_directory = createDirectory('700',new_content,head);
					head += getByteLength(new_content);
					authors_directory += new_directory;
				}
			}
		}

		//MARC
		if (head !== null) {
			return [authors_directory,authors,head];
		}
		//MARCXML
		else {
			return authors;
		}
	}
	else {
		return head !== null ? ['','',head] : '';
	}
}

function fillTranslitTitle(record,head,fieldFunc,subfieldFunc) {
	//author_array[0] contains the contents of the first author field
	var title_ind1 = checkExists(record.author[0]['family']) || checkExists(record.author[0]['given']) ? '1' : '0';

	if (checkExists(record.title[1]['title'])) {
		var translit_subfields = [];
		if (checkExists(record.title[1]['subtitle'])) {
			translit_subfields.push(subfieldFunc('6','245-01'),subfieldFunc('a',record.title[0]['title'] + ' :'),subfieldFunc('b',record.title[0]['subtitle'] + '.'));
		}
		else {
			translit_subfields.push(subfieldFunc('6','245-01'),subfieldFunc('a',record.title[0]['title'] + '.'));
		}
		var title880 = fieldFunc('880',title_ind1,'0',translit_subfields);

		//MARC
		if (head !== null) {
			var title880_directory = createDirectory('880',title880,head);
			return [title880_directory,title880];
		}
		//MARCXML
		else {
			return title880;
		}
	}
	else {
		return head !== null ? ['',''] : '';
	}
}

function fillTranslitPublisher(record,head,fieldFunc,subfieldFunc) {
	if (checkExists(record.translit_publisher) || checkExists(record.translit_place)) {
		var translit_content = [subfieldFunc('6','264-02')];

		if (checkExists(record.translit_place)) {
			translit_content.push(subfieldFunc('a',record.publication_place + ' :'));
		}

		if (checkExists(record.translit_publisher)) {
			translit_content.push(subfieldFunc('b',record.publisher + ','));
		}

		var publisher880 = fieldFunc('880',' ','1',translit_content);

		//MARC
		if (head !== null) {
			var publisher880_directory = createDirectory('880',publisher880,head);
			return [publisher880_directory,publisher880];
		}
		//MARCXML
		else {
			return publisher880;
		}
	}
	else {
		return head !== null ? ['',''] : '';
	}
}

function fillTranslitAuthor(record,head,fieldFunc,subfieldFunc) {
	//Check if either transliteration field has content
	if (checkExists(record.author[1]['family']) || checkExists(record.author[1]['given'])) {
		var translit_content = [subfieldFunc('6','100-03')];

		if (checkExists(record.author[0]['family']) && checkExists(record.author[0]['given'])) {
			translit_content.push(subfieldFunc('a',record.author[0]['family'] + ', ' + record.author[0]['given'] + '.'));
		}
		else {
			if (checkExists(record.author[0]['family'])) {
				translit_content.push(subfieldFunc('a',record.author[0]['family'] + '.'));
			}
			else {
				translit_content.push(subfieldFunc('a',record.author[0]['given'] + '.'));
			}
		}

		var author880 = fieldFunc('880','1',' ',translit_content);

		//MARC
		if (head !== null) {
			var author880_directory = createDirectory('880',author880,head);
			return [author880_directory,author880];
		}
		//MARCXML
		else {
			return author880;
		}
	}
	else {
		return head !== null ? ['',''] : '';
	}
}

function fillTranslitAdditionalAuthors(record,head,fieldFunc,subfieldFunc) {
	if (checkExists(record.additional_authors)) {
		var authors880 = '';
		var authors880_directory = '';
		var translit_counter = 4;

		for (var i = 0; i < record.additional_authors.length; i++) {
			if ((checkExists(record.additional_authors[i][1]['family']) || checkExists(record.additional_authors[i][1]['given'])) && (checkExists(record.additional_authors[i][0]['family']) || checkExists(record.additional_authors[i][0]['given']))) {
				if (checkExists(record.additional_authors[i][0]['family']) && checkExists(record.additional_authors[i][0]['given'])) {
					var authors_content = record.additional_authors[i][0]['family'] + ', ' + record.additional_authors[i][0]['given'] + '.'
				}
				else {
					if (checkExists(record.additional_authors[i][0]['family'])) {
						var authors_content = record.additional_authors[i][0]['family'] + '.';
					}
					else {
						var authors_content = record.additional_authors[i][0]['given'] + '.';
					}
				}

				if (translit_counter < 10) {
					var translit_index = '0' + translit_counter;
				}
				else {
					var translit_index = translit_counter;
				}
				translit_counter++;

				var new_content = fieldFunc('880',' ','1',[subfieldFunc('6','700-' + translit_index),subfieldFunc('a',authors_content)]);
				authors880 += new_content;

				//MARC
				if (head !== null) {
					var new_directory = createDirectory('880',new_content,head);
					head += getByteLength(new_content);
					authors880_directory += new_directory;
				}
			}
		}

		//MARC
		if (head !== null) {
			return [authors880_directory,authors880,head];
		}
		//MARCXML
		else {
			return authors880;
		}
	}
	else {
		return head !== null ? ['','',head] : '';
	}
}

function downloadMARC(record,institution_info) {
	var head = 0;

	var timestamp_content = String.fromCharCode(30) + getTimestamp();
	var timestamp_directory = createDirectory('005',timestamp_content,head);
	head += timestamp_content.length; 

	var controlfield008_content = String.fromCharCode(30) + create008Field(record);
	var controlfield008_directory = createDirectory('008',controlfield008_content,head);
	head += controlfield008_content.length;

	var isbn = fillISBN(record,head,createContentFill,createSubfield);
	head += isbn[1].length;

	var default1_content = createContent('  ',[createSubfield('a',institution_info['marc']),createSubfield('b','eng'),createSubfield('e','rda'),createSubfield('c',institution_info['marc'])]);
	var default1_directory = createDirectory('040',default1_content,head);
	head += default1_content.length;

	var author = fillAuthor(record,head,createContentFill,createSubfield);
	head += getByteLength(author[1]);

	var title = fillTitle(record,head,createContentFill,createSubfield);
	head += getByteLength(title[1]);

	var edition = fillEdition(record,head,createContentFill,createSubfield);
	head += getByteLength(edition[1]);

	var pub = fillPublication(record,head,createContentFill,createSubfield);
	head += getByteLength(pub[1]);

	var copyright = fillCopyright(record,head,createContentFill,createSubfield);
	head += getByteLength(copyright[1]);

	var physical = fillPhysical(record,head,createContentFill,createSubfield);
	head += getByteLength(physical[1]);

	var default2_content = createContent('  ',[createSubfield('a','text'),createSubfield('b','txt'),createSubfield('2','rdacontent')]);
	var default2_directory = createDirectory('336',default2_content,head);
	head += default2_content.length;

	var default3_content = createContent('  ',[createSubfield('a','unmediated'),createSubfield('b','n'),createSubfield('2','rdamedia')]);
	var default3_directory = createDirectory('337',default3_content,head);
	head += default3_content.length;

	var default4_content = createContent('  ',[createSubfield('a','volume'),createSubfield('b','nc'),createSubfield('2','rdacarrier')]);
	var default4_directory = createDirectory('338',default4_content,head);
	head += default4_content.length;

	var notes = fillNotes(record,head,createContentFill,createSubfield);
	head += getByteLength(notes[1]);

	var keywords = fillKeywords(record,head,createContentFill,createSubfield);
	head = keywords[2];

	var additional_authors = fillAdditionalAuthors(record,head,createContentFill,createSubfield);
	head = additional_authors[2];

	var title880 = fillTranslitTitle(record,head,createContentFill,createSubfield);
	head += getByteLength(title880[1]);

	var publisher880 = fillTranslitPublisher(record,head,createContentFill,createSubfield);
	head += getByteLength(publisher880[1]);

	var author880 = fillTranslitAuthor(record,head,createContentFill,createSubfield);
	head += getByteLength(author880[1]);

	var authors880 = fillTranslitAdditionalAuthors(record,head,createContentFill,createSubfield);
	head = authors880[2];

	var end = String.fromCharCode(30) + String.fromCharCode(29);
	var text = timestamp_directory + controlfield008_directory + isbn[0] + default1_directory + author[0] + title[0] + edition[0] + pub[0] + copyright[0] + physical[0] + default2_directory + default3_directory + default4_directory + notes[0] + keywords[0] + additional_authors[0] + title880[0] + publisher880[0] + author880[0] + authors880[0] + timestamp_content + controlfield008_content + isbn[1] + default1_content + author[1] + title[1] + edition[1] + pub[1] + copyright[1] + physical[1] + default2_content + default3_content + default4_content + notes[1] + keywords[1] + additional_authors[1] + title880[1] + publisher880[1] + author880[1] + authors880[1] + end;
	var leader_len = getByteLength(text) + 24;
	var directory_len = 25 + timestamp_directory.length + controlfield008_directory.length + isbn[0].length + default1_directory.length + author[0].length + title[0].length + edition[0].length + pub[0].length + copyright[0].length + physical[0].length + default2_directory.length + default3_directory.length + default4_directory.length + notes[0].length + keywords[0].length + additional_authors[0].length + title880[0].length + publisher880[0].length + author880[0].length + authors880[0].length;
	var leader = addZeros(leader_len,'leader') + 'nam a22' + addZeros(directory_len,'leader') + 'ki 4500';
	text = leader + text;
	downloadFile(text,'mrc');
}

//Create the MARCXML document
function downloadXML(record,institution_info) {
	var startText = '<?xml version="1.0" encoding="utf-8"?>\n<record xmlns="http://www.loc.gov/MARC21/slim" xsi:schemaLocation="http://www.loc.gov/MARC21/slim http://www.loc.gov/standards/marcxml/schema/MARC21slim.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">\n  <leader>01447nam a2200397ki 4500</leader>\n  <controlfield tag="001"></controlfield>\n';
	
	var formatted_date = getTimestamp();
	var timestamp = '  <controlfield tag="005">' + formatted_date + '</controlfield>\n';
	
	var controlfield008 = create008Field(record);
	controlfield008 = '  <controlfield tag="008">' + controlfield008 + '</controlfield>\n'
	
	var default1 = createMARCXMLField('040',' ',' ',[createMARCXMLSubfield('a','UIU'),createMARCXMLSubfield('b','eng'),createMARCXMLSubfield('e','rda'),createMARCXMLSubfield('c','UIU')]);
	var isbn = fillISBN(record,null,createMARCXMLField,createMARCXMLSubfield);
	var author = fillAuthor(record,null,createMARCXMLField,createMARCXMLSubfield);
	var title = fillTitle(record,null,createMARCXMLField,createMARCXMLSubfield);
	var edition = fillEdition(record,null,createMARCXMLField,createMARCXMLSubfield);
	var publication = fillPublication(record,null,createMARCXMLField,createMARCXMLSubfield);
	var copyright = fillCopyright(record,null,createMARCXMLField,createMARCXMLSubfield);
	var physical = fillPhysical(record,null,createMARCXMLField,createMARCXMLSubfield);
	var default2 = createMARCXMLField('336',' ',' ',[createMARCXMLSubfield('a','text'),createMARCXMLSubfield('b','txt'),createMARCXMLSubfield('2','rdacontent')]) + createMARCXMLField('337',' ',' ',[createMARCXMLSubfield('a','unmediated'),createMARCXMLSubfield('b','n'),createMARCXMLSubfield('2','rdamedia')]) + createMARCXMLField('338',' ',' ',[createMARCXMLSubfield('a','volume'),createMARCXMLSubfield('b','nc'),createMARCXMLSubfield('2','rdacarrier')]);
	var notes = fillNotes(record,null,createMARCXMLField,createMARCXMLSubfield);
	var keywords = fillKeywords(record,null,createMARCXMLField,createMARCXMLSubfield);
	var additional_authors = fillAdditionalAuthors(record,null,createMARCXMLField,createMARCXMLSubfield);
	var title880 = fillTranslitTitle(record,null,createMARCXMLField,createMARCXMLSubfield);
	var publisher880 = fillTranslitPublisher(record,null,createMARCXMLField,createMARCXMLSubfield);
	var author880 = fillTranslitAuthor(record,null,createMARCXMLField,createMARCXMLSubfield);
	var authors880 = fillTranslitAdditionalAuthors(record,null,createMARCXMLField,createMARCXMLSubfield);
	var endText ='</record>\n';

	var text = startText + timestamp + controlfield008 + isbn + default1 + author + title + edition + publication + copyright + physical + default2 + notes + keywords + additional_authors + title880 + publisher880 + author880 + authors880 + endText;
	downloadFile(text,'xml');
}

function fillAuthorMODS(family,given,role) {
	var role_index = { 'art': 'artist', 'aut': 'author', 'ctb': 'contributor', 'edt': 'editor', 'ill': 'illustrator', 'trl': 'translator'};
	if (checkExists(given) || checkExists(family)) {
		var authorText = '    <name type="personal">\n';
		if (checkExists(family)) {
			authorText += '        <namePart type="family">' + family + '</namePart>\n';
		}

		if (checkExists(given)) {
			authorText += '        <namePart type="given">' + given + '</namePart>\n';
		}

		authorText += '        <role>\n            <roleTerm authority="marcrelator" type="text">' + role_index[role] + '</roleTerm>\n            <roleTerm authority="marcrelator" type="code">' + role + '</roleTerm>\n        </role>\n    </name>\n';
		return authorText;
	}
	else {
		return '';
	}
}

function downloadMODS(record,institution_info) {
	var literatureTypes = {
		'0': 'Not fiction (not further specified)',
		'1': 'Fiction (not further specified)',
		'd': 'Dramas',
		'e': 'Essays',
		'f': 'Novels',
		'h': 'Humor, satires, etc.',
		'i': 'Letters',
		'j': 'Short stories',
		'm': 'Mixed forms',
		'p': 'Poetry',
		's': 'Speeches',
		'u': 'Unknown',
		'|': 'No attempt to code'
	}

	var startText = '<?xml version="1.0" encoding="UTF-8"?>\n<mods:mods xmlns:mods="http://www.loc.gov/mods/v3"\n    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.loc.gov/mods/v3"\n    xmlns:xlink="http://www.w3.org/1999/xlink"\n    xsi:schemaLocation="http://www.loc.gov/mods/v3 http://www.loc.gov/standards/mods/v3/mods-3-5.xsd"\n    version="3.5">\n';

	var defaultText1 = '    <typeOfResource>text</typeOfResource>\n';

	if (checkExists(record.isbn)) {
		var isbnText = '    <identifier type="isbn">' + record.isbn + '</identifier>\n';
	}
	else {
		var isbnText = '';
	}

	var authorText = '';
	authorText += fillAuthorMODS(record.author[0]['family'],record.author[0]['given'],record.author[0]['role']);

	if (checkExists(record.additional_authors)) {
		for (var i = 0; i < record.additional_authors.length; i++) {
			authorText += fillAuthorMODS(record.additional_authors[i][0]['family'],record.additional_authors[i][0]['given'],record.additional_authors[i][0]['role']);
		}
	}

	var titleText = '    <titleInfo>\n        <title>' + record.title[0]['title'] + '</title>\n';
	if (checkExists(record.title[0]['subtitle'])) {
		titleText += '        <subTitle>' + record.title[0]['subtitle'] + '</subTitle>\n';
	}
	titleText += '    </titleInfo>\n';

	var originText = '';
	if (checkExists(record.publication_country) || checkExists(record.publication_place) || checkExists(record.publisher) || checkExists(record.publication_year) || checkExists(record.copyright_year) || checkExists(record.edition)) {
		originText += '    <originInfo>\n';

		if (checkExists(record.publication_country)) {
			originText += '        <place>\n            <placeTerm type="code" authority="marccountry">' + record.publication_country + '</placeTerm>\n        </place>\n';
		}

		if (checkExists(record.publication_place)) {
			originText += '        <place>\n            <placeTerm type="text">' + record.publication_place + '</placeTerm>\n        </place>\n';
		}

		if (checkExists(record.publisher)) {
			originText += '        <publisher>' + record.publisher + '</publisher>\n';
		}

		if (checkExists(record.publication_year)) {
			originText += '        <dateIssued>' + record.publication_year + '</dateIssued>\n';
		}

		if (checkExists(record.copyright_year)) {
			originText += '        <copyrightDate>' + record.copyright_year + '</copyrightDate>\n';
		}

		if (checkExists(record.edition)) {
			originText += '        <edition>' + record.edition + '</edition>\n';
		}

		originText += '    </originInfo>\n';
	}

	var languageText = '    <language>\n        <languageTerm authority="iso639-2b" type="code">' + record.language + '</languageTerm>\n    </language>\n';

	var pagesText = '    <physicalDescription>\n        <form authority="marcform">print</form>\n        <extent>' + record.pages + ' ' + record.volume_or_page + '</extent>\n    </physicalDescription>\n'

	var dimensionsText = '    <physicalDescription>\n        <form authority="marcform">print</form>\n        <extent>' + record.dimensions + ' cm</extent>\n    </physicalDescription>\n'

	var defaultText2 = '    <location>\n        <physicalLocation>' + institution_info['mods']['physicalLocation'] + '</physicalLocation>\n    </location>\n';

	var keywordsText = '';
	for (var c = 0; c < record.keywords.length; c++) {
		if (record.keywords[c] !== '') {
			keywordsText += '    <subject>\n        <topic>' + record.keywords[c] + '</topic>\n    </subject>\n'
		}
	}

	var literatureText = '';
	if (checkExists(record.literature_yes) && checkExists(record.literature_dropdown)) {
		literatureText += '    <genre authority="marcgt">' + literatureTypes[record.literature_dropdown] + '</genre>\n'
	}

	var timestamp = getTimestamp();
	var formatted_date = timestamp.substring(2,8);
	var defaultText3 = '    <recordInfo>\n        <descriptionStandard>rda</descriptionStandard>\n        <recordContentSource authority="marcorg">' + institution_info['mods']['recordContentSource'] + '</recordContentSource>\n        <recordCreationDate encoding="marc">' + formatted_date + '</recordCreationDate>\n    </recordInfo>\n'

	var endText = '</mods:mods>\n';
	var text = startText + titleText + authorText + defaultText1 + isbnText + originText + languageText + pagesText + dimensionsText + defaultText2 + keywordsText + literatureText + defaultText3 + endText;
	downloadFile(text,'mods');
}

//Get the name of the languae from the code
function getLanguage(code) {
	var langs = {
		"abk":"Abkhaz","ace":"Achinese","ach":"Acoli","ada":"Adangme","ady":"Adygei","aar":"Afar","afh":"Afrihili (Artificial language)","afr":"Afrikaans","afa":"Afroasiatic (Other)","ain":"Ainu","aka":"Akan","akk":"Akkadian","alb":"Albanian","ale":"Aleut","alg":"Algonquian (Other)","alt":"Altai","tut":"Altaic (Other)","amh":"Amharic","anp":"Angika","apa":"Apache languages","ara":"Arabic","arg":"Aragonese","arc":"Aramaic","arp":"Arapaho","arw":"Arawak","arm":"Armenian","rup":"Aromanian","art":"Artificial (Other)","asm":"Assamese","ath":"Athapascan (Other)","aus":"Australian languages","map":"Austronesian (Other)","ava":"Avaric","ave":"Avestan","awa":"Awadhi","aym":"Aymara","aze":"Azerbaijani","ast":"Bable","ban":"Balinese","bat":"Baltic (Other)","bal":"Baluchi","bam":"Bambara","bai":"Bamileke languages","bad":"Banda languages","bnt":"Bantu (Other)","bas":"Basa","bak":"Bashkir","baq":"Basque","btk":"Batak","bej":"Beja","bel":"Belarusian","bem":"Bemba","ben":"Bengali","ber":"Berber (Other)","bho":"Bhojpuri","bih":"Bihari (Other)","bik":"Bikol","byn":"Bilin","bis":"Bislama","zbl":"Blissymbolics","bos":"Bosnian","bra":"Braj","bre":"Breton","bug":"Bugis","bul":"Bulgarian","bua":"Buriat","bur":"Burmese","cad":"Caddo","car":"Carib","cat":"Catalan","cau":"Caucasian (Other)","ceb":"Cebuano","cel":"Celtic (Other)","cai":"Central American Indian (Other)","chg":"Chagatai","cmc":"Chamic languages","cha":"Chamorro","che":"Chechen","chr":"Cherokee","chy":"Cheyenne","chb":"Chibcha","chi":"Chinese","chn":"Chinook jargon","chp":"Chipewyan","cho":"Choctaw","chu":"Church Slavic","chk":"Chuukese","chv":"Chuvash","cop":"Coptic","cor":"Cornish","cos":"Corsican","cre":"Cree","mus":"Creek","crp":"Creoles and Pidgins (Other)","cpe":"Creoles and Pidgins, English-based (Other)","cpf":"Creoles and Pidgins, French-based (Other)","cpp":"Creoles and Pidgins, Portuguese-based (Other)","crh":"Crimean Tatar","hrv":"Croatian","cus":"Cushitic (Other)","cze":"Czech","dak":"Dakota","dan":"Danish","dar":"Dargwa","day":"Dayak","del":"Delaware","din":"Dinka","div":"Divehi","doi":"Dogri","dgr":"Dogrib","dra":"Dravidian (Other)","dua":"Duala","dut":"Dutch","dum":"Dutch, Middle (ca. 1050-1350)","dyu":"Dyula","dzo":"Dzongkha","frs":"East Frisian","bin":"Edo","efi":"Efik","egy":"Egyptian","eka":"Ekajuk","elx":"Elamite","eng":"English","enm":"English, Middle (1100-1500)","ang":"English, Old (ca. 450-1100)","myv":"Erzya","epo":"Esperanto","est":"Estonian","gez":"Ethiopic","ewe":"Ewe","ewo":"Ewondo","fan":"Fang","fat":"Fanti","fao":"Faroese","fij":"Fijian","fil":"Filipino","fin":"Finnish","fiu":"Finno-Ugrian (Other)","fon":"Fon","fre":"French","frm":"French, Middle (ca. 1300-1600)","fro":"French, Old (ca. 842-1300)","fry":"Frisian","fur":"Friulian","ful":"Fula","gaa":"Gã","glg":"Galician","lug":"Ganda","gay":"Gayo","gba":"Gbaya","geo":"Georgian","ger":"German","gmh":"German, Middle High (ca. 1050-1500)","goh":"German, Old High (ca. 750-1050)","gem":"Germanic (Other)","gil":"Gilbertese","gon":"Gondi","gor":"Gorontalo","got":"Gothic","grb":"Grebo","grc":"Greek, Ancient (to 1453)","gre":"Greek, Modern (1453-)","grn":"Guarani","guj":"Gujarati","gwi":"Gwich'in","hai":"Haida","hat":"Haitian French Creole","hau":"Hausa","haw":"Hawaiian","heb":"Hebrew","her":"Herero","hil":"Hiligaynon","hin":"Hindi","hmo":"Hiri Motu","hit":"Hittite","hmn":"Hmong","hun":"Hungarian","hup":"Hupa","iba":"Iban","ice":"Icelandic","ido":"Ido","ibo":"Igbo","ijo":"Ijo","ilo":"Iloko","smn":"Inari Sami","inc":"Indic (Other)","ine":"Indo-European (Other)","ind":"Indonesian","inh":"Ingush","ina":"Interlingua (International Auxiliary Language Association)","ile":"Interlingue","iku":"Inuktitut","ipk":"Inupiaq","ira":"Iranian (Other)","gle":"Irish","mga":"Irish, Middle (ca. 1100-1550)","sga":"Irish, Old (to 1100)","iro":"Iroquoian (Other)","ita":"Italian","jpn":"Japanese","jav":"Javanese","jrb":"Judeo-Arabic","jpr":"Judeo-Persian","kbd":"Kabardian","kab":"Kabyle","kac":"Kachin","kal":"Kalâtdlisut","kam":"Kamba","kan":"Kannada","kau":"Kanuri","kaa":"Kara-Kalpak","krc":"Karachay-Balkar","krl":"Karelian","kar":"Karen languages","kas":"Kashmiri","csb":"Kashubian","kaw":"Kawi","kaz":"Kazakh","kha":"Khasi","khm":"Khmer","khi":"Khoisan (Other)","kho":"Khotanese","kik":"Kikuyu","kmb":"Kimbundu","kin":"Kinyarwanda","tlh":"Klingon (Artificial language)","kom":"Komi","kon":"Kongo","kok":"Konkani","kut":"Kootenai","kor":"Korean","kos":"Kosraean","kpe":"Kpelle","kro":"Kru (Other)","kua":"Kuanyama","kum":"Kumyk","kur":"Kurdish","kru":"Kurukh","kir":"Kyrgyz","lad":"Ladino","lah":"Lahndā","lam":"Lamba (Zambia and Congo)","lao":"Lao","lat":"Latin","lav":"Latvian","lez":"Lezgian","lim":"Limburgish","lin":"Lingala","lit":"Lithuanian","jbo":"Lojban (Artificial language)","nds":"Low German","dsb":"Lower Sorbian","loz":"Lozi","lub":"Luba-Katanga","lua":"Luba-Lulua","lui":"Luiseño","smj":"Lule Sami","lun":"Lunda","luo":"Luo (Kenya and Tanzania)","lus":"Lushai","ltz":"Luxembourgish","mas":"Maasai","mac":"Macedonian","mad":"Madurese","mag":"Magahi","mai":"Maithili","mak":"Makasar","mlg":"Malagasy","may":"Malay","mal":"Malayalam","mlt":"Maltese","mnc":"Manchu","mdr":"Mandar","man":"Mandingo","mni":"Manipuri","mno":"Manobo languages","glv":"Manx","mao":"Maori","arn":"Mapuche","mar":"Marathi","chm":"Mari","mah":"Marshallese","mwr":"Marwari","myn":"Mayan languages","men":"Mende","mic":"Micmac","min":"Minangkabau","mwl":"Mirandese","mis":"Miscellaneous languages","moh":"Mohawk","mdf":"Moksha","mkh":"Mon-Khmer (Other)","lol":"Mongo-Nkundu","mon":"Mongolian","mos":"Mooré","mul":"Multiple languages","mun":"Munda (Other)","nqo":"N'Ko","nah":"Nahuatl","nau":"Nauru","nav":"Navajo","nbl":"Ndebele (South Africa)","nde":"Ndebele (Zimbabwe)","ndo":"Ndonga","nap":"Neapolitan Italian","nep":"Nepali","new":"Newari","nwc":"Newari, Old","nia":"Nias","nic":"Niger-Kordofanian (Other)","ssa":"Nilo-Saharan (Other)","niu":"Niuean","zxx":"No linguistic content","nog":"Nogai","nai":"North American Indian (Other)","frr":"North Frisian","sme":"Northern Sami","nso":"Northern Sotho","nor":"Norwegian","nob":"Norwegian (Bokmål)","nno":"Norwegian (Nynorsk)","nub":"Nubian languages","nym":"Nyamwezi","nya":"Nyanja","nyn":"Nyankole","nyo":"Nyoro","nzi":"Nzima","oci":"Occitan (post-1500)","xal":"Oirat","oji":"Ojibwa","non":"Old Norse","peo":"Old Persian (ca. 600-400 B.C.)","ori":"Oriya","orm":"Oromo","osa":"Osage","oss":"Ossetic","oto":"Otomian languages","pal":"Pahlavi","pau":"Palauan","pli":"Pali","pam":"Pampanga","pag":"Pangasinan","pan":"Panjabi","pap":"Papiamento","paa":"Papuan (Other)","per":"Persian","phi":"Philippine (Other)","phn":"Phoenician","pon":"Pohnpeian","pol":"Polish","por":"Portuguese","pra":"Prakrit languages","pro":"Provençal (to 1500)","pus":"Pushto","que":"Quechua","roh":"Raeto-Romance","raj":"Rajasthani","rap":"Rapanui","rar":"Rarotongan","roa":"Romance (Other)","rom":"Romani","rum":"Romanian","run":"Rundi","rus":"Russian","sal":"Salishan languages","sam":"Samaritan Aramaic","smi":"Sami","smo":"Samoan","sad":"Sandawe","sag":"Sango (Ubangi Creole)","san":"Sanskrit","sat":"Santali","srd":"Sardinian","sas":"Sasak","sco":"Scots","gla":"Scottish Gaelic","sel":"Selkup","sem":"Semitic (Other)","srp":"Serbian","srr":"Serer","shn":"Shan","sna":"Shona","iii":"Sichuan Yi","scn":"Sicilian Italian","sid":"Sidamo","sgn":"Sign languages","bla":"Siksika","snd":"Sindhi","sin":"Sinhalese","sit":"Sino-Tibetan (Other)","sio":"Siouan (Other)","sms":"Skolt Sami","den":"Slavey","sla":"Slavic (Other)","slo":"Slovak","slv":"Slovenian","sog":"Sogdian","som":"Somali","son":"Songhai","snk":"Soninke","wen":"Sorbian (Other)","sot":"Sotho","sai":"South American Indian (Other)","sma":"Southern Sami","spa":"Spanish","srn":"Sranan","suk":"Sukuma","sux":"Sumerian","sun":"Sundanese","sus":"Susu","swa":"Swahili","ssw":"Swazi","swe":"Swedish","gsw":"Swiss German","syc":"Syriac","syr":"Syriac, Modern","tgl":"Tagalog","tah":"Tahitian","tai":"Tai (Other)","tgk":"Tajik","tmh":"Tamashek","tam":"Tamil","tat":"Tatar","tel":"Telugu","tem":"Temne","ter":"Terena","tet":"Tetum","tha":"Thai","tib":"Tibetan","tig":"Tigré","tir":"Tigrinya","tiv":"Tiv","tli":"Tlingit","tpi":"Tok Pisin","tkl":"Tokelauan","tog":"Tonga (Nyasa)","ton":"Tongan","tsi":"Tsimshian","tso":"Tsonga","tsn":"Tswana","tum":"Tumbuka","tup":"Tupi languages","tur":"Turkish","ota":"Turkish, Ottoman","tuk":"Turkmen","tvl":"Tuvaluan","tyv":"Tuvinian","twi":"Twi","udm":"Udmurt","uga":"Ugaritic","uig":"Uighur","ukr":"Ukrainian","umb":"Umbundu","und":"Undetermined","hsb":"Upper Sorbian","urd":"Urdu","uzb":"Uzbek","vai":"Vai","ven":"Venda","vie":"Vietnamese","vol":"Volapük","vot":"Votic","wak":"Wakashan languages","wln":"Walloon","war":"Waray","was":"Washoe","wel":"Welsh","him":"Western Pahari languages","wal":"Wolayta","wol":"Wolof","xho":"Xhosa","sah":"Yakut","yao":"Yao (Africa)","yap":"Yapese","yid":"Yiddish","yor":"Yoruba","ypk":"Yupik languages","znd":"Zande languages","zap":"Zapotec","zza":"Zaza","zen":"Zenaga","zha":"Zhuang","zul":"Zulu","zun":"Zuni"
	}
	return langs[code];
}

function buildTag(prop,content,meta,label) {
	if (meta) {
		return '\t\t<meta itemprop="' + prop + '" content="' + content + '"/>\n';
	}
	else {
		return '\t\t\t<dt>' + label + ':</dt>\n\t\t\t<dd itemprop="' + prop + '"><b>' + content + '</b></dd>\n';
	}
}

function buildSpan(prop,content) {
	return '<span itemprop="' + prop + '">' + content + '</span>';
}

function fillAuthorHTML(family,given,role) {
	var role_index = { 'art': 'contributor', 'aut': 'author', 'ctb': 'contributor', 'edt': 'editor', 'ill': 'contributor', 'trl': 'contributor'};
	if (checkExists(family) && checkExists(given)) {
		return buildTag(role_index[role],family + ', ' + given,false,role_index[role].charAt(0).toUpperCase() + role_index[role].slice(1));
	}
	else if (checkExists(family) || checkExists(given)) {
		if (checkExists(family)) {
			return buildTag(role_index[role],family,false,role_index[role].charAt(0).toUpperCase() + role_index[role].slice(1));
		}
		else {
			return buildTag(role_index[role],given,false,role_index[role].charAt(0).toUpperCase() + role_index[role].slice(1));
		}
	}
	else {
		return '';
	}
}

function downloadHTML(record,institution_info) {
	var metaTags = '';
	var displayTags = '';

	metaTags += buildTag('inLanguage',record.language,true,'');

	var subtitleTag = '';
	if (checkExists(record.title[0]['subtitle'])) {
		subtitleTag = ': ' + record.title[0]['subtitle'];
	}

	displayTags += buildTag('name',record.title[0]['title'] + subtitleTag,false,'Title');

	var translitSubTag = '';
	if (checkExists(record.title[1]['subtitle'])) {
		translitSubTag = ': ' + record.title[1]['subtitle'] + '.';
	}

	if (checkExists(record.title[1]['title'])) {
		displayTags += buildTag('alternateName',record.title[1]['title'] + translitSubTag,false,'Transliterated Title');
	}

	if (checkExists(record.isbn)) {
		displayTags += buildTag('isbn',record.isbn,false,'ISBN');
	}

	displayTags += fillAuthorHTML(record.author[0]['family'],record.author[0]['given'],record.author[0]['role']);

	if (checkExists(record.additional_authors)) {
		for (var i = 0; i < record.additional_authors.length; i++) {
			displayTags += fillAuthorHTML(record.additional_authors[i][0]['family'],record.additional_authors[i][0]['given'],record.additional_authors[i][0]['role']);
		}
	}

	if (checkExists(record.edition)) {
		displayTags += buildTag('bookEdition',record.edition,false,'Edition Statement');
	}

	if (checkExists(record.publisher)) {
		displayTags += buildTag('publisher',record.publisher,false,'Publisher');
	}

	if (checkExists(record.publication_year)) {
		displayTags += buildTag('datePublished',record.publication_year,false,'Date of Publication');
	}

	if (checkExists(record.copyright_year)) {
		displayTags += buildTag('copyrightYear',record.copyright_year,false,'Date of Copyright');
	}

	var ill = '';
	if (checkExists(record.illustrations_yes)) {
		ill = '; illustrations';
	}

	displayTags += '\t\t\t<dt>Physical Description:</dt>\n\t\t\t<dd><b>' + buildSpan('numberOfPages',record.pages) + ' ' + record.volume_or_page + ill + '</b></dd>\n';

	displayTags += '\t\t\t<dt>Language:</dt>\n\t\t\t<dd><b>' + getLanguage(record.language) + '</b></dd>\n';

	var keywordsTag = record.keywords[0];
	var keywordsList = '\t\t\t<dt>Keywords:</dt>\n\t\t\t<dd><b>\n\t\t\t\t<ul>\n\t\t\t\t\t<li>' + buildSpan('keywords',record.keywords[0]) + '</li>\n';
	for (var c = 1; c < record.keywords.length; c++) {
		if (record.keywords[c] !== '') {
			keywordsTag += ', ' + record.keywords[c];
			keywordsList += '\t\t\t\t\t<li itemprop="keywords">' + record.keywords[c] + '</li>\n';
		}
	}
	keywordsList += '\t\t\t\t</ul>\n\t\t\t</b></dd>\n';
	displayTags += keywordsList;

	displayTags += '\t\t\t<div itemprop="offers" itemscope itemtype="Offer">\n\t\t\t\t<dt>Offer:</dt>\n\t\t\t\t<dd><b><span itemprop="seller" href="' + institution_info['html']['url'] + '">' + institution_info['html']['name'] + '</span></b></dd>\n\t\t\t</div>\n'; 

	var text = '<!DOCTYPE html>\n<html>\n<head>\n	<meta charset="utf-8">\n</head>\n\n<body>\n\t<div itemscope itemtype="http://schema.org/Book">\n' + metaTags + '\t\t<dl>\n' + displayTags + '\t\t</dl>\n\t</div>\n</body>\n</html>';
	downloadFile(text,'html');
}

//Edit the strings in this function to attribute records to another institution
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

	return output;
}

//Author is the default role for 100, but if it isn't in the list then Artist can be used
function find100(list) {
	for (counter = 0; counter < list.length; counter++) {
		if (list[counter][0]['role'] == 'aut') {
			return list.splice(counter,1);
		}
	}

	for (counter = 0; counter < list.length; counter++) {
		if (list[counter][0]['role'] == 'art') {
			return list.splice(counter,1);
		}
	}

	return [[{'family':'','given':'','role':''},{'family':'','given':''}]];
}

$("#marc-maker").submit(function(event) {
	var words = [];
	for (var i = 0; i < counter; i++) {
		words[words.length] = $("#keyword" + i).val();
	};

	var additional_names = [];
	var translit_additional_names = [];
	var complete_names_list = [
		[
			{
				family: $("#family_name").val(),
				given: $("#given_name").val(),
				role: $("#role").val()
			},
			{
				family: $("#translit_family_name").val(),
				given: $("#translit_given_name").val()
			}
		]
	];
	for (var i = 0; i < aCounter; i++) {
		complete_names_list.push([{ "family": $("#family_name" + i).val(), "given": $("#given_name" + i).val(), "role": $("#role" + i).val()},{ "family": $("#translit_family_name" + i).val(), "given": $("#translit_given_name" + i).val()}]);
	}
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
		additional_authors: complete_names_list
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
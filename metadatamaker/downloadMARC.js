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
	var array_of_008 = [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '];

	var timestamp = getTimestamp();
	timestamp = timestamp.substring(2,8);

	//00-05
	for (var i = 0; i < 6; i++) {
		array_of_008[i] = timestamp[i];
	};

	//06-14
	if ((checkExists(record.publication_year) && checkExists(record.copyright_year))) {
		array_of_008[6] = 't';
		var year_one = record.publication_year;
		var year_two = record.copyright_year;
	}
	else if (checkExists(record.publication_year)) {
		array_of_008[6] = 's';
		var year_one = record.publication_year;
		var year_two = '    ';
	}
	else if (checkExists(record.copyright_year)) {
		array_of_008[6] = 't';
		var year_one = record.copyright_year;
		var year_two = record.copyright_year;
	}
	else {
		array_of_008[6] = 'n';
		var year_one = 'uuuu';
		var year_two = 'uuuu';
	}

	for (var i = 7; i < 11; i++) {
		array_of_008[i] = year_one[i-7];
	}

	for (var i = 11; i < 15; i++) {
		array_of_008[i] = year_two[i-11];
	}

	//15-17
	if (checkExists(record.publication_country)) {
		for (var i = 15; i < 15+record.publication_country.length; i++) {
			array_of_008[i] = record.publication_country[i-15];
		}

	}
	else {
		array_of_008[15] = 'x'
		array_of_008[16] = 'x'
	}

	//18-21
	if (checkExists(record.illustrations_yes) && record.illustrations_yes == true) {
		array_of_008[18] = 'a'
	}

	//22-32
	array_of_008[29] = '0';
	array_of_008[30] = '0';
	array_of_008[31] = '0';

	//33
	if (checkExists(record.literature_yes) && checkExists(record.literature_dropdown)) {
		array_of_008[33] = record.literature_dropdown;
	}
	else {
		array_of_008[33] = '0';
	}

	//34-39
	for (var i = 35; i < 38; i++) {
		array_of_008[i] = record.language[i-35];
	}
	array_of_008[39] = 'd';
	var controlfield008 = '';
	for (var i = 0; i < 40; i++) {
		controlfield008 += array_of_008[i];
	}

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
	return '    <subfield code="' + code + '">' + escapeXML(content) + '</subfield>\n';
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

//Return the results based on which download function was called
function returnSingleEntry(tag,content,head) {
	//MARC
	if (head !== null) {
		var content_directory = createDirectory(tag,content,head);
		return [content_directory,content];
	}
	//MARCXML
	else {
		return content;
	}
}

//Return the results based on which download function was called
function returnMultipleEntries(directory,content,head) {
	//MARC
	if (head !== null) {
		return [directory,content,head];
	}
	//MARCXML
	else {
		return content;
	}
}

function fillISBN(record,head,fieldFunc,subfieldFunc) {
	var tag = '020';

	if (checkExists(record.isbn)) {
		var isbn = fieldFunc(tag,' ',' ',[subfieldFunc('a',record.isbn)]);

		return returnSingleEntry(tag,isbn,head);
	}
	else {
		return head !== null ? ['',''] : '';
	}
}

function fillAuthor(record,head,fieldFunc,subfieldFunc) {
	var tag = '100';

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
	var author = fieldFunc(tag,'1',' ',author_subfields);

	return returnSingleEntry(tag,author,head);
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
	var tag = '245';

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

	var title = fieldFunc(tag,title_ind1,title_ind2,title_subfields);

	return returnSingleEntry(tag,title,head);
}

function fillEdition(record,head,fieldFunc,subfieldFunc) {
	var tag = '250';

	if (checkExists(record.edition)) {
		var subfields = [];
		if (checkExists(record.translit_edition)) {
			if (record.translit_edition.substring(record.translit_edition.length-1,record.translit_edition.length) === '.') {
				record.translit_edition = record.translit_edition.substring(0,record.translit_edition.length-1);
			}
			subfields.push(subfieldFunc('a',record.translit_edition + '.'));
			subfields.push(subfieldFunc('6','880-04'));
		}
		else {
			if (record.edition.substring(record.edition.length-1,record.edition.length) === '.') {
				record.edition = record.edition.substring(0,record.edition.length-1);
			}
			subfields.push(subfieldFunc('a',record.edition + '.'));
		}
		var edition = fieldFunc(tag,' ',' ',subfields);

		return returnSingleEntry(tag,edition,head);
	}
	else {
		return head !== null ? ['',''] : '';
	}
}

function fillPublication(record,head,fieldFunc,subfieldFunc) {
	var tag = '264';

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

	var pub = fieldFunc(tag,' ','1',pub_subfields);

	return returnSingleEntry(tag,pub,head);
}

function fillCopyright(record,head,fieldFunc,subfieldFunc) {
	var tag = '264';

	if (checkExists(record.copyright_year)) {
		var copyright = fieldFunc(tag,' ','4',[subfieldFunc('c','\u00A9' + record.copyright_year)]);

		return returnSingleEntry(tag,copyright,head);
	}
	else {
		return head !== null ? ['',''] : '';
	}
}

function fillPhysical (record,head,fieldFunc,subfieldFunc) {
	var tag = '300';

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
	var physical = fieldFunc(tag,' ',' ',physical_subfields);

	return returnSingleEntry(tag,physical,head);
}

function fillNotes(record,head,fieldFunc,subfieldFunc) {
	var tag = '500';

	if (checkExists(record.notes)) {
		var notes = fieldFunc(tag,' ',' ',[subfieldFunc('a',record.notes)]);

		return returnSingleEntry(tag,notes,head);
	}
	else {
		return head !== null ? ['',''] : '';
	}
}

function fillKeywords(record,head,fieldFunc,subfieldFunc) {
	var tag = '653';

	var keywords_content = '';
	var keywords_directory = '';
	for (var c = 0; c < record.keywords.length; c++) {
		if (record.keywords[c] !== '') {
			var new_content = fieldFunc(tag,' ',' ',[subfieldFunc('a',record.keywords[c])]);
			keywords_content += new_content;

			//MARC
			if (head !== null) {
				var new_directory = createDirectory(tag,new_content,head);
				head += getByteLength(new_content);
				keywords_directory += new_directory;
			}
		}
	}

	return returnMultipleEntries(keywords_directory,keywords_content,head);
}

function handleSpecialFAST(full_string,check,separating_character,second_field,FAST_subfield,subfieldFunc) {
	var separator = full_string.lastIndexOf(separating_character);
	if (separator != check) {
		separator++;
		if (separating_character == '/') {
			var first = full_string.substring(0,separator-1);
		}
		else {
			var first = full_string.substring(0,separator);
		}
		var second = full_string.substring(separator).trim();
		FAST_subfield.push(subfieldFunc('a',first));
		FAST_subfield.push(subfieldFunc(second_field,second));
	}
	else {
		FAST_subfield.push(subfieldFunc('a',full_string));
	}
}

function fillFAST(record,head,fieldFunc,subfieldFunc) {
	if (checkExists(record.fast)) {
		var FAST = '';
		var FAST_directory = '';
		for (var i = 0; i < record.fast.length; i++) {
			var contentType = record.fast[i][2].substring(1);
			var FAST_subfield = [];
			if (contentType == '00') {
				handleSpecialFAST(record.fast[i][0],record.fast[i][0].indexOf(','),',','d',FAST_subfield,subfieldFunc);
			}
			else if (contentType == '30') {
				handleSpecialFAST(record.fast[i][0],-1,'.','p',FAST_subfield,subfieldFunc);
			}
			else if (contentType == '51') {
				handleSpecialFAST(record.fast[i][0],-1,'/','z',FAST_subfield,subfieldFunc);
			}
			else {
				FAST_subfield.push(subfieldFunc('a',record.fast[i][0]));
			}

			FAST_subfield.push(subfieldFunc('2','fast'));
			FAST_subfield.push(subfieldFunc('0','(OCoLC)' + record.fast[i][1]));

			var new_content = fieldFunc('6' + contentType,record.fast[i][3],'7',FAST_subfield);
			FAST += new_content;

			//MARC
			if (head !== null) {
				var new_directory = createDirectory('6' + contentType,new_content,head);
				head += getByteLength(new_content);
				FAST_directory += new_directory;
			}
		}

		return returnMultipleEntries(FAST_directory,FAST,head);
	}
	else {
		return head !== null ? ['','',head] : '';
	}
}

function fillAdditionalAuthors(record,head,fieldFunc,subfieldFunc) {
	var tag = '700';

	if (checkExists(record.additional_authors)) {
		var authors = '';
		var authors_directory = '';
		var translit_counter = 5;
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
				var new_content = fieldFunc(tag,'1',' ',authors_subfield);
				authors += new_content;

				//MARC
				if (head !== null) {
					var new_directory = createDirectory(tag,new_content,head);
					head += getByteLength(new_content);
					authors_directory += new_directory;
				}
			}
		}

		return returnMultipleEntries(authors_directory,authors,head);
	}
	else {
		return head !== null ? ['','',head] : '';
	}
}

function fillTranslitTitle(record,head,fieldFunc,subfieldFunc) {
	var tag = '880';

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
		var title880 = fieldFunc(tag,title_ind1,'0',translit_subfields);

		return returnSingleEntry(tag,title880,head);
	}
	else {
		return head !== null ? ['',''] : '';
	}
}

function fillTranslitEdition(record,head,fieldFunc,subfieldFunc) {
	var tag = '880';

	if (checkExists(record.translit_edition)) {
		var translit_content = [subfieldFunc('6','250-04'),subfieldFunc('a',record.edition + '.')];
		var edition880 = fieldFunc(tag,' ',' ',translit_content);

		return returnSingleEntry(tag,edition880,head);
	}
	else {
		return head !== null ? ['',''] : '';
	}
}

function fillTranslitPublisher(record,head,fieldFunc,subfieldFunc) {
	var tag = '880';

	if (checkExists(record.translit_publisher) || checkExists(record.translit_place)) {
		var translit_content = [subfieldFunc('6','264-02')];

		if (checkExists(record.translit_place)) {
			translit_content.push(subfieldFunc('a',record.publication_place + ' :'));
		}

		if (checkExists(record.translit_publisher)) {
			translit_content.push(subfieldFunc('b',record.publisher + ','));
		}

		if (checkExists(record.publication_year)) {
			translit_content.push(subfieldFunc('c',record.publication_year + '.'));
		}
		else if (checkExists(record.copyright_year)) {
			translit_content.push(subfieldFunc('c','[' + record.copyright_year + ']'));
		}
		else {
			translit_content.push(subfieldFunc('c','[date of publication not identified]'));
		}

		console.log(translit_content);

		var publisher880 = fieldFunc(tag,' ','1',translit_content);

		return returnSingleEntry(tag,publisher880,head);
	}
	else {
		return head !== null ? ['',''] : '';
	}
}

function fillTranslitAuthor(record,head,fieldFunc,subfieldFunc) {
	var tag = '880';

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

		var author880 = fieldFunc(tag,'1',' ',translit_content);

		return returnSingleEntry(tag,author880,head);
	}
	else {
		return head !== null ? ['',''] : '';
	}
}

function fillTranslitAdditionalAuthors(record,head,fieldFunc,subfieldFunc) {
	var tag = '880';

	if (checkExists(record.additional_authors)) {
		var authors880 = '';
		var authors880_directory = '';
		var translit_counter = 5;

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

				var new_content = fieldFunc(tag,'1',' ',[subfieldFunc('6','700-' + translit_index),subfieldFunc('a',authors_content)]);
				authors880 += new_content;

				//MARC
				if (head !== null) {
					var new_directory = createDirectory(tag,new_content,head);
					head += getByteLength(new_content);
					authors880_directory += new_directory;
				}
			}
		}

		return returnMultipleEntries(authors880_directory,authors880,head);
	}
	else {
		return head !== null ? ['','',head] : '';
	}
}

/*
 * Create a MARC record. The variable head is a running total of the length of the record so far. The directory/variable[0]
 * variables number the field, point to the content, and list how long the content is. The content/variable[1] variables
 * are simply the content of that field. Order is very important here.
 *	record: Library with all the information input by the user
 *	institution_info: Library containing multiple forms of the name of the cataloguing instutition. Defaults to 
 *		University of Illinois at Urbana-Champaign
 */
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

	var fast = fillFAST(record,head,createContentFill,createSubfield);
	head = fast[2];

	var additional_authors = fillAdditionalAuthors(record,head,createContentFill,createSubfield);
	head = additional_authors[2];

	var title880 = fillTranslitTitle(record,head,createContentFill,createSubfield);
	head += getByteLength(title880[1]);

	var edition880 = fillTranslitEdition(record,head,createContentFill,createSubfield);
	head += getByteLength(edition880[1]);

	var publisher880 = fillTranslitPublisher(record,head,createContentFill,createSubfield);
	head += getByteLength(publisher880[1]);

	var author880 = fillTranslitAuthor(record,head,createContentFill,createSubfield);
	head += getByteLength(author880[1]);

	var authors880 = fillTranslitAdditionalAuthors(record,head,createContentFill,createSubfield);
	head = authors880[2];

	var end = String.fromCharCode(30) + String.fromCharCode(29);
	var text = timestamp_directory + controlfield008_directory + isbn[0] + default1_directory + author[0] + title[0] + edition[0] + pub[0] + copyright[0] + physical[0] + default2_directory + default3_directory + default4_directory + notes[0] + keywords[0] + fast[0] + additional_authors[0] + title880[0] + edition880[0] + publisher880[0] + author880[0] + authors880[0] + timestamp_content + controlfield008_content + isbn[1] + default1_content + author[1] + title[1] + edition[1] + pub[1] + copyright[1] + physical[1] + default2_content + default3_content + default4_content + notes[1] + keywords[1] + fast[1] + additional_authors[1] + title880[1] + edition880[1] + publisher880[1] + author880[1] + authors880[1] + end;
	var leader_len = getByteLength(text) + 24;
	var directory_len = 25 + timestamp_directory.length + controlfield008_directory.length + isbn[0].length + default1_directory.length + author[0].length + title[0].length + edition[0].length + pub[0].length + copyright[0].length + physical[0].length + default2_directory.length + default3_directory.length + default4_directory.length + notes[0].length + keywords[0].length + fast[0].length + additional_authors[0].length + title880[0].length + edition880[0].length + publisher880[0].length + author880[0].length + authors880[0].length;
	var leader = addZeros(leader_len,'leader') + 'nam a22' + addZeros(directory_len,'leader') + 'ki 4500';
	text = leader + text;
	downloadFile(text,'mrc');
}

/*
 * Create the MARCXML document
 *	record: Library with all the information input by the user
 *	institution_info: Library containing multiple forms of the name of the cataloguing instutition. Defaults to 
 *		University of Illinois at Urbana-Champaign
 */
function downloadXML(record,institution_info) {
	var text = '<?xml version="1.0" encoding="utf-8"?>\n<record xmlns="http://www.loc.gov/MARC21/slim" xsi:schemaLocation="http://www.loc.gov/MARC21/slim http://www.loc.gov/standards/marcxml/schema/MARC21slim.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">\n  <leader>01447nam a2200397ki 4500</leader>\n';
	
	var formatted_date = getTimestamp();
	text += '  <controlfield tag="005">' + formatted_date + '</controlfield>\n';
	
	var controlfield008 = create008Field(record);
	text += '  <controlfield tag="008">' + controlfield008 + '</controlfield>\n'
	
	text += createMARCXMLField('040',' ',' ',[createMARCXMLSubfield('a',institution_info['marc']),createMARCXMLSubfield('b','eng'),createMARCXMLSubfield('e','rda'),createMARCXMLSubfield('c',institution_info['marc'])]);
	text += fillISBN(record,null,createMARCXMLField,createMARCXMLSubfield);
	text += fillAuthor(record,null,createMARCXMLField,createMARCXMLSubfield);
	text += fillTitle(record,null,createMARCXMLField,createMARCXMLSubfield);
	text += fillEdition(record,null,createMARCXMLField,createMARCXMLSubfield);
	text += fillPublication(record,null,createMARCXMLField,createMARCXMLSubfield);
	text += fillCopyright(record,null,createMARCXMLField,createMARCXMLSubfield);
	text += fillPhysical(record,null,createMARCXMLField,createMARCXMLSubfield);
	text += createMARCXMLField('336',' ',' ',[createMARCXMLSubfield('a','text'),createMARCXMLSubfield('b','txt'),createMARCXMLSubfield('2','rdacontent')]) + createMARCXMLField('337',' ',' ',[createMARCXMLSubfield('a','unmediated'),createMARCXMLSubfield('b','n'),createMARCXMLSubfield('2','rdamedia')]) + createMARCXMLField('338',' ',' ',[createMARCXMLSubfield('a','volume'),createMARCXMLSubfield('b','nc'),createMARCXMLSubfield('2','rdacarrier')]);
	text += fillNotes(record,null,createMARCXMLField,createMARCXMLSubfield);
	text += fillKeywords(record,null,createMARCXMLField,createMARCXMLSubfield);
	text += fillFAST(record,null,createMARCXMLField,createMARCXMLSubfield);
	text += fillAdditionalAuthors(record,null,createMARCXMLField,createMARCXMLSubfield);
	text += fillTranslitTitle(record,null,createMARCXMLField,createMARCXMLSubfield);
	text += fillTranslitEdition(record,null,createMARCXMLField,createMARCXMLSubfield);
	text += fillTranslitPublisher(record,null,createMARCXMLField,createMARCXMLSubfield);
	text += fillTranslitAuthor(record,null,createMARCXMLField,createMARCXMLSubfield);
	text += fillTranslitAdditionalAuthors(record,null,createMARCXMLField,createMARCXMLSubfield);
	text +='</record>\n';

	downloadFile(text,'xml');
}

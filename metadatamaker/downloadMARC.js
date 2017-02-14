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

function create006Field(record) {
	var array_of_006 = [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '];

	array_of_006[0] = 's';

	if (checkExists(record.current_publication_frequency)) {
		array_of_006[1] = record.current_publication_frequency
	}
	
	array_of_006[2] = record.regularity;

	array_of_006[12] = '0'

	array_of_006[17] = '0'

	var controlfield006 = '';
	for (var i = 0; i < array_of_006.length; i++) {
		controlfield006 += array_of_006[i];
	}

	return controlfield006;
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

	//06
	if (checkExists(record.publication_status)) {
		array_of_008[6] = record.publication_status;
	}

	//07-10
	if (checkExists(record.starting_year)) {
		var year_one = record.starting_year;
		while (year_one.length < 4) {
			year_one += 'u'
		}
	}
	else {
		var year_one = 'uuuu';
	}

	//11-14
	if (checkExists(record.publication_status)) {
		if (record.publication_status == 'c') {
			var year_two = '9999';
		}
		else {
			if (checkExists(record.ending_year)) {
				var year_two = record.ending_year;
				while (year_two.length < 4) {
					year_two += 'u';
				}
			}
			else {
				var year_two = 'uuuu';
			}
		}
	}
	else {
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

	//18
	if (checkExists(record.current_publication_frequency)) {
		array_of_008[18] = record.current_publication_frequency
	}

	//19-20
	array_of_008[19] = record.regularity;

	//21
	if (checkExists(record.resource_type)) {
		array_of_008[21] = record.resource_type;
	}

	//22-28
	if (checkExists(record.government_publication_yes) && record.government_publication_yes == true) {
		array_of_008[28] = 'f';
	}


	//29-32
	array_of_008[29] = '0';
	array_of_008[30] = '0';
	array_of_008[31] = '0';

	//33-34
	array_of_008[34] = '0';

	//35-39
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

function fillISSN(record,head,fieldFunc,subfieldFunc) {
	var tag = '022';

	if (checkExists(record.issn)) {
		var issn = fieldFunc(tag,' ',' ',[subfieldFunc('a',record.issn)]);

		return returnSingleEntry(tag,issn,head);
	}
	else {
		return head !== null ? ['',''] : '';
	}
}

function fillCorporateAuthor(record,head,fieldFunc,subfieldFunc) {
	var tag = '110';

	var latin_index = checkExists(record.corporate_author[1]['corporate']) ? 1 : 0;
	var role_index = { 'cre': 'creator', 'ctb': 'contributor' };

	var author_content = '';
	if (!checkExists(record.corporate_author[0]['corporate'])) {
		return head !== null ? ['',''] : '';
	}

	var author_subfields = [subfieldFunc('a',record.corporate_author[latin_index]['corporate']),subfieldFunc('e','creator.'),subfieldFunc('4','cre')];
	if (latin_index === 1) {
		author_subfields.push(subfieldFunc('6','880-04'));
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
	var title_ind1 = '0';
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

function fillVaryingTitle(record,head,fieldFunc,subfieldFunc) {
	var tag = '246';

	if ((record.varying_title_type != '') && checkExists(record.varying_title)) {
		if (record.varying_title_type == 'other') {
			var var_title_ind1 = '1';
			var var_title_ind2 = '3';
		}
		else {
			var var_title_ind1 = '3';
			var var_title_ind2 = '1';
		}

		var varying_title = fieldFunc(tag,var_title_ind1,var_title_ind2,[subfieldFunc('a',record.varying_title)]);

		return returnSingleEntry(tag,varying_title,head);
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
		pub_subfields.push(subfieldFunc('c',record.publication_year + '-'));
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

function fillPhysical(record,head,fieldFunc,subfieldFunc) {
	var tag = '300';

	var physical_subfields = [];

	if (checkExists(record.publication_status)) {
		var pages_string = '';
		if (record.publication_status != 'current' && checkExists(record.volumes)) {
			pages_string += record.volumes + ' ';
		}

		pages_string += 'volumes';
	}

	physical_subfields.push(subfieldFunc('a',pages_string + ' ;'));

	physical_subfields.push(subfieldFunc('c',record.dimensions + ' cm'));
	var physical = fieldFunc(tag,' ',' ',physical_subfields);

	return returnSingleEntry(tag,physical,head);
}

function fillPublicationFrequency(record,head,fieldFunc,subfieldFunc) {
	var tag = '310';

	if (checkExists(record.current_publication_frequency)) {
		var frequency_subfields = []

		if (checkExists(record.current_publication_frequency)) {
			var frequency_mappings = {
				'#': 'No determinable frequency',
				'a': 'Annual',
				'b': 'Bimonthly',
				'c': 'Semiweekly',
				'd': 'Daily',
				'e': 'Biweekly',
				'f': 'Semiannual',
				'g': 'Biennial',
				'h': 'Triennial',
				'i': 'Three times a week',
				'j': 'Three times a month',
				'k': 'Continuously updated',
				'm': 'Monthly',
				'q': 'Quarterly',
				's': 'Semimonthly',
				't': 'Three times a year',
				'u': 'Unknown',
				'w': 'Weekly',
				'z': 'Other',
				'n': 'Normalized irregular',
				'r': 'Regular',
				'u': 'Unknown',
				'x': 'Completely irregular',
				'|': 'No attempt to code'
			};

			frequency_subfields.push(subfieldFunc('a',frequency_mappings[record.current_publication_frequency]));
		}

		var frequency = fieldFunc(tag,' ',' ',frequency_subfields);

		return returnSingleEntry(tag,frequency,head);
	}
	else {
		return head !== null ? ['',''] : '';
	}
}

function fillDatesOfPublication(record,head,fieldFunc,subfieldFunc) {
	var tag = '362';

	if (checkExists(record.starting_year) || checkExists(record.ending_year)) {
		var date_range = '';
		if (checkExists(record.starting_year)) {
			date_range += record.starting_year;
		}
		date_range += '-';
		if (checkExists(record.ending_year)) {
			date_range += record.ending_year + '.';
		}

		var dates_of_publication = fieldFunc(tag,'0',' ',[subfieldFunc('a',date_range)]);

		return returnSingleEntry(tag,dates_of_publication,head);
	}
	else {
		return head !== null ? ['',''] : '';
	}
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

function fillDescription(record,head,fieldFunc,subfieldFunc) {
	var tag = '500';

	if (checkExists(record.description)) {
		var description = fieldFunc(tag,' ',' ',[subfieldFunc('a',record.description)]);

		return returnSingleEntry(tag,description,head);
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

function fillAdditionalCorporateNames(record,head,fieldFunc,subfieldFunc) {
	var tag = '710';

	if (checkExists(record.additional_corporate_names)) {
		var authors = '';
		var authors_directory = '';
		translit_counter = 5
		if (checkExists(record.additional_authors)) {
			translit_counter += record.additional_authors.length;
		}
		var role_index = { 'cre': 'creator', 'ctb': 'contributor' };

		for (var i = 0; i < record.additional_corporate_names.length; i++) {
			if (checkExists(record.additional_corporate_names[i][0]['corporate'])) {
				var latin_index = checkExists(record.additional_corporate_names[i][1]['corporate']) ? 1 : 0;
				var authors_subfield = [subfieldFunc('a',record.additional_corporate_names[i][latin_index]['corporate']),subfieldFunc('e',role_index[record.additional_corporate_names[i][0]['role']] + '.'),subfieldFunc('4',record.additional_corporate_names[i][0]['role'])];

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

function fillPrecedingTitle(record,head,fieldFunc,subfieldFunc) {
	var tag = '780';

	if (checkExists(record.preceding_title) && checkExists(record.relationship_with_preceding_title)) {
		var preceding_title = fieldFunc(tag,'0',record.relationship_with_preceding_title,[subfieldFunc('t',record.preceding_title)]);

		return returnSingleEntry(tag,preceding_title,head);
	}
	else {
		return head !== null ? ['','',head] : '';
	}
}

function fillSucceedingTitle(record,head,fieldFunc,subfieldFunc) {
	var tag = '785';

	if (checkExists(record.succeeding_title) && checkExists(record.relationship_with_succeeding_title)) {
		var succeeding_title = fieldFunc(tag,'0',record.relationship_with_succeeding_title,[subfieldFunc('t',record.succeeding_title)]);

		return returnSingleEntry(tag,succeeding_title,head);
	}
	else {
		return head !== null ? ['','',head] : '';
	}
}

function fillWebURL(record,head,fieldFunc,subfieldFunc) {
	var tag = '856';

	if (checkExists(record.web_url)) {
		var web_url = fieldFunc(tag,'4','1',[subfieldFunc('u','http://' + record.web_url)]);

		return returnSingleEntry(tag,web_url,head);
	}
	else {
		return head !== null ? ['','',head] : '';
	}
}

function fillTranslitTitle(record,head,fieldFunc,subfieldFunc) {
	var tag = '880';

	//author_array[0] contains the contents of the first author field
	var title_ind1 = '0';

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

		if (checkExists(record.starting_year)) {
			translit_content.push(subfieldFunc('c',record.starting_year + '.'));
		}
		else {
			translit_content.push(subfieldFunc('c','[date of publication not identified]'));
		}

		var publisher880 = fieldFunc(tag,' ','1',translit_content);

		return returnSingleEntry(tag,publisher880,head);
	}
	else {
		return head !== null ? ['',''] : '';
	}
}

function fillTranslitCorporateAuthor(record,head,fieldFunc,subfieldFunc) {
	var tag = '880';

	if (checkExists(record.corporate_author[1]['corporate'])) {
		var translit_content = [subfieldFunc('6','110-04')];

		translit_content.push(subfieldFunc('a',record.corporate_author[1]['corporate']))
		var author880 = fieldFunc(tag,'1',' ',translit_content);

		return returnSingleEntry(tag,author880,head);	
	}
	else {
		return head !== null ? ['',''] : '';
	}
}

function fillTranslitAdditionalCorporateAuthors(record,head,fieldFunc,subfieldFunc) {
	var tag = '880';

	if (checkExists(record.additional_corporate_names)) {
		var authors880 = '';
		var authors880_directory = '';
		var translit_counter = 5;
		if (checkExists(record.additional_authors)) {
			translit_counter += record.additional_authors.length;
		}

		for (var i = 0; i < record.additional_corporate_names.length; i++) {
			if (checkExists(record.additional_corporate_names[i][1]['corporate'])) {
				var authors_content = record.additional_corporate_names[i][0]['corporate'];

				if (translit_counter < 10) {
					var translit_index = '0' + translit_counter;
				}
				else {
					var translit_index = translit_counter;
				}
				translit_counter++;

				var new_content = fieldFunc(tag,'1',' ',[subfieldFunc('6','710-' + translit_index),subfieldFunc('a',authors_content)]);
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

	var controlfield006_content = String.fromCharCode(30) + create006Field(record);
	var controlfield006_directory = createDirectory('006',controlfield006_content,head);
	head += controlfield006_content.length;

	var controlfield008_content = String.fromCharCode(30) + create008Field(record);
	var controlfield008_directory = createDirectory('008',controlfield008_content,head);
	head += controlfield008_content.length;

	var issn = fillISSN(record,head,createContentFill,createSubfield);
	head += issn[1].length;

	var default1_content = createContent('  ',[createSubfield('a',institution_info['marc']),createSubfield('b','eng'),createSubfield('e','rda'),createSubfield('c',institution_info['marc'])]);
	var default1_directory = createDirectory('040',default1_content,head);
	head += default1_content.length;

	var corporate_author = fillCorporateAuthor(record,head,createContentFill,createSubfield);
	head += getByteLength(corporate_author[1]);

	var title = fillTitle(record,head,createContentFill,createSubfield);
	head += getByteLength(title[1]);

	var varying_title = fillVaryingTitle(record,head,createContentFill,createSubfield);
	head += getByteLength(varying_title[1]);

	var pub = fillPublication(record,head,createContentFill,createSubfield);
	head += getByteLength(pub[1]);

	var physical = fillPhysical(record,head,createContentFill,createSubfield);
	head += getByteLength(physical[1]);

	var frequency = fillPublicationFrequency(record,head,createContentFill,createSubfield);
	head += getByteLength(frequency[1]);

	var default2_content = createContent('  ',[createSubfield('a','text'),createSubfield('b','txt'),createSubfield('2','rdacontent')]);
	var default2_directory = createDirectory('336',default2_content,head);
	head += default2_content.length;

	var default3_content = createContent('  ',[createSubfield('a','unmediated'),createSubfield('b','n'),createSubfield('2','rdamedia')]);
	var default3_directory = createDirectory('337',default3_content,head);
	head += default3_content.length;

	var default4_content = createContent('  ',[createSubfield('a','volume'),createSubfield('b','nc'),createSubfield('2','rdacarrier')]);
	var default4_directory = createDirectory('338',default4_content,head);
	head += default4_content.length;

	var dates = fillDatesOfPublication(record,head,createContentFill,createSubfield);
	head += getByteLength(dates[1]);

	var notes = fillNotes(record,head,createContentFill,createSubfield);
	head += getByteLength(notes[1]);

	var description = fillDescription(record,head,createContentFill,createSubfield);
	head += getByteLength(description[1]);

	var keywords = fillKeywords(record,head,createContentFill,createSubfield);
	head = keywords[2];

	var fast = fillFAST(record,head,createContentFill,createSubfield);
	head = fast[2];

	var additional_corporate_authors = fillAdditionalCorporateNames(record,head,createContentFill,createSubfield);
	head = additional_corporate_authors[2];

	var preceding_title = fillPrecedingTitle(record,head,createContentFill,createSubfield);
	head = getByteLength(preceding_title[1]);

	var succeeding_title = fillSucceedingTitle(record,head,createContentFill,createSubfield);
	head = getByteLength(succeeding_title[1]);

	var web_url = fillWebURL(record,head,createContentFill,createSubfield);
	head = getByteLength(web_url[1]);

	var title880 = fillTranslitTitle(record,head,createContentFill,createSubfield);
	head += getByteLength(title880[1]);

	var edition880 = fillTranslitEdition(record,head,createContentFill,createSubfield);
	head += getByteLength(edition880[1]);

	var publisher880 = fillTranslitPublisher(record,head,createContentFill,createSubfield);
	head += getByteLength(publisher880[1]);

	var corporate880 = fillTranslitCorporateAuthor(record,head,createContentFill,createSubfield);
	head += getByteLength(corporate880[1]);

	var corporations880 = fillTranslitAdditionalCorporateAuthors(record,head,createContentFill,createSubfield);
	head = corporations880[2];

	var end = String.fromCharCode(30) + String.fromCharCode(29);
	var text = timestamp_directory + controlfield006_directory + controlfield008_directory + issn[0] + default1_directory + corporate_author[0] + title[0] + varying_title[0] + pub[0] + physical[0] + frequency[0] + default2_directory + default3_directory + default4_directory + dates[0] + notes[0] + description[0] + keywords[0] + fast[0] + additional_corporate_authors[0] + preceding_title[0] + succeeding_title[0] + web_url[0] + title880[0] + edition880[0] + publisher880[0] + corporate880[0] + corporations880[0] + timestamp_content + controlfield006_content + controlfield008_content + issn[1] + default1_content + corporate_author[1] + title[1] + varying_title[1] + pub[1] + physical[1] + frequency[1] + default2_content + default3_content + default4_content + dates[1] + notes[1] + description[1] + keywords[1] + fast[1] + additional_corporate_authors[1] + preceding_title[1] + succeeding_title[1] + web_url[1] + title880[1] + edition880[1] + publisher880[1] + corporate880[1] + corporations880[1] + end;
	var leader_len = getByteLength(text) + 24;
	var directory_len = 25 + timestamp_directory.length + controlfield006_directory.length + controlfield008_directory.length + issn[0].length + default1_directory.length + corporate_author[0].length + title[0].length + varying_title[0].length + pub[0].length + physical[0].length + frequency[0].length + default2_directory.length + default3_directory.length + default4_directory.length + dates[0].length + notes[0].length + description[0].length + keywords[0].length + fast[0].length + additional_corporate_authors[0].length + preceding_title[0].length + succeeding_title[0].length + web_url[0].length + title880[0].length + edition880[0].length + publisher880[0].length + corporate880[0].length + corporations880[0].length;
	var leader = addZeros(leader_len,'leader') + 'nas a22' + addZeros(directory_len,'leader') + 'ki 4500';
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
	var text = '<?xml version="1.0" encoding="utf-8"?>\n<record xmlns="http://www.loc.gov/MARC21/slim" xsi:schemaLocation="http://www.loc.gov/MARC21/slim http://www.loc.gov/standards/marcxml/schema/MARC21slim.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">\n  <leader>01447nas a2200397ki 4500</leader>\n';
	
	var formatted_date = getTimestamp();
	text += '  <controlfield tag="005">' + formatted_date + '</controlfield>\n';

	var controlfield006 = create006Field(record);
	text += '  <controlfield tag="006">' + controlfield006 + '</controlfield>\n'
	
	var controlfield008 = create008Field(record);
	text += '  <controlfield tag="008">' + controlfield008 + '</controlfield>\n'
	
	text += createMARCXMLField('040',' ',' ',[createMARCXMLSubfield('a',institution_info['marc']),createMARCXMLSubfield('b','eng'),createMARCXMLSubfield('e','rda'),createMARCXMLSubfield('c',institution_info['marc'])]);
	text += fillISSN(record,null,createMARCXMLField,createMARCXMLSubfield);
	text += fillCorporateAuthor(record,null,createMARCXMLField,createMARCXMLSubfield);
	text += fillTitle(record,null,createMARCXMLField,createMARCXMLSubfield);
	text += fillVaryingTitle(record,null,createMARCXMLField,createMARCXMLSubfield);
	text += fillPublication(record,null,createMARCXMLField,createMARCXMLSubfield);
	text += fillPhysical(record,null,createMARCXMLField,createMARCXMLSubfield);
	text += fillPublicationFrequency(record,null,createMARCXMLField,createMARCXMLSubfield);
	text += createMARCXMLField('336',' ',' ',[createMARCXMLSubfield('a','text'),createMARCXMLSubfield('b','txt'),createMARCXMLSubfield('2','rdacontent')]) + createMARCXMLField('337',' ',' ',[createMARCXMLSubfield('a','unmediated'),createMARCXMLSubfield('b','n'),createMARCXMLSubfield('2','rdamedia')]) + createMARCXMLField('338',' ',' ',[createMARCXMLSubfield('a','volume'),createMARCXMLSubfield('b','nc'),createMARCXMLSubfield('2','rdacarrier')]);
	text += fillDatesOfPublication(record,null,createMARCXMLField,createMARCXMLSubfield);
	text += fillNotes(record,null,createMARCXMLField,createMARCXMLSubfield);
	text += fillDescription(record,null,createMARCXMLField,createMARCXMLSubfield);
	text += fillKeywords(record,null,createMARCXMLField,createMARCXMLSubfield);
	text += fillFAST(record,null,createMARCXMLField,createMARCXMLSubfield);
	text += fillAdditionalCorporateNames(record,null,createMARCXMLField,createMARCXMLSubfield);
	text += fillPrecedingTitle(record,null,createMARCXMLField,createMARCXMLSubfield);
	text += fillSucceedingTitle(record,null,createMARCXMLField,createMARCXMLSubfield);
	text += fillWebURL(record,null,createMARCXMLField,createMARCXMLSubfield);
	text += fillTranslitTitle(record,null,createMARCXMLField,createMARCXMLSubfield);
	text += fillTranslitEdition(record,null,createMARCXMLField,createMARCXMLSubfield);
	text += fillTranslitPublisher(record,null,createMARCXMLField,createMARCXMLSubfield);
	text += fillTranslitCorporateAuthor(record,null,createMARCXMLField,createMARCXMLSubfield);
	text += fillTranslitAdditionalCorporateAuthors(record,null,createMARCXMLField,createMARCXMLSubfield);
	text +='</record>\n';

	downloadFile(text,'xml');
}
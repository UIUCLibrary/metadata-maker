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

	//22-32
	array_of_008[26] = 'j'
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

function fillCorporateAuthor(record,head,fieldFunc,subfieldFunc) {
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
	var author = fieldFunc('110','1',' ',author_subfields);

	//MARC
	if (head !== null) {
		var author_directory = createDirectory('110',author,head);
		return [author_directory,author];
	}
	//MARCXML
	else {
		return author;
	}
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
	var title_ind1 = checkExists(record.author[0]['family']) || checkExists(record.author[0]['given']) || checkExists(record.corporate_author['corporate']) ? '1' : '0';
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

function fillDateCollected(record,head,fieldFunc,subfieldFunc) {
	if (checkExists(record.datecollected)) {
		var datecollected = fieldFunc('500',' ',' ',[subfieldFunc('a','Data was collected on ' + record.datecollected + '.')]);

		//MARC
		if (head !== null) {
			var datecollected_directory = createDirectory('500',datecollected,head);
			return [datecollected_directory,datecollected];
		}
		//MARCXML
		else {
			return datecollected;
		}
	}
	else {
		return head !== null ? ['',''] : '';
	}
}

function fillAccessTerms(record,head,fieldFunc,subfieldFunc) {
	if (checkExists(record.access_terms)) {
		var access_terms = fieldFunc('506',' ',' ',[subfieldFunc('a',record.access_terms)]);

		//MARC
		if (head !== null) {
			var access_terms_directory = createDirectory('506',access_terms,head);
			return [access_terms_directory,access_terms];
		}
		//MARCXML
		else {
			return access_terms;
		}
	}
	else {
		return head !== null ? ['',''] : '';
	}
}

function fillGeographicCoverage(record,head,fieldFunc,subfieldFunc) {
	if (checkExists(record.gcoverage)) {
		var gcoverage = fieldFunc('522',' ',' ',[subfieldFunc('a',record.gcoverage)]);

		//MARC
		if (head !== null) {
			var gcoverage_directory = createDirectory('522',gcoverage,head);
			return [gcoverage_directory,gcoverage];
		}
		//MARCXML
		else {
			return gcoverage;
		}
	}
	else {
		return head !== null ? ['',''] : '';
	}
}

function fillGeographicGranularity(record,head,fieldFunc,subfieldFunc) {
	if (checkExists(record.ggranularity)) {
		var ggranularity = fieldFunc('522',' ',' ',[subfieldFunc('a',record.ggranularity)]);

		//MARC
		if (head !== null) {
			var ggranularity_directory = createDirectory('522',ggranularity,head);
			return [ggranularity_directory,ggranularity];
		}
		//MARCXML
		else {
			return ggranularity;
		}
	}
	else {
		return head !== null ? ['',''] : '';
	}
}

function fillFormat(record,head,fieldFunc,subfieldFunc) {
	if (checkExists(record.format)) {
		var format = fieldFunc('538',' ',' ',[subfieldFunc('a','Data in ' + record.format + ' format.')]);

		//MARC
		if (head !== null) {
			var format_directory = createDirectory('538',format,head);
			return [format_directory,format];
		}
		//MARCXML
		else {
			return format;
		}
	}
	else {
		return head !== null ? ['',''] : '';
	}
}

function fillUseTerms(record,head,fieldFunc,subfieldFunc) {
	if (checkExists(record.use_terms)) {
		var use_terms = fieldFunc('540',' ',' ',[subfieldFunc('a',record.use_terms)]);

		//MARC
		if (head !== null) {
			var use_terms_directory = createDirectory('540',use_terms,head);
			return [use_terms_directory,use_terms];
		}
		//MARCXML
		else {
			return use_terms;
		}
	}
	else {
		return head !== null ? ['',''] : '';
	}
}

function fillDateRange(record,head,fieldFunc,subfieldFunc) {
	if (checkExists(record.daterange)) {
		var daterange = fieldFunc('648',' ','0',[subfieldFunc('a',record.daterange)]);

		//MARC
		if (head !== null) {
			var daterange_directory = createDirectory('648',daterange,head);
			return [daterange_directory,daterange];
		}
		//MARCXML
		else {
			return daterange;
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

		//MARC
		if (head !== null) {
			return [FAST_directory,FAST,head];
		}
		//MARCXML
		else {
			return FAST;
		}
	}
	else {
		return head !== null ? ['','',head] : '';
	}
}

function fillAdditionalAuthors(record,head,fieldFunc,subfieldFunc) {
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

function fillAdditionalCorporateNames(record,head,fieldFunc,subfieldFunc) {
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
				var field_number = record.additional_corporate_names[i][latin_index]['role'] == 'cre' ? '110' : '710';
				var new_content = fieldFunc(field_number,'1',' ',authors_subfield);
				authors += new_content;

				if (head !== null) {
					var new_directory = createDirectory(field_number,new_content,head);
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

function fillWebURL(record,head,fieldFunc,subfieldFunc) {
	var web_url = fieldFunc('856','4','0',[subfieldFunc('u',record.web_url)]);

	//MARC
	if (head !== null) {
		var web_url_directory = createDirectory('856',web_url,head);
		return [web_url_directory,web_url];
	}
	//MARCXML
	else {
		return web_url;
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

		if (checkExists(record.publication_year)) {
			translit_content.push(subfieldFunc('c',record.publication_year + '.'));
		}
		else if (checkExists(record.copyright_year)) {
			translit_content.push(subfieldFunc('c','[' + record.copyright_year + ']'));
		}
		else {
			translit_content.push(subfieldFunc('c','[date of publication not identified]'));
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

function fillTranslitCorporateAuthor(record,head,fieldFunc,subfieldFunc) {
	if (checkExists(record.corporate_author[1]['corporate'])) {
		var translit_content = [subfieldFunc('6','110-04')];

		translit_content.push(subfieldFunc('a',record.corporate_author[1]['corporate']))
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

				var new_content = fieldFunc('880','1',' ',[subfieldFunc('6','700-' + translit_index),subfieldFunc('a',authors_content)]);
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

function fillTranslitAdditionalCorporateAuthors(record,head,fieldFunc,subfieldFunc) {
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

				var new_content = fieldFunc('880','1',' ',[subfieldFunc('6','710-' + translit_index),subfieldFunc('a',authors_content)]);
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

	var default1_content = createContent('  ',[createSubfield('a',institution_info['marc']),createSubfield('b','eng'),createSubfield('e','rda'),createSubfield('c',institution_info['marc'])]);
	var default1_directory = createDirectory('040',default1_content,head);
	head += default1_content.length;

	var author = fillAuthor(record,head,createContentFill,createSubfield);
	head += getByteLength(author[1]);

	var corporate_author = fillCorporateAuthor(record,head,createContentFill,createSubfield);
	head += getByteLength(corporate_author[1]);

	var title = fillTitle(record,head,createContentFill,createSubfield);
	head += getByteLength(title[1]);

	var pub = fillPublication(record,head,createContentFill,createSubfield);
	head += getByteLength(pub[1]);

	var copyright = fillCopyright(record,head,createContentFill,createSubfield);
	head += getByteLength(copyright[1]);

	var default2_content = createContent('  ',[createSubfield('a','1 data file')]);
	var default2_directory = createDirectory('300',default2_content,head);
	head += default2_content.length;

	var default3_content = createContent('  ',[createSubfield('a','computer dataset'),createSubfield('b','cod'),createSubfield('2','rdacontent')]);
	var default3_directory = createDirectory('336',default3_content,head);
	head += default3_content.length;

	var default4_content = createContent('  ',[createSubfield('a','computer'),createSubfield('b','c'),createSubfield('2','rdamedia')]);
	var default4_directory = createDirectory('337',default4_content,head);
	head += default4_content.length;

	var default5_content = createContent('  ',[createSubfield('a','online resource'),createSubfield('b','cr'),createSubfield('2','rdacarrier')]);
	var default5_directory = createDirectory('338',default5_content,head);
	head += default5_content.length;

	var notes = fillNotes(record,head,createContentFill,createSubfield);
	head += getByteLength(notes[1]);

	var date_collected = fillDateCollected(record,head,createContentFill,createSubfield);
	head += getByteLength(date_collected[1]);

	var access_terms = fillAccessTerms(record,head,createContentFill,createSubfield);
	head += getByteLength(access_terms[1]);

	var geographic_coverage = fillGeographicCoverage(record,head,createContentFill,createSubfield);
	head += getByteLength(geographic_coverage[1]);

	var geographic_granularity = fillGeographicGranularity(record,head,createContentFill,createSubfield);
	head += getByteLength(geographic_granularity[1]);

	var file_format = fillFormat(record,head,createContentFill,createSubfield);
	head += getByteLength(file_format[1]);

	var use_terms = fillUseTerms(record,head,createContentFill,createSubfield);
	head += getByteLength(use_terms[1]);

	var date_range = fillDateRange(record,head,createContentFill,createSubfield);
	head += getByteLength(date_range[1]);

	var default7_content = createContent('  ',[createSubfield('a','Mode of access: World Wide Web.')]);
	var default7_directory = createDirectory('538',default7_content,head);
	head += default7_content.length;

	var keywords = fillKeywords(record,head,createContentFill,createSubfield);
	head = keywords[2];

	var default8_content = createContent(' 4',[createSubfield('a','Online databases')]);
	var default8_directory = createDirectory('655',default8_content,head);
	head += default8_content.length;

	var fast = fillFAST(record,head,createContentFill,createSubfield);
	head = fast[2];

	var additional_authors = fillAdditionalAuthors(record,head,createContentFill,createSubfield);
	head = additional_authors[2];

	var additional_corporate_authors = fillAdditionalCorporateNames(record,head,createContentFill,createSubfield);
	head = additional_corporate_authors[2];

	var web_url = fillWebURL(record,head,createContentFill,createSubfield);
	head = getByteLength(web_url[1]);

	var title880 = fillTranslitTitle(record,head,createContentFill,createSubfield);
	head += getByteLength(title880[1]);

	var publisher880 = fillTranslitPublisher(record,head,createContentFill,createSubfield);
	head += getByteLength(publisher880[1]);

	var author880 = fillTranslitAuthor(record,head,createContentFill,createSubfield);
	head += getByteLength(author880[1]);

	var corporate880 = fillTranslitCorporateAuthor(record,head,createContentFill,createSubfield);
	head += getByteLength(corporate880[1]);

	var authors880 = fillTranslitAdditionalAuthors(record,head,createContentFill,createSubfield);
	head = authors880[2];

	var corporations880 = fillTranslitAdditionalCorporateAuthors(record,head,createContentFill,createSubfield);
	head = corporations880[2];

	var end = String.fromCharCode(30) + String.fromCharCode(29);
	var text = timestamp_directory + controlfield008_directory + default1_directory + author[0] + corporate_author[0] + title[0] + pub[0] + copyright[0] + default2_directory + default3_directory + default4_directory + default5_directory + notes[0] + date_collected[0] + access_terms[0] + geographic_coverage[0] + geographic_granularity[0] + file_format[0] + use_terms[0] + date_range[0] + default7_directory + keywords[0] + default8_directory + fast[0] + additional_authors[0] + additional_corporate_authors[0] + web_url[0] + title880[0] + publisher880[0] + author880[0] + corporate880[0] + authors880[0] + corporations880[0] + timestamp_content + controlfield008_content + default1_content + author[1] + corporate_author[1] + title[1] + pub[1] + copyright[1] + default2_content + default3_content + default4_content + default5_content + notes[1] + date_collected[1] + access_terms[1] + geographic_coverage[1] + geographic_granularity[1] + file_format[1] + use_terms[1] + date_range[1] + default7_content + keywords[1] + default8_content + fast[1] + additional_authors[1] + additional_corporate_authors[1] + web_url[1] + title880[1] + publisher880[1] + author880[1] + corporate880[1] + authors880[1] + corporations880[1] + end;
	var leader_len = getByteLength(text) + 24;
	var directory_len = 25 + timestamp_directory.length + controlfield008_directory.length + default1_directory.length + author[0].length + corporate_author[0].length + title[0].length + pub[0].length + copyright[0].length + default2_directory.length + default3_directory.length + default4_directory.length + default5_directory.length + notes[0].length + date_collected[0].length + access_terms[0].length + geographic_coverage[0].length + geographic_granularity[0].length + file_format[0].length + use_terms[0].length + date_range[0].length + default7_directory.length + keywords[0].length + default8_directory.length + fast[0].length + additional_authors[0].length + additional_corporate_authors[0].length + web_url[0].length + title880[0].length + publisher880[0].length + author880[0].length + corporate880[0].length + authors880[0].length + corporations880[1].length;
	var leader = addZeros(leader_len,'leader') + 'mam a22' + addZeros(directory_len,'leader') + 'ki 4500';
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
	var startText = '<?xml version="1.0" encoding="utf-8"?>\n<record xmlns="http://www.loc.gov/MARC21/slim" xsi:schemaLocation="http://www.loc.gov/MARC21/slim http://www.loc.gov/standards/marcxml/schema/MARC21slim.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">\n  <leader>01447mam a2200397ki 4500</leader>\n';
	
	var formatted_date = getTimestamp();
	var timestamp = '  <controlfield tag="005">' + formatted_date + '</controlfield>\n';
	
	var controlfield008 = create008Field(record);
	controlfield008 = '  <controlfield tag="008">' + controlfield008 + '</controlfield>\n'
	
	var default1 = createMARCXMLField('040',' ',' ',[createMARCXMLSubfield('a',institution_info['marc']),createMARCXMLSubfield('b','eng'),createMARCXMLSubfield('e','rda'),createMARCXMLSubfield('c',institution_info['marc'])]);
	var author = fillAuthor(record,null,createMARCXMLField,createMARCXMLSubfield);
	var corporate_author = fillCorporateAuthor(record,null,createMARCXMLField,createMARCXMLSubfield);
	var title = fillTitle(record,null,createMARCXMLField,createMARCXMLSubfield);
	var publication = fillPublication(record,null,createMARCXMLField,createMARCXMLSubfield);
	var copyright = fillCopyright(record,null,createMARCXMLField,createMARCXMLSubfield);
	var default2 = createMARCXMLField('300',' ',' ',[createMARCXMLSubfield('a','1 data file')]) + createMARCXMLField('336',' ',' ',[createMARCXMLSubfield('a','computer dataset'),createMARCXMLSubfield('b','cod'),createMARCXMLSubfield('2','rdacontent')]) + createMARCXMLField('337',' ',' ',[createMARCXMLSubfield('a','computer'),createMARCXMLSubfield('b','c'),createMARCXMLSubfield('2','rdamedia')]) + createMARCXMLField('338',' ',' ',[createMARCXMLSubfield('a','online resource'),createMARCXMLSubfield('b','cr'),createMARCXMLSubfield('2','rdacarrier')]);
	var notes = fillNotes(record,null,createMARCXMLField,createMARCXMLSubfield);
	var date_collected = fillDateCollected(record,null,createMARCXMLField,createMARCXMLSubfield);
	var access_terms = fillAccessTerms(record,null,createMARCXMLField,createMARCXMLSubfield);
	var geographic_coverage = fillGeographicCoverage(record,null,createMARCXMLField,createMARCXMLSubfield);
	var geographic_granularity = fillGeographicGranularity(record,null,createMARCXMLField,createMARCXMLSubfield);
	var file_format = fillFormat(record,null,createMARCXMLField,createMARCXMLSubfield);
	var use_terms = fillUseTerms(record,null,createMARCXMLField,createMARCXMLSubfield);
	var date_range = fillDateRange(record,null,createMARCXMLField,createMARCXMLSubfield);
	var default3 = createMARCXMLField('538',' ',' ',[createMARCXMLSubfield('a','Mode of access: World Wide Web.')]);
	var keywords = fillKeywords(record,null,createMARCXMLField,createMARCXMLSubfield);
	var default4 = createMARCXMLField('655',' ','4',[createMARCXMLSubfield('a','Online databases')]);
	var fast = fillFAST(record,null,createMARCXMLField,createMARCXMLSubfield);
	var additional_authors = fillAdditionalAuthors(record,null,createMARCXMLField,createMARCXMLSubfield);
	var additional_corporate_authors = fillAdditionalCorporateNames(record,null,createMARCXMLField,createMARCXMLSubfield);
	var web_url = fillWebURL(record,null,createMARCXMLField,createMARCXMLSubfield);
	var title880 = fillTranslitTitle(record,null,createMARCXMLField,createMARCXMLSubfield);
	var publisher880 = fillTranslitPublisher(record,null,createMARCXMLField,createMARCXMLSubfield);
	var author880 = fillTranslitAuthor(record,null,createMARCXMLField,createMARCXMLSubfield);
	var corporate880 = fillTranslitCorporateAuthor(record,null,createMARCXMLField,createMARCXMLSubfield);
	var authors880 = fillTranslitAdditionalAuthors(record,null,createMARCXMLField,createMARCXMLSubfield);
	var corporations880 = fillTranslitAdditionalCorporateAuthors(record,null,createMARCXMLField,createMARCXMLSubfield);
	var endText ='</record>\n';

	var text = startText + timestamp + controlfield008 + default1 + author + corporate_author + title + publication + copyright + default2 + notes + date_collected + access_terms + geographic_coverage + geographic_granularity + file_format + use_terms + date_range + default3 + keywords + default4 + fast + additional_authors + additional_corporate_authors + web_url + title880 + publisher880 + author880 + corporate880 + authors880 + corporations880 + endText;
	downloadFile(text,'xml');
}
/*
 * Author output depends on how the name was entered
 */
 // ALL AUTHOR CAN USE THIS FUNCRTION
function fillAuthorMODS(author_record) {
	var authorText;
	var role_index = { 'art': 'artist', 'aut': 'author', 'ctb': 'contributor', 'edt': 'editor', 'ill': 'illustrator', 'trl': 'translator'};
	if (author_record[0]['family']){
		var latinname = author_record[0]['family'];
		var fullname;
		if (author_record[0]["lc"]!=""){
			var authorText = '    <name type="personal" usage="primary" authority="VIAF" authorityURI="http://viaf.org" valueURI="' + author_record[0]["viaf"] + '">\n';
			for (var i = 0; i < author_record[0]['subbd'].length; i++) {
	 			if (author_record[0]['subbd'][i]){
	 				latinname += " "
	 				latinname += escapeXml(author_record[0]['subbd'][i]);
	 			}
		 	}
		 	latinname = latinname.replace(/,\s*$/, "");
		 	authorText += '        <namePart>' + latinname + '</namePart>\n';
		 	authorText += '        <role>\n            <roleTerm authority="marcrelator" type="text">' + role_index[author_record[0]['role']] + '</roleTerm>\n            <roleTerm authority="marcrelator" type="code">' + author_record[0]['role'] + '</roleTerm>\n        </role>\n    </name>\n';		
		}else{
			if (author_record[0]["viaf"]!=""){
				var authorText = '    <name type="personal"type="personal" usage="primary" authority="VIAF" authorityURI="http://viaf.org" valueURI="' + author_record[0]["viaf"] + '">\n' ;
				authorText += '        <namePart>' + latinname + '</namePart>\n';
				authorText += '        <role>\n            <roleTerm authority="marcrelator" type="text">' + role_index[author_record[0]['role']] + '</roleTerm>\n            <roleTerm authority="marcrelator" type="code">' + author_record[0]['role'] + '</roleTerm>\n        </role>\n    </name>\n';		
			}else{
				authorText =  ''
			}
			
		}
		
	}else{
		authorText =  ''
	}
	return authorText;
}

/*
 * Build a MODS record. Each DOM object is saved as a string, then all the strings are combined into one master text
 *
 * record: 			 object containing the user-input data
 * institution_info: object containing name of institution creating record
 */
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

	var fastTypes = {
		'00': 'name type="personal"',
		'10': 'name type="corporate"',
		'11': 'name type="conference"',
		'30': 'titleInfo',
		'50': 'topic',
		'51': 'geographic',
		'55': 'genre'
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
	authorText += fillAuthorMODS(record.author);

	if (checkExists(record.additional_authors)) {
		for (var i = 0; i < record.additional_authors.length; i++) {
			authorText += fillAuthorMODS(record.additional_authors[i]);
		}
	}

	var titleText = '    <titleInfo>\n        <title>' + escapeXml(record.title[0]['title']) + '</title>\n';
	if (checkExists(record.title[0]['subtitle'])) {
		titleText += '        <subTitle>' + escapeXml(record.title[0]['subtitle']) + '</subTitle>\n';
	}
	titleText += '    </titleInfo>\n';

	var originText = '';
	if (checkExists(record.publication_country) || checkExists(record.publication_place) || checkExists(record.publisher) || checkExists(record.publication_year) || checkExists(record.copyright_year) || checkExists(record.edition)) {
		originText += '    <originInfo>\n';

		if (checkExists(record.publication_country)) {
			originText += '        <place>\n            <placeTerm type="code" authority="marccountry">' + record.publication_country + '</placeTerm>\n        </place>\n';
		}

		if (checkExists(record.publication_place)) {
			originText += '        <place>\n            <placeTerm type="text">' + escapeXml(record.publication_place) + '</placeTerm>\n        </place>\n';
		}

		if (checkExists(record.publisher)) {
			originText += '        <publisher>' + escapeXml(record.publisher) + '</publisher>\n';
		}

		if (checkExists(record.publication_year)) {
			originText += '        <dateIssued>' + record.publication_year + '</dateIssued>\n';
		}

		if (checkExists(record.copyright_year)) {
			originText += '        <copyrightDate>' + record.copyright_year + '</copyrightDate>\n';
		}

		if (checkExists(record.edition)) {
			originText += '        <edition>' + escapeXml(record.edition) + '</edition>\n';
		}

		originText += '    </originInfo>\n';
	}

	var languageText = '    <language>\n        <languageTerm authority="iso639-2b" type="code">' + record.language + '</languageTerm>\n    </language>\n';

	var pagesText = '';
	if (checkExists(record.pages)) {
		pagesText += '    <physicalDescription>\n        <form authority="marcform">print</form>\n        <extent>' + record.pages + ' ' + record.volume_or_page + '</extent>\n    </physicalDescription>\n';
	}

	var dimensionsText = '    <physicalDescription>\n        <form authority="marcform">print</form>\n        <extent>' + record.dimensions + ' cm</extent>\n    </physicalDescription>\n'

	var defaultText2 = '    <location>\n        <physicalLocation>' + escapeXml(institution_info['mods']['physicalLocation']) + '</physicalLocation>\n    </location>\n';


	var fastText = '';
	if (checkExists(record.keywords)) {
		if (record.keywords[0]!=''){
			for (var c = 0; c < record.keywords.length; c++) {
				fastText += '    <subject>\n        <' + fastTypes[record.keywordstype[c].substring(1,3)] + ' authority="FAST" authorityURI="http://fast.oclc.org/" valueURI="' + escapeXml(record.keywordshtml[c]) + '">'+ escapeXml(record.keywords[c])+'</'+fastTypes[record.keywordstype[c].substring(1,3)]+'>\n    </subject>\n'
			}
		}
	}

	if (checkExists(record.lcshvalue)) {
		for (var c = 0; c < record.lcshvalue.length; c++) {
			fastText += '    <subject>\n        <topic authority="LCSH" authorityURI="http://id.loc.gov/authorities/subjects/" valueURI="' + escapeXml(record.lcshuri[c]) + '">'+ escapeXml(record.lcshvalue[c])+'</topic>\n    </subject>\n'
		}
	}



	var literatureText = '';
	if (checkExists(record.literature_yes) && checkExists(record.literature_dropdown)) {
		literatureText += '    <genre authority="marcgt">' + literatureTypes[record.literature_dropdown] + '</genre>\n'
	}

	var timestamp = getTimestamp();
	var formatted_date = timestamp.substring(2,8);
	var defaultText3 = '    <recordInfo>\n        <descriptionStandard>rda</descriptionStandard>\n        <recordContentSource authority="marcorg">' + escapeXml(institution_info['mods']['recordContentSource']) + '</recordContentSource>\n        <recordCreationDate encoding="marc">' + formatted_date + '</recordCreationDate>\n    </recordInfo>\n'

	var endText = '</mods:mods>\n';
	// var text = startText + titleText + authorText + defaultText1 + isbnText + originText + languageText + pagesText + dimensionsText + defaultText2 + keywordsText + fastText + literatureText + defaultText3 + endText;
	// downloadFile(text,'mods');
	var text = startText + titleText + authorText + defaultText1 + isbnText + originText + languageText + pagesText + dimensionsText + defaultText2 + fastText + literatureText + defaultText3 + endText;
	downloadFile(text,'mods');
}
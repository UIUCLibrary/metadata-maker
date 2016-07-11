/*
 * Author output depends on how the name was entered
 */
function fillAuthorMODS(family,given,role) {
	var role_index = { 'art': 'artist', 'aut': 'author', 'ctb': 'contributor', 'edt': 'editor', 'ill': 'illustrator', 'trl': 'translator'};
	if (checkExists(given) || checkExists(family)) {
		var authorText = '    <name type="personal">\n';
		if (checkExists(family)) {
			authorText += '        <namePart type="family">' + escapeXML(family) + '</namePart>\n';
		}

		if (checkExists(given)) {
			authorText += '        <namePart type="given">' + escapeXML(given) + '</namePart>\n';
		}

		authorText += '        <role>\n            <roleTerm authority="marcrelator" type="text">' + role_index[role] + '</roleTerm>\n            <roleTerm authority="marcrelator" type="code">' + role + '</roleTerm>\n        </role>\n    </name>\n';
		return authorText;
	}
	else {
		return '';
	}
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
	authorText += fillAuthorMODS(record.author[0]['family'],record.author[0]['given'],record.author[0]['role']);

	if (checkExists(record.additional_authors)) {
		for (var i = 0; i < record.additional_authors.length; i++) {
			authorText += fillAuthorMODS(record.additional_authors[i][0]['family'],record.additional_authors[i][0]['given'],record.additional_authors[i][0]['role']);
		}
	}

	var titleText = '    <titleInfo>\n        <title>' + escapeXML(record.title[0]['title']) + '</title>\n';
	if (checkExists(record.title[0]['subtitle'])) {
		titleText += '        <subTitle>' + escapeXML(record.title[0]['subtitle']) + '</subTitle>\n';
	}
	titleText += '    </titleInfo>\n';

	var originText = '';
	if (checkExists(record.publication_country) || checkExists(record.publication_place) || checkExists(record.publisher) || checkExists(record.publication_year) || checkExists(record.copyright_year) || checkExists(record.edition)) {
		originText += '    <originInfo>\n';

		if (checkExists(record.publication_country)) {
			originText += '        <place>\n            <placeTerm type="code" authority="marccountry">' + record.publication_country + '</placeTerm>\n        </place>\n';
		}

		if (checkExists(record.publication_place)) {
			originText += '        <place>\n            <placeTerm type="text">' + escapeXML(record.publication_place) + '</placeTerm>\n        </place>\n';
		}

		if (checkExists(record.publisher)) {
			originText += '        <publisher>' + escapeXML(record.publisher) + '</publisher>\n';
		}

		if (checkExists(record.publication_year)) {
			originText += '        <dateIssued>' + record.publication_year + '</dateIssued>\n';
		}

		if (checkExists(record.copyright_year)) {
			originText += '        <copyrightDate>' + record.copyright_year + '</copyrightDate>\n';
		}

		if (checkExists(record.edition)) {
			originText += '        <edition>' + escapeXML(record.edition) + '</edition>\n';
		}

		originText += '    </originInfo>\n';
	}

	var languageText = '    <language>\n        <languageTerm authority="iso639-2b" type="code">' + record.language + '</languageTerm>\n    </language>\n';

	var pagesText = '';
	if (checkExists(record.pages)) {
		pagesText += '    <physicalDescription>\n        <form authority="marcform">print</form>\n        <extent>' + record.pages + ' ' + record.volume_or_page + '</extent>\n    </physicalDescription>\n';
	}

	var dimensionsText = '    <physicalDescription>\n        <form authority="marcform">print</form>\n        <extent>' + record.dimensions + ' cm</extent>\n    </physicalDescription>\n'

	var defaultText2 = '    <location>\n        <physicalLocation>' + escapeXML(institution_info['mods']['physicalLocation']) + '</physicalLocation>\n    </location>\n';

	var keywordsText = '';
	for (var c = 0; c < record.keywords.length; c++) {
		if (record.keywords[c] !== '') {
			keywordsText += '    <subject>\n        <topic>' + escapeXML(record.keywords[c]) + '</topic>\n    </subject>\n'
		}
	}

	var fastText = '';
	if (checkExists(record.fast)) {
		for (var c = 0; c < record.fast.length; c++) {
			fastText += '    <subject>\n        <' + fastTypes[record.fast[c][2].substring(1)] + ' authority="FAST" authorityURI="http://fast.oclc.org/" valueURI="http://id.worldcat.org/fast/' + escapeXML(record.fast[c][1]) + '"/>\n    </subject>\n'
		}
	}

	var literatureText = '';
	if (checkExists(record.literature_yes) && checkExists(record.literature_dropdown)) {
		literatureText += '    <genre authority="marcgt">' + literatureTypes[record.literature_dropdown] + '</genre>\n'
	}

	var timestamp = getTimestamp();
	var formatted_date = timestamp.substring(2,8);
	var defaultText3 = '    <recordInfo>\n        <descriptionStandard>rda</descriptionStandard>\n        <recordContentSource authority="marcorg">' + escapeXML(institution_info['mods']['recordContentSource']) + '</recordContentSource>\n        <recordCreationDate encoding="marc">' + formatted_date + '</recordCreationDate>\n    </recordInfo>\n'

	var endText = '</mods:mods>\n';
	var text = startText + titleText + authorText + defaultText1 + isbnText + originText + languageText + pagesText + dimensionsText + defaultText2 + keywordsText + fastText + literatureText + defaultText3 + endText;
	downloadFile(text,'mods');
}
/*
 * Corporate output depends on how the name was entered
 */
function fillCorporateMODS(corporate,role) {
	var role_index = { 'cre': 'creator', 'ctb': 'contributor' };
	if (checkExists(corporate)) {
		var authorText = '    <name type="corporate">\n';
		authorText += '        <namePart>' + corporate + '</namePart>\n';
		authorText += '        <role>\n';
		authorText += '            <roleTerm authority="marcrelator" type="text">' + role_index[role] + '</roleTerm>\n';
		authorText += '            <roleTerm authority="marcrelator" type="code">' + role + '</roleTerm>\n';
		authorText += '        </role>\n';
		authorText += '    </name>\n';
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

	var resourceTypes = {
		'#': 'None of the following',
		'd': 'Updating database',
		'l': 'Updating loose-leaf',
		'm': 'Monographic series',
		'n': 'Newspaper',
		'p': 'Periodical',
		'w': 'Updating Web site',
		'|': 'No attempt to code'
	}

	var frequencyTypes = {
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
	}

	var startText = '<?xml version="1.0" encoding="UTF-8"?>\n<mods:mods xmlns:mods="http://www.loc.gov/mods/v3"\n    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.loc.gov/mods/v3"\n    xmlns:xlink="http://www.w3.org/1999/xlink"\n    xsi:schemaLocation="http://www.loc.gov/mods/v3 http://www.loc.gov/standards/mods/v3/mods-3-5.xsd"\n    version="3.5">\n';

	var defaultText1 = '    <typeOfResource>text</typeOfResource>\n';

	var issnText = '';
	if (checkExists(record.issn)) {
		issnText += '    <identifier type="issn">' + record.issn + '</identifier>\n';
	}

	var resourceTypeText = '';
	if (checkExists(record.resource_type)) {
		resourceTypeText += '    <genre>' + resourceTypes[record.resource_type] + '</genre>\n';
	}

	var governmentText = '';
	if (checkExists(record.government_publication_yes) && record.government_publication_yes == true) {
		governmentText += '    <genre>Government Publication</genre>\n';
	}

	var corporateText = ''
	corporateText += fillCorporateMODS(record.corporate_author[0]['corporate'],record.corporate_author[0]['role']);

	if (checkExists(record.additional_corporate_names)) {
		for (var i = 0; i < record.additional_corporate_names.length; i++) {
			corporateText += fillCorporateMODS(record.additional_corporate_names[i][0]['corporate'],record.additional_corporate_names[i][0]['role']);
		}
	}

	var titleText = '    <titleInfo>\n        <title>' + escapeXML(record.title[0]['title']) + '</title>\n';
	if (checkExists(record.title[0]['subtitle'])) {
		titleText += '        <subTitle>' + escapeXML(record.title[0]['subtitle']) + '</subTitle>\n';
	}
	titleText += '    </titleInfo>\n';

	var urlText = '';
	if (checkExists(record.web_url)) {
		urlText += '    <relatedItem type="otherFormat" displayLabel="Online version:">\n        <titleInfo>\n            <title>' + escapeXML(record.title[0]['title']) + '</title>\n        </titleInfo>\n        <identifier type="url">' + escapeXML(record.web_url) + '</identifier>\n    </relatedItem>\n';
	}

	var originText = '';
	if (checkExists(record.publication_country) || checkExists(record.publication_place) || checkExists(record.publisher) || checkExists(record.starting_year) || checkExists(record.ending_year)) {
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

		if (checkExists(record.starting_year)) {
			originText += '        <dateIssued point="start" encoding="marc">\n';
			originText += '            <dateIssued>' + record.starting_year + '</dateIssued>\n';
			originText += '        </dateIssued>\n';
		}

		if (checkExists(record.ending_year)) {
			originText += '        <dateIssued point="end" encoding="marc">\n';
			originText += '            <dateIssued>' + record.ending_year + '</dateIssued>\n';
			originText += '        </dateIssued>\n';
		}

		originText += '    </originInfo>\n';
	}

	var languageText = '    <language>\n        <languageTerm authority="iso639-2b" type="code">' + record.language + '</languageTerm>\n    </language>\n';

	var pagesText = '';
	if (checkExists(record.volumes)) {
		pagesText += '    <physicalDescription>\n        <form authority="marcform">print</form>\n        <extent>' + record.volumes + ' volumes</extent>\n    </physicalDescription>\n';
	}

	var dimensionsText = '    <physicalDescription>\n        <form authority="marcform">print</form>\n        <extent>' + record.dimensions + ' cm</extent>\n    </physicalDescription>\n'

	var defaultText2 = '    <location>\n        <physicalLocation>' + escapeXML(institution_info['mods']['physicalLocation']) + '</physicalLocation>\n    </location>\n';

	var frequencyText = '';
	if (checkExists(record.current_publication_frequency)) {
		frequencyText += '    <originInfo>\n         <frequency>' + frequencyTypes[record.current_publication_frequency] + '</frequency>\n    </originInfo>\n';
	}

	var descriptionText = '';
	if (checkExists(record.description)) {
		descriptionText += '    <notes>' + escapeXML(record.description) + '</notes>\n';
	}

	var precedingText = '';
	if (checkExists(record.preceding_title)) {
		precedingText += '    <relatedItem type="preceding">\n        <titleInfo>\n            <title>' + escapeXML(record.preceding_title) + '</title>\n        </titleInfo>\n    </relatedItem>\n';
	}

	var succeedingText = '';
	if (checkExists(record.succeeding_title)) {
		succeedingText += '    <relatedItem type="succeeding">\n        <titleInfo>\n            <title>' + escapeXML(record.succeeding_title) + '</title>\n        </titleInfo>\n    </relatedItem>\n';
	}

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
	var text = startText + titleText + urlText + corporateText + defaultText1 + issnText + resourceTypeText + governmentText + originText + languageText + pagesText + dimensionsText + defaultText2 + frequencyText + descriptionText + precedingText + succeedingText + keywordsText + fastText + literatureText + defaultText3 + endText;
	downloadFile(text,'mods');
}
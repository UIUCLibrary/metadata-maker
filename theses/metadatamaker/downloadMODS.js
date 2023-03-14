/*
 * Author output depends on how the name was entered
 */
function fillAuthorMODS(family,given) {
	if (checkExists(given) || checkExists(family)) {
		var authorText = '    <name type="personal">\n';
		if (checkExists(family)) {
			authorText += '        <namePart type="family">' + escapeXML(family) + '</namePart>\n';
		}

		if (checkExists(given)) {
			authorText += '        <namePart type="given">' + escapeXML(given) + '</namePart>\n';
		}

		authorText += '        <role>\n            <roleTerm authority="marcrelator" type="text">author</roleTerm>\n            <roleTerm authority="marcrelator" type="code">aut</roleTerm>\n        </role>\n    </name>\n';
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
	var startText = '<?xml version="1.0" encoding="UTF-8"?>\n<mods:mods xmlns:mods="http://www.loc.gov/mods/v3"\n    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.loc.gov/mods/v3"\n    xmlns:xlink="http://www.w3.org/1999/xlink"\n    xsi:schemaLocation="http://www.loc.gov/mods/v3 http://www.loc.gov/standards/mods/v3/mods-3-5.xsd"\n    version="3.5">\n';

	var defaultText1 = '    <typeOfResource>text</typeOfResource>\n';

	var authorText = fillAuthorMODS(record.author['family'],record.author['given']);

	var titleText = '    <titleInfo>\n        <title>' + record.title + '</title>\n    </titleInfo>\n';

	var originText = '    <originInfo>\n';
	originText += '        <place>\n            <placeTerm type="code" authority="marccountry">ilu</placeTerm>\n        </place>\n';
	originText += '        <place>\n            <placeTerm type="text">Urbana, Ill.</placeTerm>\n        </place>\n';
	originText += '        <publisher>University of Illinois at Urbana-Champaign</publisher>\n';
	originText += '        <dateIssued>' + record.publication_year + '</dateIssued>\n';
	originText += '    </originInfo>\n';

	var languageText = '    <language>\n        <languageTerm authority="iso639-2b" type="code">' + record.language + '</languageTerm>\n    </language>\n';

	var pagesText = '    <physicalDescription>\n        <form authority="marcform">print</form>\n        <extent>' + record.number_of_pages + ' ' + record.leaf_or_page + '</extent>\n    </physicalDescription>\n';

	var majorText = '    <note type="thesis">Thesis (' + escapeXML(record.major) + ')-- University of Illinois at Urbana-Champaign, ' + record.publication_year + '.</note>\n';

	var bibText = '    <note type="bibliography">' + escapeXML(record.bibliographies) + '.</note>\n';

	var defaultText2 = '    <location>\n        <physicalLocation>' + escapeXML(institution_info['mods']['physicalLocation']) + '</physicalLocation>\n    </location>\n';

	var timestamp = getTimestamp();
	var formatted_date = timestamp.substring(2,8);
	var defaultText3 = '    <recordInfo>\n        <descriptionStandard>rda</descriptionStandard>\n        <recordContentSource authority="marcorg">' + escapeXML(institution_info['mods']['recordContentSource']) + '</recordContentSource>\n        <recordCreationDate encoding="marc">' + formatted_date + '</recordCreationDate>\n    </recordInfo>\n'

	var endText = '</mods:mods>\n';
	var text = startText + titleText + authorText + defaultText1 + originText + languageText + pagesText + majorText + defaultText2 + defaultText3 + endText;
	downloadFile(text,'mods');
}
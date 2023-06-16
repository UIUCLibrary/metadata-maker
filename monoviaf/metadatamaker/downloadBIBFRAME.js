/*
 * Author output depends on how the name was entered
 */
function escapeXml(unsafe) {
    return unsafe.replace(/[<>&'"]/g, function (c) {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
        }
    });
}

 function fillAuthorBIBFRAME(author_record){
 	console.log(author_record);
 	var role_index = { 'art': 'artist', 'aut': 'author', 'ctb': 'contributor', 'edt': 'editor', 'ill': 'illustrator', 'trl': 'translator'};
 	if (checkExists(author_record[0]['family'])){
 		var latinname = author_record[0]['family'];
 		if (author_record[0]['viaf'] !=""){
 			if (author_record[0]['lc'] !=""){
 				var contributionText = '        <bf:contribution>\n            <bf:Contribution>\n';
		 		if (author_record[0]['role'] == 0){
		 			contributionText += '                <rdf:type rdf:resource="http://id.loc.gov/ontologies/bflc/PrimaryContribution"/>\n'
		 		}else{
		 			var role = author_record[0]["role"]
		 			contributionText += '                <bf:role>\n                    <bf:Role rdf:about="http://id.loc.gov/vocabulary/relators/' + role + '"/>\n                </bf:role>\n                <bf:agent>\n                    <bf:Agent rdf:about="' + author_record[0]['lc'] +'">\n'+'                        <rdf:type rdf:resource="http://id.loc.gov/ontologies/bibframe/Person"/>\n						<rdfs:label>';
		 		};
		 		contributionText += escapeXml(latinname);
		 		for (var i = 0; i < author_record[0]['subbd'].length; i++) {
		 			if (author_record[0]['subbd'][i]){
		 				contributionText += " "
		 				contributionText += escapeXml(author_record[0]['subbd'][i]);
		 			}
		 		}
		 		contributionText = contributionText.replace(/,\s*$/, "");
		 		contributionText += '</rdfs:label>\n'
		 		if (author_record[1]['family']!= ""){
		 			contributionText += '						<rdfs:label>' + author_record[1]['family'] + '</rdfs:label>\n'
		 		}
		 		contributionText += '						<bf:identifiedBy>\n                            <bf:Identifier>\n                                <rdf:value rdf:resource="' + author_record[0]['viaf'] + '"/>\n                            </bf:Identifier>\n' + '						</bf:identifiedBy>\n'
		 		contributionText += '						<bf:identifiedBy>\n                            <bf:Identifier>\n                                <rdf:value rdf:resource="' + author_record[0]['lc'] + '"/>\n                            </bf:Identifier>\n' + '						</bf:identifiedBy>\n'

		 		contributionText += '                    </bf:Agent>\n                </bf:agent>\n            </bf:Contribution>\n        </bf:contribution>\n';
		 		return contributionText;
 			}else{
 				var contributionText = '        <bf:contribution>\n            <bf:Contribution>\n';
		 		if (author_record[0]['role'] == 0){
		 			contributionText += '                <rdf:type rdf:resource="http://id.loc.gov/ontologies/bflc/PrimaryContribution"/>\n'
		 		}else{
		 			var role = author_record[0]["role"]
		 			contributionText += '                <bf:role>\n                    <bf:Role rdf:about="http://id.loc.gov/vocabulary/relators/' + role + '"/>\n                </bf:role>\n                <bf:agent>\n                    <bf:Agent rdf:about="' + author_record[0]['viaf'] +'">\n'+'                         <rdf:type rdf:resource="http://id.loc.gov/ontologies/bibframe/Person"/>\n						<rdfs:label>';
		 		};
		 		contributionText += escapeXml(latinname);
		 		
		 		contributionText = contributionText.replace(/,\s*$/, "");
		 		contributionText += '</rdfs:label>\n'
		 		if (author_record[1]['family']!= ""){
		 			contributionText += '						<rdfs:label>' + author_record[1]['family'] + '</rdfs:label>\n'
		 		}
		 		// contributionText += '						<bf:identifiedBy>\n                            <bf:Identifier>\n                                <rdf:value rdf:resource="' + author_record[0]['viaf'] + '"/>\n                            </bf:Identifier>\n' + '                                </bf:identifiedBy>\n'
		 		contributionText += '                    </bf:Agent>\n                </bf:agent>\n            </bf:Contribution>\n        </bf:contribution>\n';
		 		return contributionText;			
 			}
 		}else{
 			return ""
 		}
 		
 	}
 };

function fillAuthorAdditionalBIBFRAME(author_record){
	var role_index = { 'art': 'artist', 'aut': 'author', 'ctb': 'contributor', 'edt': 'editor', 'ill': 'illustrator', 'trl': 'translator'};
 	if (checkExists(author_record['0']['family'])){
 		var latinname = author_record['0']['family'];
 		if (author_record['0']['viaf'] !=""){
 			if (author_record['0']['lc'] !=""){
 				var contributionText = '        <bf:contribution>\n            <bf:Contribution>\n';
		 		if (author_record['0']['role'] == 0){
		 			contributionText += '                <rdf:type rdf:resource="http://id.loc.gov/ontologies/bflc/PrimaryContribution"/>\n'
		 		}else{
		 			var role = author_record['0']["role"]
		 			contributionText += '                <bf:role>\n                    <bf:Role rdf:about="http://id.loc.gov/vocabulary/relators/' + role + '"/>\n                </bf:role>\n                <bf:agent>\n                    <bf:Agent rdf:about="' + author_record['0']['lc'] +'">\n'+'                        <rdf:type rdf:resource="http://id.loc.gov/ontologies/bibframe/Person"/>\n						<rdfs:label>';
		 		};
		 		contributionText += escapeXml(latinname);
		 		for (var i = 0; i < author_record['0']['subbd'].length; i++) {
		 			if (author_record['0']['subbd'][i]){
		 				contributionText += " "
		 				contributionText += escapeXml(author_record['0']['subbd'][i]);
		 			}
		 		}
		 		contributionText = contributionText.replace(/,\s*$/, "");
		 		contributionText += '</rdfs:label>\n'
		 		if (author_record['1']['family']!= ""){
		 			contributionText += '						<rdfs:label>' + author_record['1']['family'] + '</rdfs:label>\n'
		 		}
		 		contributionText += '						<bf:identifiedBy>\n                            <bf:Identifier>\n                                <rdf:value rdf:resource="' + author_record[0]['viaf'] + '"/>\n                            </bf:Identifier>\n' + '						</bf:identifiedBy>\n'
		 		contributionText += '						<bf:identifiedBy>\n                            <bf:Identifier>\n                                <rdf:value rdf:resource="' + author_record[0]['lc'] + '"/>\n                            </bf:Identifier>\n' + '						</bf:identifiedBy>\n'

		 		contributionText += '                    </bf:Agent>\n                </bf:agent>\n            </bf:Contribution>\n        </bf:contribution>\n';
		 		return contributionText;
 			}else{
 				var contributionText = '        <bf:contribution>\n            <bf:Contribution>\n';
		 		if (author_record['0']['role'] == 0){
		 			contributionText += '                <rdf:type rdf:resource="http://id.loc.gov/ontologies/bflc/PrimaryContribution"/>\n'
		 		}else{
		 			var role = author_record['0']["role"]
		 			contributionText += '                <bf:role>\n                    <bf:Role rdf:about="http://id.loc.gov/vocabulary/relators/' + role + '"/>\n                </bf:role>\n                <bf:agent>\n                    <bf:Agent rdf:about="' + author_record['0']['viaf'] +'">\n'+'                         <rdf:type rdf:resource="http://id.loc.gov/ontologies/bibframe/Person"/>\n						<rdfs:label>';
		 		};
		 		contributionText += escapeXml(latinname);
		 		
		 		contributionText = contributionText.replace(/,\s*$/, "");
		 		contributionText += '</rdfs:label>\n'
		 		if (author_record['1']['family']!= ""){
		 			contributionText += '						<rdfs:label>' + author_record['1']['family'] + '</rdfs:label>\n'
		 		}
		 		// contributionText += '						<bf:identifiedBy>\n                            <bf:Identifier>\n                                <rdf:value rdf:resource="' + author_record[0]['viaf'] + '"/>\n                            </bf:Identifier>\n' + '                                </bf:identifiedBy>\n'
		 		contributionText += '                    </bf:Agent>\n                </bf:agent>\n            </bf:Contribution>\n        </bf:contribution>\n';
		 		return contributionText;			
 			}
 		}else{
 			return ""
 		}
 	}
}

/*
 * Build a BIBFRAME record. Each DOM object is saved as a string, then all the strings are combined into one master text
 *
 * record: 			 object containing the user-input data
 * institution_info: object containing name of institution creating record
 */
 function downloadBIBFRAME(record,institution_info) {
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

 	var startText = '<?xml version="1.0" encoding="UTF-8"?>\n<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"\n    xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#"\n    xmlns:bf="http://id.loc.gov/ontologies/bibframe/"\n    xmlns:bflc="http://id.loc.gov/ontologies/bflc/"\n    xmlns:madsrdf="http://www.loc.gov/mads/rdf/v1#">\n';

 	var adminText = '    <bf:AdminMetadata>\n        <bflc:encodingLevel>\n            <bflc:EncodingLevel rdf:about="http://id.loc.gov/vocabulary/menclvl/7"/>\n        </bflc:encodingLevel>\n        <bf:descriptionLanguage>\n            <bf:Language rdf:about="http://id.loc.gov/vocabulary/languages/eng"/>\n        </bf:descriptionLanguage>\n        <bf:descriptionConventions>\n            <bf:DescriptionConventions rdf:about="http://id.loc.gov/vocabulary/descriptionConventions/rda"/>\n        </bf:descriptionConventions>\n        <bf:generationProcess>\n            <bf:GenerationProcess>\n                <rdfs:label>Metadata Maker v1.1, BIBFRAME 2.0 RDFXML; ';

 	var today = new Date();
 	var date = {
 		yyyy: today.getFullYear(),
 		mm: today.getMonth()+1,
 		dd: today.getDate(),
 		hh: today.getHours(),
 		minutes: today.getMinutes(),
 		ss: today.getSeconds()
 	};

 	adminText += date.yyyy + '-' + date.mm + '-' + date.dd + 'T' + date.hh + ':' + date.minutes + ':' + date.ss + '</rdfs:label>\n            </bf:GenerationProcess>\n        </bf:generationProcess>\n    </bf:AdminMetadata>\n';

 	var workText = '    <bf:Work rdf:about="http://example.org/d0e1#Work">\n';

 	var genreText = '';
 	if (checkExists(record.literature_yes) && checkExists(record.literature_dropdown)) {
 		genreText += '        <bf:genreForm>\n                        <bf:GenreForm>\n                <rdfs:label>' + literatureTypes[record.literature_dropdown] + '</rdfs:label>\n                    </bf:GenreForm>\n        </bf:genreForm>\n';
 	}
 	
	var authorText = '';
	authorText = fillAuthorBIBFRAME(record.author);
	

 	if (checkExists(record.additional_authors)) {
 		for (var i = 0; i < record.additional_authors.length; i++) {
 			authorText  += fillAuthorAdditionalBIBFRAME(record.additional_authors[i]);
 		}
 	}

 	var titleText = '        <bf:title>\n            <bf:Title>\n                <bf:mainTitle>' + escapeXml(record.title[0]['title']) + '</bf:mainTitle>\n';
 	if (checkExists(record.title[0]['subtitle'])) {
 		titleText += '                <bf:subtitle>' + escapeXml(record.title[0]['subtitle']) + '</bf:subtitle>\n';
 	}
 	titleText += '            </bf:Title>\n        </bf:title>\n';


	var subjectText = '';
	//keywordshtml
	// console.log(record);
	if (checkExists(record.keywords)) {
		if (record.keywords[0]!=''){
			for (var i = 0; i < record.keywords.length; i++){
			subjectText += '        <bf:subject>\n            <bf:Topic rdf:about="' + escapeXml(record.keywordshtml[i]) + '">\n                <rdfs:label>'+escapeXml(record.keywords[i])+'</rdfs:label>\n                <rdf:type rdf:resource="http://www.loc.gov/mads/rdf/v1#Topic"/>\n                <bf:source>\n                    <bf:Source rdf:about="http://id.loc.gov/vocabulary/identifiers/fast"/>\n                </bf:source>\n            </bf:Topic>\n        </bf:subject>\n';
			}
		}
	}
	//lcshuri
	if (checkExists(record.lcshvalue)) {
		for (var c = 0; c < record.lcshvalue.length; c++){
			subjectText += '        <bf:subject>\n            <bf:Topic rdf:about="' + escapeXml(record.lcshuri[c]) + '">\n                <rdfs:label>'+escapeXml(record.lcshvalue[c])+'</rdfs:label>\n                <rdf:type rdf:resource="http://www.loc.gov/mads/rdf/v1#Topic"/>\n                <bf:source>\n                    <bf:Source rdf:about="http://id.loc.gov/authorities/subjects"/>\n                </bf:source>\n            </bf:Topic>\n        </bf:subject>\n';
	
		}
	}

	var workEndText = '        <bf:hasInstance rdf:resource="http://example.org/d0e1#Instance"/>\n    </bf:Work>\n';


	var instanceText = '';

	instanceText = '    <bf:Instance rdf:about="http://example.org/d0e1#Instance">\n        <rdf:type rdf:resource="http://id.loc.gov/ontologies/bibframe/Text"/>\n        <bf:issuance>\n            <bf:Issuance rdf:about="http://id.loc.gov/vocabulary/issuance/mono"/>\n        </bf:issuance>\n';

	if (checkExists(record.edition)) {
		instanceText += '        <bf:editionStatement>' + escapeXml(record.edition) + '</bf:editionStatement>\n';
	}

	var languageText = '        <bf:language>\n            <bf:Language rdf:about="http://id.loc.gov/vocabulary/languages/' + record.language + '"/>\n        </bf:language>\n';

	if (checkExists(record.copyright_year)) {
		instanceText += '        <bf:copyrightDate rdf:datatype="http://id.loc.gov/datatypes/edtf">' + record.copyright_year + '</bf:copyrightDate>\n';
	}

	if (checkExists(record.illustrations_yes)) {
		instanceText += '        <bf:illustrativeContent>\n            <bf:Illustration rdf:about="http://id.loc.gov/vocabulary/millus/ill"/>\n        </bf:illustrativeContent>\n';
	}

	if (checkExists(record.isbn)) {
		instanceText += '    	<bf:identifiedBy>\n            <bf:Isbn>\n                <rdf:value>' + record.isbn + '</rdf:value>\n            </bf:Isbn>\n        </bf:identifiedBy>\n';
	}

	instanceText += '        <bf:title>\n            <bf:Title>\n                <bf:mainTitle>' + escapeXml(record.title[0]['title']) + '</bf:mainTitle>\n';
	if (checkExists(record.title[0]['subtitle'])) {
		instanceText += '                <bf:subTitle>' + escapeXml(record.title[0]['subtitle']) + '</bf:subTitle>\n';
	}
	instanceText += '            </bf:Title>\n        </bf:title>\n';

	var provisionText ='';
	if (checkExists(record.publication_country) || checkExists(record.publication_place) || checkExists(record.publisher) || checkExists(record.publication_year) || checkExists(record.copyright_year) || checkExists(record.edition)) {
		provisionText += '        <bf:provisionActivity>\n            <bf:ProvisionActivity>\n                <rdf:type rdf:resource="http://id.loc.gov/ontologies/bibframe/Publication"/>\n';

		if (checkExists(record.publication_place)) {
			provisionText += '                <bf:place>\n                    <bf:Place>\n            			<rdfs:label>' + escapeXml(record.publication_place) + '</rdfs:label>\n                    </bf:Place>\n                </bf:place>\n';
		}

		if (checkExists(record.publication_country)) {
			provisionText += '                <bf:place>\n                    <bf:Place rdf:about="http://id.loc.gov/vocabulary/countries/' + record.publication_country + '"/>\n                </bf:place>\n';
		}

		if (checkExists(record.publisher)) {
			provisionText += '                <bf:agent>\n                    <bf:Agent>\n                        <rdfs:label>' + escapeXml(record.publisher) + '</rdfs:label>\n                    </bf:Agent>\n                </bf:agent>\n';
		}

		if (checkExists(record.publication_year)) {
			provisionText += '                <bf:date>' + record.publication_year + '</bf:date>\n';
		}

		provisionText += '            </bf:ProvisionActivity>\n        </bf:provisionActivity>\n';
	}

	instanceText += provisionText;


	var pagesText = '';
	if (checkExists(record.pages)) {
		pagesText += '        <bf:extent>' + record.pages + ' ' + record.volume_or_page + '</bf:extent>\n';
	}
	instanceText += pagesText;

	instanceText += '        <bf:dimensions>' + record.dimensions + ' cm</bf:dimensions>\n'

	instanceText += '        <bf:media>\n            <bf:Media rdf:about="http://id.loc.gov/vocabulary/mediaTypes/n"/>\n        </bf:media>\n        <bf:content>\n            <bf:Content rdf:about="http://id.loc.gov/vocabulary/contentTypes/txt"/>\n        </bf:content>\n        <bf:carrier>\n            <bf:Carrier rdf:about="http://id.loc.gov/vocabulary/carriers/nc"/>\n        </bf:carrier>\n        <bf:instanceOf rdf:resource="http://example.org/d0e1#Work"/>\n    </bf:Instance>\n';

	var endText = '</rdf:RDF>';

	var text = startText + adminText + workText + genreText + authorText + titleText + subjectText + workEndText + instanceText+ endText;
	downloadFile(text,'bibframe');
}

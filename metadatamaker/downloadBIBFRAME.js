function buildAdminMetadata(doc) {
 	const adminMetadataEl = doc.createElement("bf:adminMetadata");
 	const AdminMetadataEl = doc.createElement("bf:AdminMetadata");

 	//Encoding Level
 	const encodingLevelEl = doc.createElement("bflc:encodingLevel");
 	const EncodingLevelEl = doc.createElement("bflc:EncodingLevel");
 	EncodingLevelEl.setAttribute("rdf:about","http://id.loc.gov/vocabulary/menclvl/7");
 	encodingLevelEl.appendChild(EncodingLevelEl);
 	AdminMetadataEl.appendChild(encodingLevelEl);

 	//Description Language
 	const descriptionLanguageEl = doc.createElement("bf:descriptionLanguage");
 	const admin_languageEl = doc.createElement("bf:Language");
 	admin_languageEl.setAttribute("rdf:about","http://id.loc.gov/vocabulary/languages/eng");
 	descriptionLanguageEl.appendChild(admin_languageEl);
 	AdminMetadataEl.appendChild(descriptionLanguageEl);

 	//Description Conventions
 	const descriptionConventionsEl = doc.createElement("bf:descriptionConventions");
 	const DescriptionConventionsEl = doc.createElement("bf:DescriptionConventions");
 	DescriptionConventionsEl.setAttribute("rdf:about","http://id.loc.gov/vocabulary/descriptionConventions/rda");
 	descriptionConventionsEl.appendChild(DescriptionConventionsEl);
 	AdminMetadataEl.appendChild(descriptionConventionsEl);

 	//Generation Process
 	const today = new Date();
 	const generationProcessEl = doc.createElement("bf:generationProcess");
 	const GenerationProcessEl = doc.createElement("bf:GenerationProcess");
 	const genProcessLabelEl = doc.createElement("rdfs:label");
 	const genProcessLabelText = doc.createTextNode(`Metadata Maker v1.2, BIBFRAME 2.0 RDFXML; ${today.toISOString()}`);
 	genProcessLabelEl.appendChild(genProcessLabelText);
 	GenerationProcessEl.appendChild(genProcessLabelEl);
 	generationProcessEl.appendChild(GenerationProcessEl);
 	AdminMetadataEl.appendChild(generationProcessEl);

 	adminMetadataEl.appendChild(AdminMetadataEl);
	return adminMetadataEl;
}

function addTitle(doc,record) {

}

function buildContributor(doc,contributor,primary=false) {
	const primary_source = contributor[0]['lc'] !="" ? 'lc' : (contributor[0]['viaf'] !="" ? 'viaf' : 'wiki');
 	const role_index = { 'art': 'artist', 'aut': 'author', 'ctb': 'contributor', 'edt': 'editor', 'ill': 'illustrator', 'trl': 'translator'};

 	const contributionEl = doc.createElement("bf:contribution");
 	const ContributionEl = doc.createElement("bf:Contribution");

 	//Primary Contributor
 	if (primary) {
 		const contributorTypeEl = doc.createElement("rdf:type");
 		contributorTypeEl.setAttribute("rdf:resource","http://id.loc.gov/ontologies/bflc/PrimaryContribution");
 		ContributionEl.appendChild(contributorTypeEl);
 	}

 	//Agent
 	const agentEl = doc.createElement("bf:agent");
 	const AgentEl = doc.createElement("bf:Agent");
	console.log(primary_source);
	console.log(contributor[0]);
	console.log(contributor[0][primary_source])
	console.log(contributor[0][primary_source].length > 0)
	console.log(escapeXML(contributor[0][primary_source]))
	if (contributor[0][primary_source].length > 0) {
		AgentEl.setAttribute("rdf:about",escapeXML(contributor[0][primary_source]))
	}

 	//Person
 	const agentTypeEl = doc.createElement("rdf:type");
 	agentTypeEl.setAttribute("rdf:resource","http://id.loc.gov/ontologies/bibframe/Person");
 	AgentEl.appendChild(agentTypeEl);

 	//Label
 	const agentLabelTextValue = escapeXML(contributor[0]['family']);
 	if (agentLabelTextValue) {
 		const agentLabelEl = doc.createElement("rdfs:label");
 		const agentLabelText = doc.createTextNode(agentLabelTextValue);
 		agentLabelEl.appendChild(agentLabelText);
 		AgentEl.appendChild(agentLabelEl);
 	}

	//Identifiers
	const id_sources = ['lc','viaf','wiki'];
	for (id_source in id_sources) {
		if (escapeXML(contributor[0][id_sources[id_source]]) != '') {
			const identifiedByEl = doc.createElement("bf:identifiedBy");
			const IdentifierEl = doc.createElement("bf:Identifier");
			const identifierValueEl = doc.createElement("rdf:value");
			identifierValueEl.setAttribute("rdf:resource",escapeXML(contributor[0][id_sources[id_source]]));
			IdentifierEl.appendChild(identifierValueEl);
			identifiedByEl.appendChild(IdentifierEl);
			AgentEl.appendChild(identifiedByEl);
		}
	}
 	agentEl.appendChild(AgentEl);
 	ContributionEl.appendChild(agentEl);

 	//Role
 	const roleCode = contributor[0]['role'];
 	const roleEl = doc.createElement("bf:role");
 	const RoleEl = doc.createElement("bf:Role");
 	RoleEl.setAttribute("rdf:about",`http://id.loc.gov/vocabulary/relators/${roleCode}`);
 	const roleLabelEl = doc.createElement("rdfs:label");
 	const roleLabelText = doc.createTextNode(role_index[roleCode]);
 	roleLabelEl.appendChild(roleLabelText);
 	RoleEl.appendChild(roleLabelEl);
 	const codeEl = doc.createElement("bf:code");
 	const codeText = doc.createTextNode(roleCode);
 	codeEl.appendChild(codeText);
 	RoleEl.appendChild(codeEl);
 	roleEl.appendChild(RoleEl);
 	ContributionEl.appendChild(roleEl);

 	contributionEl.appendChild(ContributionEl);
	return contributionEl;
// 	workEl.appendChild(contributionEl);
}

/*
 * Build a BIBFRAME record. Each DOM object is saved as a string, then all the strings are combined into one master text
 *
 * record: 			 object containing the user-input data
 * institution_info: object containing name of institution creating record
 */
function downloadBIBFRAME(record,institution_info) {
	const literatureTypes = {
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

	const fastTypes = {
		'100': 'Agent',
		'110': 'Agent',
		'111': 'Meeting',
		'130': 'Topic',
		'147': 'Event',
		'148': 'Temporal',
		'150': 'Topic',
		'151': 'GeographicCoverage',
		'155': 'GenreForm',
		'162': 'MediumOfPerformance',
		'180': 'Topic',
		'181': 'GeographicCoverage',
		'182': 'Temporal',
		'185': 'GenreForm'
	}

	const madsTypes = {
		'Agent': 'Topic',
		'Meeting': 'Topic',
		'Topic': 'Topic',
		'Event': 'Topic',
		'Temporal': 'Temporal',
		'GeographicCoverage': 'Georaphic',
		'GenreForm': 'GenreForm',
		'MediumOfPerformance': 'Medium'
	}

 	const id = crypto.randomUUID();
 	const startText = '<?xml version="1.0" encoding="UTF-8"?>\n<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#" xmlns:bf="http://id.loc.gov/ontologies/bibframe/" xmlns:bflc="http://id.loc.gov/ontologies/bflc/" xmlns:madsrdf="http://www.loc.gov/mads/rdf/v1#">\n</rdf:RDF>';
 	const parser = new DOMParser();
 	const doc = parser.parseFromString(startText, "application/xml");

 	//Work
 	const workEl = doc.createElement("bf:Work");
 	workEl.setAttribute("rdf:about",`http://example.org/${id}#Work`);

 	const hasInstanceEl = doc.createElement("bf:hasInstance");
 	hasInstanceEl.setAttribute("rdf:resource",`http://example.org/${id}#Instance`);

 	//Instance
 	const instanceEl = doc.createElement("bf:Instance");
 	instanceEl.setAttribute("rdf:about",`http://example.org/${id}#Instance`);

 	const instanceOfEl = doc.createElement("bf:instanceOf");
 	instanceOfEl.setAttribute("rdf:resource",`http://example.org/${id}#Work`);

 	//Admin Metadata
 	workEl.appendChild(buildAdminMetadata(doc));

 	//Title
 	const titleEl = doc.createElement("bf:title");
 	const TitleEl = doc.createElement("bf:Title");
 	const mainTitleEl = doc.createElement("bf:mainTitle");
 	const MainTitleText = doc.createTextNode(escapeXML(cleanTitleText(record.title[0]['title'])));
 	mainTitleEl.appendChild(MainTitleText);
 	TitleEl.appendChild(mainTitleEl);

 	//Subtitle
 	if (checkExists(record.title[0]['subtitle'])) {
 		worksubtitleEl = doc.createElement("bf:subtitle");
 		worksubtitleText = doc.createTextNode(escapeXML(cleanTitleText(record.title[0]['subtitle'])));
 		worksubtitleEl.appendChild(worksubtitleText);
 		TitleEl.appendChild(worksubtitleEl);
 	}
 	titleEl.appendChild(TitleEl);

 	//Transliterated Title
 	if (checkExists(record.title[1]['title'])) {
 		const TransliteratedTitleEl = doc.createElement("bf:TransliteratedTitle");
	 	const transliteratedmainTitleEl = doc.createElement("bf:mainTitle");
	 	const transliteratedmainTitleText = doc.createTextNode(escapeXML(cleanTitleText(record.title[1]['title'])));
	 	transliteratedmainTitleEl.appendChild(transliteratedmainTitleText);
	 	TransliteratedTitleEl.appendChild(transliteratedmainTitleEl);

	 	//Transliterated Subtitle
	 	if (checkExists(record.title[1]['subtitle'])) {
	 		const transliteratedsubtitleEl = doc.createElement("bf:subtitle");
	 		const transliteratedsubtitleText = doc.createTextNode(escapeXML(cleanTitleText(record.title[1]['subtitle'])));
	 		transliteratedsubtitleEl.appendChild(transliteratedsubtitleText);
	 		TransliteratedTitleEl.appendChild(transliteratedsubtitleEl);
	 	}

	 	titleEl.appendChild(TransliteratedTitleEl);
 	}
 	
 	workEl.appendChild(titleEl);
 	instancetitleEl = titleEl.cloneNode(true);
 	instanceEl.appendChild(instancetitleEl);

 	//Language
 	const languageEl = doc.createElement("bf:language");
 	const LanguageEl = doc.createElement("bf:Language");
 	LanguageEl.setAttribute("rdf:about",`http://id.loc.gov/vocabulary/languages/${record.language}`);
 	languageEl.appendChild(LanguageEl);
 	workEl.appendChild(languageEl);

 	//Edition
 	if (checkExists(record.edition)) {
 		const editionStatementEl = doc.createElement("bf:editionStatement");
 		const editionStatementText = doc.createTextNode(escapeXML(record.edition));
 		editionStatementEl.appendChild(editionStatementText);
 		instanceEl.appendChild(editionStatementEl);
 	}

 	//ISBN
 	if (checkExists(record.isbn)) {
 		const isbnidentifiedByEl = doc.createElement("bf:identifiedBy");
 		const isbnEl = doc.createElement("bf:Isbn");
 		const isbnValeEl = doc.createElement("rdf:value");
 		const isbnValText = doc.createTextNode(record.isbn);
 		isbnValeEl.appendChild(isbnValText);
 		isbnEl.appendChild(isbnValeEl);
 		isbnidentifiedByEl.appendChild(isbnEl);
 		instanceEl.appendChild(isbnidentifiedByEl);
 	}

 	//Contributors
	console.log(record.author);
 	workEl.appendChild(buildContributor(doc,record.author,true));
 	if (checkExists(record.additional_authors)) {
 		for (let i = 0; i < record.additional_authors.length; i++) {
 			workEl.appendChild(buildContributor(doc,record.additional_authors[i]));
 		}
 	}

 	//Provision Activity
 	if (checkExists(record.publication_country) || checkExists(record.publication_place) || checkExists(record.publisher) || checkExists(record.publication_year)) {
 		const provisionActivityEl = doc.createElement("bf:provisionActivity");
 		const ProvisionActivityEl = doc.createElement("bf:ProvisionActivity");
 		const provisionActivityTypeEl = doc.createElement("rdf:type");
 		provisionActivityTypeEl.setAttribute("rdf:resource","http://id.loc.gov/ontologies/bibframe/Publication");
 		ProvisionActivityEl.appendChild(provisionActivityTypeEl);

 		//Publication Date
 		if (checkExists(record.publication_year)) {
 			const dateEl = doc.createElement("bf:date");
 			dateEl.setAttribute("rdf:datatype","http://id.loc.gov/datatypes/edtf");
 			const dateText = doc.createTextNode(record.publication_year);
 			dateEl.appendChild(dateText);
 			ProvisionActivityEl.appendChild(dateEl);
 		}

 		//Publication Place
 		if (checkExists(record.publication_place)) {
 			const placeEl = doc.createElement("bf:place");
 			const PlaceEl = doc.createElement("bf:Place");
 			const placeLabelEl = doc.createElement("rdfs:label");
 			const placeLabelText = doc.createTextNode(escapeXML(record.publication_place));
 			placeLabelEl.appendChild(placeLabelText);
 			PlaceEl.appendChild(placeLabelEl);
 			placeEl.appendChild(PlaceEl);
 			ProvisionActivityEl.appendChild(placeEl);
 		}

 		//Publication Country/State/Province
 		if (checkExists(record.publication_country)) {
 			const countryplaceEl = doc.createElement("bf:place");
 			const countryPlaceEl = doc.createElement("bf:Place");
 			countryPlaceEl.setAttribute("rdf:about",`http://id.loc.gov/vocabulary/countries/${record.publication_country.code}`);
 			const countryLabelEl = doc.createElement("rdfs:label");
 			const countryLabelText = doc.createTextNode(record.publication_country.text);
 			countryLabelEl.appendChild(countryLabelText);
 			countryLabelEl.setAttribute("xml:lang","en");
 			countryPlaceEl.appendChild(countryLabelEl);
 			countryplaceEl.appendChild(countryPlaceEl);
 			ProvisionActivityEl.appendChild(countryplaceEl);
 		}

 		//Publisher Name
 		if (checkExists(record.publisher)) {
 			const provisionActivityagentEl = doc.createElement("bf:agent");
 			const provisionActivityAgentEl = doc.createElement("bf:Agent");
 			const provisionActivityagentLabelEl = doc.createElement("rdfs:label");
 			const provisionActivityagentLabelText = doc.createTextNode(escapeXML(record.publisher));
 			provisionActivityagentLabelEl.appendChild(provisionActivityagentLabelText);
 			provisionActivityAgentEl.appendChild(provisionActivityagentLabelEl);
 			provisionActivityagentEl.appendChild(provisionActivityAgentEl);
 			ProvisionActivityEl.appendChild(provisionActivityagentEl);
 		}


 		provisionActivityEl.appendChild(ProvisionActivityEl);
 		instanceEl.appendChild(provisionActivityEl);
 	}

 	//Copyright Date
 	if (checkExists(record.copyright_year)) {
 		const copyrightDateEl = doc.createElement("bf:copyrightDate");
 		copyrightDateEl.setAttribute("rdf:datatype","http://id.loc.gov/datatypes/edtf");
 		const copyrightDateText = doc.createTextNode(record.copyright_year);
 		copyrightDateEl.appendChild(copyrightDateText);
 		instanceEl.appendChild(copyrightDateEl);
 	}

 	//Dimensions
 	const dimensionsEl = doc.createElement("bf:dimensions");
 	const dimensionsText = doc.createTextNode(`${escapeXML(record.dimensions.trim())} cm`);
 	dimensionsEl.appendChild(dimensionsText);
 	instanceEl.appendChild(dimensionsEl);

 	//Pages/Volumes
	const extentEl = doc.createElement("bf:extent");
	const ExtentEl = doc.createElement("bf:Extent");
	const extentLabelEl = doc.createElement("rdfs:label");
	const extentLabelText = doc.createTextNode(`${escapeXML(record.pages)} ${record.volume_or_page}`);
	extentLabelEl.appendChild(extentLabelText);
	ExtentEl.appendChild(extentLabelEl);
	extentEl.appendChild(ExtentEl);
	instanceEl.appendChild(extentEl);

 	//Genre
 	if (record.literature_yes && checkExists(record.literature_dropdown)) {
 		const genreFormEl = doc.createElement("bf:genreForm");
 		const GenreFormEl = doc.createElement("bf:GenreForm");
 		const genreFormLabelEl = doc.createElement("rdfs:label");
 		const genreFormLabelText = doc.createTextNode(literatureTypes[record.literature_dropdown]);
 		genreFormLabelEl.appendChild(genreFormLabelText);
 		GenreFormEl.appendChild(genreFormLabelEl);
 		genreFormEl.appendChild(GenreFormEl);
 		workEl.appendChild(genreFormEl);
 	}

 	//Illustrations
 	if (record.illustrations_yes) {
 		const illustrativeContentEl = doc.createElement("bf:illustrativeContent");
 		const IllustrationEl = doc.createElement("bf:Illustration");
 		IllustrationEl.setAttribute("rdf:about","http://id.loc.gov/vocabulary/millus/ill");
 		illustrativeContentEl.appendChild(IllustrationEl);
 		instanceEl.appendChild(illustrativeContentEl);
 	}

 	//Keywords
 	for (let k = 0; k < record.fast.length; k++) {
 		const subjectEl = doc.createElement("bf:subject");
 		const classString = record.fast[k][2] in fastTypes ? fastTypes[record.fast[k][2]] : "Topic"
 		const TopicEl = doc.createElement(`bf:${classString}`);
 		TopicEl.setAttribute("rdf:about",`http://id.worldcat.org/fast/${record.fast[k][1]}`);
 		//Type
 		const TopicTypeEl = doc.createElement("rdf:type");
 		TopicTypeEl.setAttribute("rdf:resource",`http://www.loc.gov/mads/rdf/v1#${madsTypes[classString]}`)
 		TopicEl.appendChild(TopicTypeEl);
 		//Label
		const TopicLabelEl = doc.createElement("rdfs:label");
		const TopicLabelText = doc.createTextNode(record.fast[k][0]);
		TopicLabelEl.appendChild(TopicLabelText);
		TopicEl.appendChild(TopicLabelEl);
		//Source
		const TopicsourceEl = doc.createElement("bf:source");
		const TopicSourceEl = doc.createElement("bf:Source");
		TopicSourceEl.setAttribute("rdf:about","http://id.loc.gov/vocabulary/identifiers/fast");
		const TopicsourcecodeEl = doc.createElement("bf:code");
		const TopicsourcecodeText = doc.createTextNode("fast");
		TopicsourcecodeEl.appendChild(TopicsourcecodeText);
		TopicSourceEl.appendChild(TopicsourcecodeEl);
		TopicsourceEl.appendChild(TopicSourceEl);
		TopicEl.appendChild(TopicsourceEl);
		subjectEl.appendChild(TopicEl);
		workEl.appendChild(subjectEl);
 	}

 	for (let k = 0; k < record.keywords.length; k++) {
 		const subjectEl = doc.createElement("bf:subject");
 		const TopicEl = doc.createElement("bf:Topic");
 		const TopicTypeEl = doc.createElement("rdf:type");
 		TopicTypeEl.setAttribute("rdf:resource","http://www.loc.gov/mads/rdf/v1#Topic");
 		TopicEl.appendChild(TopicTypeEl);
 		const TopicLabelEl = doc.createElement("rdfs:label");
 		const TopicLabelText = doc.createTextNode(escapeXML(record.keywords[k]));
 		TopicLabelEl.appendChild(TopicLabelText);
 		TopicEl.appendChild(TopicLabelEl);
 		subjectEl.appendChild(TopicEl);
 		workEl.appendChild(subjectEl);
 	}

 	//Media Type
 	const mediaEl = doc.createElement("bf:media");
 	const MediaEl = doc.createElement("bf:Media");
 	MediaEl.setAttribute("rdf:about","http://id.loc.gov/vocabulary/mediaTypes/n");
 	const MediaLabelEl = doc.createElement("rdfs:label");
 	const MediaLabelText = doc.createTextNode("unmediated");
 	MediaLabelEl.appendChild(MediaLabelText);
 	MediaEl.appendChild(MediaLabelEl);
 	const MediaCodeEl = doc.createElement("bf:code");
 	const MediaCodeText = doc.createTextNode("n");
 	MediaCodeEl.appendChild(MediaCodeText);
 	MediaEl.appendChild(MediaCodeEl);
 	mediaEl.appendChild(MediaEl);
 	instanceEl.appendChild(mediaEl);

 	//Carrier Type
 	const carrierEl = doc.createElement("bf:carrier");
 	const CarrierEl = doc.createElement("bf:Carrier");
 	CarrierEl.setAttribute("rdf:about","http://id.loc.gov/vocabulary/carriers/nc");
 	const CarrierLabelEl = doc.createElement("rdfs:label");
 	const CarrierLabelText = doc.createTextNode("volume");
 	CarrierLabelEl.appendChild(CarrierLabelText);
 	CarrierEl.appendChild(CarrierLabelEl);
 	const CarrierCodeEl = doc.createElement("bf:code");
 	const CarrierCodeText = doc.createTextNode("nc");
 	CarrierCodeEl.appendChild(CarrierCodeText);
 	CarrierEl.appendChild(CarrierCodeEl);
 	carrierEl.appendChild(CarrierEl);
 	instanceEl.appendChild(carrierEl);

 	//Issuance
 	const issuanceEl = doc.createElement("bf:issuance");
 	const IssuanceEl = doc.createElement("bf:Issuance");
 	IssuanceEl.setAttribute("rdf:about","http://id.loc.gov/vocabulary/issuance/mono");
 	const IssuanceLabelEl = doc.createElement("rdfs:label");
 	const IssuanceLabelText = doc.createTextNode("single unit");
 	IssuanceLabelEl.appendChild(IssuanceLabelText);
 	IssuanceEl.appendChild(IssuanceLabelEl);
 	const IssuanceCodeEl = doc.createElement("bf:code");
 	const IssuanceCodeText = doc.createTextNode("mono");
 	IssuanceCodeEl.appendChild(IssuanceCodeText);
 	IssuanceEl.appendChild(IssuanceCodeEl);
 	issuanceEl.appendChild(IssuanceEl);
 	instanceEl.appendChild(issuanceEl);

 	if (record.bibliographies_yes) {
 		const noteEl = doc.createElement("bf:note");
 		const NoteEl = doc.createElement("bf:Note");
 		const NoteTypeEl = doc.createElement("rdf:type");
 		NoteTypeEl.setAttribute("rdf:resource","http://id.loc.gov/vocabulary/mnotetype/biblio");
 		NoteEl.appendChild(NoteTypeEl);
 		const NoteLabelEl = doc.createElement("rdfs:label");
 		const NoteLabelText = doc.createTextNode("Includes bibliographical references and index.");
 		NoteLabelEl.appendChild(NoteLabelText);
 		NoteEl.appendChild(NoteLabelEl);
 		noteEl.appendChild(NoteEl);
 		workEl.appendChild(noteEl);
 	}

 	workEl.appendChild(hasInstanceEl);
 	instanceEl.appendChild(instanceOfEl);
 	doc.getElementsByTagName("rdf:RDF")[0].appendChild(workEl);
 	doc.getElementsByTagName("rdf:RDF")[0].appendChild(instanceEl);

	const serializer = new XMLSerializer();
	downloadFile(serializer.serializeToString(doc),'bibframe');
}
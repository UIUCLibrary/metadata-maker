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

function buildTitle(doc,record) {
	//Title
 	const titleEl = doc.createElement("bf:title");
 	const TitleEl = doc.createElement("bf:Title");
 	const mainTitleEl = doc.createElement("bf:mainTitle");
 	const MainTitleText = doc.createTextNode(escapeXML(cleanTitleText(record.title[0]['title'])));
 	mainTitleEl.appendChild(MainTitleText);
 	TitleEl.appendChild(mainTitleEl);

 	//Subtitle
 	if (checkExists(record?.title[0]['subtitle'])) {
 		worksubtitleEl = doc.createElement("bf:subtitle");
 		worksubtitleText = doc.createTextNode(escapeXML(cleanTitleText(record.title[0]['subtitle'])));
 		worksubtitleEl.appendChild(worksubtitleText);
 		TitleEl.appendChild(worksubtitleEl);
 	}
 	titleEl.appendChild(TitleEl);

 	//Transliterated Title
 	if (checkExists(record?.title[1]['title'])) {
 		const TransliteratedTitleEl = doc.createElement("bf:TransliteratedTitle");
	 	const transliteratedmainTitleEl = doc.createElement("bf:mainTitle");
	 	const transliteratedmainTitleText = doc.createTextNode(escapeXML(cleanTitleText(record.title[1]['title'])));
	 	transliteratedmainTitleEl.appendChild(transliteratedmainTitleText);
	 	TransliteratedTitleEl.appendChild(transliteratedmainTitleEl);

	 	//Transliterated Subtitle
	 	if (checkExists(record?.title[1]['subtitle'])) {
	 		const transliteratedsubtitleEl = doc.createElement("bf:subtitle");
	 		const transliteratedsubtitleText = doc.createTextNode(escapeXML(cleanTitleText(record.title[1]['subtitle'])));
	 		transliteratedsubtitleEl.appendChild(transliteratedsubtitleText);
	 		TransliteratedTitleEl.appendChild(transliteratedsubtitleEl);
	 	}

	 	titleEl.appendChild(TransliteratedTitleEl);
 	}

	return titleEl;
}

function buildLanguage(doc,record) {
	const languageEl = doc.createElement("bf:language");
 	const LanguageEl = doc.createElement("bf:Language");
 	LanguageEl.setAttribute("rdf:about",`http://id.loc.gov/vocabulary/languages/${record.language}`);
 	languageEl.appendChild(LanguageEl);
	return languageEl;
}

function buildEdition(doc,record) {
	const editionStatementEl = doc.createElement("bf:editionStatement");
	const editionStatementText = doc.createTextNode(escapeXML(record.edition));
	editionStatementEl.appendChild(editionStatementText);
	return editionStatementEl;
}

function buildISBN(doc,record) {
	const isbnidentifiedByEl = doc.createElement("bf:identifiedBy");
	const isbnEl = doc.createElement("bf:Isbn");
	const isbnValeEl = doc.createElement("rdf:value");
	const isbnValText = doc.createTextNode(record.isbn);
	isbnValeEl.appendChild(isbnValText);
	isbnEl.appendChild(isbnValeEl);
	isbnidentifiedByEl.appendChild(isbnEl);
	return isbnidentifiedByEl;
}

function buildContributor(doc,contributor,primary=false) {
	const primary_source = contributor[0]['lc'] !="" ? 'lc' : (contributor[0]['viaf'] !="" ? 'viaf' : 'wiki');
 	const role_index = { 'art': 'artist', 'aut': 'author', 'cre': 'creator', 'ctb': 'contributor', 'edt': 'editor', 'ill': 'illustrator', 'trl': 'translator'};

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
	if (contributor[0][primary_source].length > 0) {
		AgentEl.setAttribute("rdf:about",escapeXML(contributor[0][primary_source]))
	}

 	//Type
 	const agentTypeEl = doc.createElement("rdf:type");
 	agentTypeEl.setAttribute("rdf:resource",`http://id.loc.gov/ontologies/bibframe/${'author' in contributor[0] ? 'Person' : 'Organization'}`);
 	AgentEl.appendChild(agentTypeEl);

 	//Label
 	const agentLabelTextValue = escapeXML(contributor[0]['author' in contributor[0] ? 'author' : 'corporate']);
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
}

function buildPublicationDate(doc,record) {
	const dateEl = doc.createElement("bf:date");
	dateEl.setAttribute("rdf:datatype","http://id.loc.gov/datatypes/edtf");
	const dateText = doc.createTextNode(record.publication_year);
	dateEl.appendChild(dateText);
	return dateEl;
}

function buildPublicationPlace(doc,record) {
	const placeEl = doc.createElement("bf:place");
	const PlaceEl = doc.createElement("bf:Place");
	const placeLabelEl = doc.createElement("rdfs:label");
	const placeLabelText = doc.createTextNode(escapeXML(record.publication_place));
	placeLabelEl.appendChild(placeLabelText);
	PlaceEl.appendChild(placeLabelEl);
	placeEl.appendChild(PlaceEl);
	return placeEl;
}

function buildPublicationCountry(doc,record) {
	const countryplaceEl = doc.createElement("bf:place");
	const countryPlaceEl = doc.createElement("bf:Place");
	countryPlaceEl.setAttribute("rdf:about",`http://id.loc.gov/vocabulary/countries/${record.publication_country.code}`);
	const countryLabelEl = doc.createElement("rdfs:label");
	const countryLabelText = doc.createTextNode(record.publication_country.text);
	countryLabelEl.appendChild(countryLabelText);
	countryLabelEl.setAttribute("xml:lang","en");
	countryPlaceEl.appendChild(countryLabelEl);
	countryplaceEl.appendChild(countryPlaceEl);
	return countryplaceEl;
}

function buildPublisher(doc,record) {
	const provisionActivityagentEl = doc.createElement("bf:agent");
	const provisionActivityAgentEl = doc.createElement("bf:Agent");
	const provisionActivityagentLabelEl = doc.createElement("rdfs:label");
	const provisionActivityagentLabelText = doc.createTextNode(escapeXML(record.publisher));
	provisionActivityagentLabelEl.appendChild(provisionActivityagentLabelText);
	provisionActivityAgentEl.appendChild(provisionActivityagentLabelEl);
	provisionActivityagentEl.appendChild(provisionActivityAgentEl);
	return provisionActivityagentEl;
}

function buildProvisionActivity(doc,record) {
	const provisionActivityEl = doc.createElement("bf:provisionActivity");
	const ProvisionActivityEl = doc.createElement("bf:ProvisionActivity");
	const provisionActivityTypeEl = doc.createElement("rdf:type");
	provisionActivityTypeEl.setAttribute("rdf:resource","http://id.loc.gov/ontologies/bibframe/Publication");
	ProvisionActivityEl.appendChild(provisionActivityTypeEl);

	//Publication Date
	if (checkExists(record?.publication_year)) {
		ProvisionActivityEl.appendChild(buildPublicationDate(doc,record));
	}

	//Publication Place
	if (checkExists(record?.publication_place)) {
		ProvisionActivityEl.appendChild(buildPublicationPlace(doc,record));
	}

	//Publication Country/State/Province
	if (checkExists(record?.publication_country)) {
		ProvisionActivityEl.appendChild(buildPublicationCountry(doc,record));
	}

	//Publisher Name
	if (checkExists(record?.publisher)) {
		ProvisionActivityEl.appendChild(buildPublisher(doc,record));
	}

	provisionActivityEl.appendChild(ProvisionActivityEl);
	return provisionActivityEl;
}

function buildCopyrightDate(doc,record) {
	const copyrightDateEl = doc.createElement("bf:copyrightDate");
	copyrightDateEl.setAttribute("rdf:datatype","http://id.loc.gov/datatypes/edtf");
	const copyrightDateText = doc.createTextNode(record.copyright_year);
	copyrightDateEl.appendChild(copyrightDateText);
	return copyrightDateEl;
}

function buildDimensions(doc,record) {
	const dimensionsEl = doc.createElement("bf:dimensions");
 	const dimensionsText = doc.createTextNode(`${escapeXML(record.dimensions.trim())} cm`);
 	dimensionsEl.appendChild(dimensionsText);
	return dimensionsEl;
}

function buildExtent(doc,extent_value) {
	const extentEl = doc.createElement("bf:extent");
	const ExtentEl = doc.createElement("bf:Extent");
	const extentLabelEl = doc.createElement("rdfs:label");
	const extentLabelText = doc.createTextNode(extent_value);
	extentLabelEl.appendChild(extentLabelText);
	ExtentEl.appendChild(extentLabelEl);
	extentEl.appendChild(ExtentEl);
	return extentEl;
}

function buildGenre(doc,record) {
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

	const genreFormEl = doc.createElement("bf:genreForm");
	const GenreFormEl = doc.createElement("bf:GenreForm");
	const genreFormLabelEl = doc.createElement("rdfs:label");
	const genreFormLabelText = doc.createTextNode(literatureTypes[record.literature_dropdown]);
	genreFormLabelEl.appendChild(genreFormLabelText);
	GenreFormEl.appendChild(genreFormLabelEl);
	genreFormEl.appendChild(GenreFormEl);
	return genreFormEl;
}

function buildIllustrations(doc) {
	const illustrativeContentEl = doc.createElement("bf:illustrativeContent");
	const IllustrationEl = doc.createElement("bf:Illustration");
	IllustrationEl.setAttribute("rdf:about","http://id.loc.gov/vocabulary/millus/ill");
	illustrativeContentEl.appendChild(IllustrationEl);
	return illustrativeContentEl
}

function buildSimpleBISACSubjects(doc,bisac_heading) {
	const subjectEl = doc.createElement("bf:subject");
	const TopicEl = doc.createElement("bf:Topic");
	const codeEl = doc.createElement("bf:code");
	const codeText = doc.createTextNode(bisac_heading['id_number']);
	codeEl.appendChild(codeText);
	TopicEl.appendChild(codeEl);
	//Source
	const TopicsourceEl = doc.createElement("bf:source");
	const TopicSourceEl = doc.createElement("bf:Source");
	TopicSourceEl.setAttribute("rdf:about","http://id.loc.gov/vocabulary/classSchemes/bisacsh");
	TopicsourceEl.appendChild(TopicSourceEl);
	TopicEl.appendChild(TopicsourceEl);
	subjectEl.appendChild(TopicEl);
	return subjectEl;
}

function buildComponent(doc,heading_text) {
	const TopicEl = doc.createElement("madsrdf:Topic");
	const authoritativeLabelEl = doc.createElement("madsrdf:authoritativeLabel");
	const authoritativeLabelText = doc.createTextNode(heading_text);
	authoritativeLabelEl.appendChild(authoritativeLabelText);
	TopicEl.appendChild(authoritativeLabelEl);
	return TopicEl;
}

function buildComplexBISACSubjects(doc,bisac_heading) {
	const subjectEl = doc.createElement("bf:subject");
	const TopicEl = doc.createElement("bf:Topic");
	const TopicTypeEl = doc.createElement("rdf:type");
	TopicTypeEl.setAttribute("rdf:resource","http://www.loc.gov/mads/rdf/v1#ComplexSubject");
	TopicEl.appendChild(TopicTypeEl);
	//Label
	const label_text = `${bisac_heading['root']}${bisac_heading['level1'] ? `--${bisac_heading['level1']}${bisac_heading['level2'] ? `--${bisac_heading['level2']}${bisac_heading['level3'] ? `--${bisac_heading['level3']}` : ''}` : ''}` : ''}`;
	const TopicLabelEl = doc.createElement("rdfs:label");
	const TopicLabelText = doc.createTextNode(label_text);
	TopicLabelEl.appendChild(TopicLabelText);
	TopicEl.appendChild(TopicLabelEl);
	const authoritativeLabelEl = doc.createElement("madsrdf:authoritativeLabel");
	const authoritativeLabelText = doc.createTextNode(label_text);
	authoritativeLabelEl.appendChild(authoritativeLabelText);
	TopicEl.appendChild(authoritativeLabelEl);
	//Component List
	const componentListEl = doc.createElement("madsrdf:componentList");
	componentListEl.setAttribute("rdf:parseType","Collection");
	componentListEl.appendChild(buildComponent(doc,bisac_heading['root']));
	['level1','level2','level3'].forEach((level) => {
		if (bisac_heading[level]) {
			componentListEl.appendChild(buildComponent(doc,bisac_heading[level]));
		}
	});
	TopicEl.appendChild(componentListEl);
	//Source
	const TopicsourceEl = doc.createElement("bf:source");
	const TopicSourceEl = doc.createElement("bf:Source");
	TopicSourceEl.setAttribute("rdf:about","http://id.loc.gov/vocabulary/subjectSchemes/bisacsh");
	const TopicsourcecodeEl = doc.createElement("bf:code");
	const TopicsourcecodeText = doc.createTextNode("bisacsh");
	TopicsourcecodeEl.appendChild(TopicsourcecodeText);
	TopicSourceEl.appendChild(TopicsourcecodeEl);
	TopicsourceEl.appendChild(TopicSourceEl);
	TopicEl.appendChild(TopicsourceEl);
	subjectEl.appendChild(TopicEl);
	return subjectEl;
}

function buildFASTSubjects(doc,fast_heading) {
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

	const subjectEl = doc.createElement("bf:subject");
	const classString = fast_heading[2] in fastTypes ? fastTypes[fast_heading[2]] : "Topic"
	const TopicEl = doc.createElement(`bf:${classString}`);
	TopicEl.setAttribute("rdf:about",`http://id.worldcat.org/fast/${fast_heading[1]}`);
	//Type
	const TopicTypeEl = doc.createElement("rdf:type");
	TopicTypeEl.setAttribute("rdf:resource",`http://www.loc.gov/mads/rdf/v1#${madsTypes[classString]}`)
	TopicEl.appendChild(TopicTypeEl);
	//Label
	const TopicLabelEl = doc.createElement("rdfs:label");
	const TopicLabelText = doc.createTextNode(fast_heading[0]);
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
	return subjectEl;
}

function buildSubjects(doc,keyword,classString = 'Topic') {
	const subjectEl = doc.createElement("bf:subject");
	const TopicEl = doc.createElement(`bf:${classString}`);
	//Type
	const TopicTypeEl = doc.createElement("rdf:type");
	TopicTypeEl.setAttribute("rdf:resource",`http://www.loc.gov/mads/rdf/v1#${classString}`);
	TopicEl.appendChild(TopicTypeEl);
	//Label
	const TopicLabelEl = doc.createElement("rdfs:label");
	const TopicLabelText = doc.createTextNode(escapeXML(keyword));
	TopicLabelEl.appendChild(TopicLabelText);
	TopicEl.appendChild(TopicLabelEl);
	subjectEl.appendChild(TopicEl);
	return subjectEl;
}

function buildMediaType(doc) {
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
	return mediaEl;
}

function buildCarrierType(doc) {
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
	return carrierEl;
}

function buildIssuance(doc) {
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
	return issuanceEl;
}

function buildNotes(doc,note_text,note_type = undefined) {
	const noteEl = doc.createElement("bf:note");
	const NoteEl = doc.createElement("bf:Note");
	if (note_type) {
		const NoteTypeEl = doc.createElement("rdf:type");
		NoteTypeEl.setAttribute("rdf:resource",note_type);
		NoteEl.appendChild(NoteTypeEl);
	}
	const NoteLabelEl = doc.createElement("rdfs:label");
	const NoteLabelText = doc.createTextNode(note_text);
	NoteLabelEl.appendChild(NoteLabelText);
	NoteEl.appendChild(NoteLabelEl);
	noteEl.appendChild(NoteEl);
	return noteEl;
}

function buildFileFormat(doc,record) {
	const systemRequirementEl = doc.createElement("bf:systemRequirement");
	const SystemRequirementEl = doc.createElement("bf:SystemRequirement");
	const SystemRequirementLabelEl = doc.createElement("rdfs:label");
	const SystemRequirementLabelText = doc.createTextNode(record.format);
	SystemRequirementLabelEl.appendChild(SystemRequirementLabelText);
	SystemRequirementEl.appendChild(SystemRequirementLabelEl);
	systemRequirementEl.appendChild(SystemRequirementEl);
	return systemRequirementEl;
}

function buildGeographicCoverage(doc,coverage_text) {
	const geographicCoverageEl = doc.createElement("bf:geographicCoverage");
	const GeographicCoverageEl = doc.createElement("bf:GeographicCoverage");
	const GeographicCoverageLabelEl = doc.createElement("rdfs:label");
	const GeographicCoverageLabelText = doc.createTextNode(coverage_text);
	GeographicCoverageLabelEl.appendChild(GeographicCoverageLabelText);
	GeographicCoverageEl.appendChild(GeographicCoverageLabelEl);
	geographicCoverageEl.appendChild(GeographicCoverageEl);
	return geographicCoverageEl;
}

function buildUsageAndAccessPolicy(doc,policy_text,policy_type) {
	const usageAndAccessPolicyEl = doc.createElement("bf:usageAndAccessPolicy");
	const policyClassEl = doc.createElement(`bf:${policy_type}Policy`);
	const policyClassLabelEl = doc.createElement("rdfs:label");
	const policyClassLabelText = doc.createTextNode(policy_text);
	policyClassLabelEl.appendChild(policyClassLabelText);
	policyClassEl.appendChild(policyClassLabelEl);
	usageAndAccessPolicyEl.appendChild(policyClassEl);
	return usageAndAccessPolicyEl;
}

/*
 * Build a BIBFRAME record. Each DOM object is saved as a string, then all the strings are combined into one master text
 *
 * record: 			 object containing the user-input data
 * institution_info: object containing name of institution creating record
 */
function downloadBIBFRAME(record,institution_info,alma=false) {
 	const id = crypto.randomUUID();
 	const startText = `<?xml version="1.0" encoding="UTF-8"?>\n${alma ? '<bib><record_format>lcbf_work</record_format><record>' : ''}<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#" xmlns:bf="http://id.loc.gov/ontologies/bibframe/" xmlns:bflc="http://id.loc.gov/ontologies/bflc/" xmlns:madsrdf="http://www.loc.gov/mads/rdf/v1#">\n</rdf:RDF>${alma ? '</record></bib>' : ''}`;
 	const parser = new DOMParser();
 	const doc = parser.parseFromString(startText, "application/xml");

	const workId = `http://example.org/${id}#Work`;
	const instanceId = checkExists(record?.web_url) ? record.web_url : `http://example.org/${id}#Instance`;

 	//Work
 	const workEl = doc.createElement("bf:Work");
 	workEl.setAttribute("rdf:about",workId);

 	const hasInstanceEl = doc.createElement("bf:hasInstance");
 	hasInstanceEl.setAttribute("rdf:resource",instanceId);

 	//Instance
 	const instanceEl = doc.createElement("bf:Instance");
 	instanceEl.setAttribute("rdf:about",instanceId);

 	const instanceOfEl = doc.createElement("bf:instanceOf");
 	instanceOfEl.setAttribute("rdf:resource",workId);

 	//Admin Metadata
 	workEl.appendChild(buildAdminMetadata(doc));
 	
	//Title
	const titleEl = buildTitle(doc,record);
 	workEl.appendChild(titleEl);
 	instancetitleEl = titleEl.cloneNode(true);
 	instanceEl.appendChild(instancetitleEl);

 	//Language
	if (checkExists(record?.language)) {
		workEl.appendChild(buildLanguage(doc,record));
	}

 	//Edition
 	if (checkExists(record?.edition)) {
 		instanceEl.appendChild(buildEdition(doc,record));
 	}

 	//ISBN
 	if (checkExists(record?.isbn)) {
 		instanceEl.appendChild(buildISBN(doc,record));
 	}

 	//Contributors
	if (checkExists(record?.author[0]['author'])) {
		workEl.appendChild(buildContributor(doc,record.author,true));
	}
 	if (checkExists(record?.additional_authors)) {
 		for (let i = 0; i < record.additional_authors.length; i++) {
 			workEl.appendChild(buildContributor(doc,record.additional_authors[i]));
 		}
 	}
	if (checkExists(record?.corporate_author[0]['corporate'])) {
		const primary = checkExists(record?.author[0]['author']) ? false : true;
		workEl.appendChild(buildContributor(doc,record.corporate_author,primary));
	}
	if (checkExists(record?.additional_corporate_names)) {
		for (let i = 0; i < record.additional_corporate_names.length; i++) {
			workEl.appendChild(buildContributor(doc,record.additional_corporate_names[i]));
		}
	}

 	//Provision Activity
 	if (checkExists(record?.publication_country) || checkExists(record?.publication_place) || checkExists(record?.publisher) || checkExists(record?.publication_year)) {
 		instanceEl.appendChild(buildProvisionActivity(doc,record));
 	}

 	//Copyright Date
 	if (checkExists(record?.copyright_year)) {
 		instanceEl.appendChild(buildCopyrightDate(doc,record));
 	}

 	//Dimensions
	if (checkExists(record?.dimensions)) {
		instanceEl.appendChild(buildDimensions(doc,record));
	}

 	//Pages/Volumes
	if (checkExists(record?.pages) && checkExists(record?.volume_or_page)) {
		instanceEl.appendChild(buildExtent(doc,`${escapeXML(record.pages)} ${record.volume_or_page}`));
	}

 	//Genre
 	if (record?.literature_yes && checkExists(record?.literature_dropdown)) {
 		workEl.appendChild(buildGenre(doc,record));
 	}

 	//Illustrations
 	if (record?.illustrations_yes) {
 		instanceEl.appendChild(buildIllustrations(doc));
 	}

	//Subjects
	if (checkExists(record?.subjects)) {
		for (let k = 0; k < record.subjects.length; k++) {
			workEl.appendChild(buildSimpleBISACSubjects(doc,record.subjects[k]));
			workEl.appendChild(buildComplexBISACSubjects(doc,record.subjects[k]));
		}
	}

 	//Keywords
	if (checkExists(record?.fast)) {
		for (let k = 0; k < record.fast.length; k++) {
			workEl.appendChild(buildFASTSubjects(doc,record.fast[k]));
		}
	}
	if (checkExists(record?.keywords)) {
		for (let k = 0; k < record.keywords.length; k++) {
			workEl.appendChild(buildSubjects(doc,record.keywords[k]));
		}
	}

 	//Media Type
 	instanceEl.appendChild(buildMediaType(doc));

 	//Carrier Type
 	instanceEl.appendChild(buildCarrierType(doc));

 	//Issuance
 	instanceEl.appendChild(buildIssuance(doc));

 	if (record?.bibliographies_yes) {
 		const bib_note = "Includes bibliographical references and index.";
		const note_type = 'http://id.loc.gov/vocabulary/mnotetype/biblio';
		workEl.appendChild(buildNotes(doc,bib_note,note_type));
 	}

	//File Format
	if (checkExists(record?.format)) {
		instanceEl.appendChild(buildFileFormat(doc,record));
	}

	//File Size
	if (checkExists(record?.size)) {
		instanceEl.appendChild(buildExtent(doc,record.size));
	}

	//Geographic Coverage
	if (checkExists(record?.gcoverage)) {
		workEl.appendChild(buildGeographicCoverage(doc,record.gcoverage));
	}

	//Geographic Granularity
	if (checkExists(record?.ggranularity)) {
		workEl.appendChild(buildGeographicCoverage(doc,record.ggranularity));
	}

	//Date Range
	if (checkExists(record?.daterange)) {
		workEl.appendChild(buildSubjects(doc,record.daterange,'Temporal'));
	}

	//Date Data Collected
	if (checkExists(record?.datecollected)) {
		instanceEl.appendChild(buildNotes(doc,record.datecollected));
	}

	//Access Terms
	if (checkExists(record?.access_terms)) {
		instanceEl.appendChild(buildUsageAndAccessPolicy(doc,record.access_terms,'Access'));
	}

	//Use Terms
	if (checkExists(record?.use_terms)) {
		instanceEl.appendChild(buildUsageAndAccessPolicy(doc,record.use_terms,'Use'));
	}

 	workEl.appendChild(hasInstanceEl);
 	instanceEl.appendChild(instanceOfEl);

	const root_filename = checkExists($("#filename").val()) ? $("#filename").val() : 'record';
	if (alma) {
		const instanceStartText = `<?xml version="1.0" encoding="UTF-8"?>\n<bib><record_format>lcbf_instance</record_format><record><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#" xmlns:bf="http://id.loc.gov/ontologies/bibframe/" xmlns:bflc="http://id.loc.gov/ontologies/bflc/" xmlns:madsrdf="http://www.loc.gov/mads/rdf/v1#">\n</rdf:RDF></record></bib>`;
		const instanceDoc = parser.parseFromString(instanceStartText, "application/xml");

		const work_serializer = new XMLSerializer();
		doc.getElementsByTagName("rdf:RDF")[0].appendChild(workEl);
		const work_filename = `${root_filename}_BIBFRAME_Work.xml`;
		const work_file = { name: work_filename, value: work_serializer.serializeToString(doc) };

		const instance_serializer = new XMLSerializer();
		instanceDoc.getElementsByTagName("rdf:RDF")[0].appendChild(instanceEl);
		const instance_filename = `${root_filename}_BIBFRAME_Instance.xml`;
		const instance_file = { name: instance_filename, value: instance_serializer.serializeToString(instanceDoc) };

		return [ work_file, instance_file ];
	}
	else {
		doc.getElementsByTagName("rdf:RDF")[0].appendChild(workEl);
		doc.getElementsByTagName("rdf:RDF")[0].appendChild(instanceEl);

		const serializer = new XMLSerializer();
		return [ { name: `${root_filename}_BIBFRAME.xml`, value: serializer.serializeToString(doc) } ];
	}
}
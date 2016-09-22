function addHeader(record) {
	var sender = '\t\t<Sender>\n\t\t\t<SenderName></SenderName>\n\t\t</Sender>\n';

	var addressee = '\t\t<Addressee>\n\t\t\t<AddresseeName></AddresseeName>\n\t\t</Addressee>\n';

	var message_number = '\t\t<MessageNumber></MessageNumber>\n'

	var today = new Date();

	var date = today.getDate().toString();
	if (date.length == 1) {
		date = '0' + date
	}
	var month = today.getMonth().toString();
	if (month.length == 1) {
		month = '0' + month
	}

	var sentDateTime = '\t\t<SentDateTime>' + today.getFullYear() + month + date + '</SentDateTime>\n'

	return sender + addressee + message_number + sentDateTime
}

function getPrefix(title,lang) {
	if (lang === 'eng') {
		if (title.substring(0,2) === 'A ') {
			return 'A';
		}
		else if (title.substring(0,3) === 'An ') {
			return 'An';
		}
		else if (title.substring(0,4) === 'The ') {
			return 'The';
		}
		else {
			return '';
		}
	}
	else {
		if (title.substring(0,2) === "L'") {
			return 'L\'';
		}
		else if (title.substring(0,3) === 'Le ')  {
			return 'Le';
		}
		else if (title.substring(0,3) === 'La ') {
			return 'La';
		}
		else if (title.substring(0,4) === 'Les ') {
			return 'Les';
		}
		else {
			return '';
		}
	}
}

function addContributor(author,counter) {
	var role_index = { 'art': 'A07', 'aut': 'A01', 'ctb': 'A32', 'edt': 'B01', 'ill': 'A12', 'trl': 'B06'}

	var new_contributor = '\t\t\t<Contributor>\n';
	new_contributor += '\t\t\t\t<SequenceNumber>' + counter + '</SequenceNumber>\n';

	new_contributor += '\t\t\t\t<ContributorRole>' + role_index[author[0]['role']] + '</ContributorRole>\n';

	if (checkExists(author[0]['family']) && checkExists(author[0]['given'])) {
		new_contributor += '\t\t\t\t<PersonName>' + escapeXML(author[0]['given'] + ' ' + author[0]['family']) + '</PersonName>\n';
	}
	else if (checkExists(author[0]['family'])) {
		new_contributor += '\t\t\t\t<PersonName>' + escapeXML(author[0]['family']) + '</PersonName>\n';
	}
	else if (checkExists(author[0]['given'])) {
		new_contributor += '\t\t\t\t<PersonName>' + escapeXML(author[0]['given']) + '</PersonName>\n';
	}

	if (checkExists(author[0]['given'])) {
		new_contributor += '\t\t\t\t<NamesBeforeKey>' + escapeXML(author[0]['given']) + '</NamesBeforeKey>\n';
	}

	if (checkExists(author[0]['family'])) {
		new_contributor += '\t\t\t\t<KeyNames>' + escapeXML(author[0]['family']) + '</KeyNames>\n';
	}

	new_contributor += '\t\t\t</Contributor>\n';

	return new_contributor;
}

function addTitles(record) {
	var title_detail = '\t\t\t<TitleDetail>\n\t\t\t\t<TitleType>01</TitleType>\n\t\t\t\t<TitleElement>\n\t\t\t\t\t<TitleElementLevel>01</TitleElementLevel>\n';

	var latin_index = checkExists(record.title[1]['title']) || checkExists(record.title[1]['subtitle']) ? 1 : 0;
	if (record.language == 'eng' || record.language == 'fre') {
		var prefix = getPrefix(record.title[latin_index]['title'],record.language)

		if (checkExists(prefix)) {
			title_detail += '\t\t\t\t\t<TitlePrefix>' + prefix + '</TitlePrefix>\n';
			title_detail += '\t\t\t\t\t<TitleWithoutPrefix>' + escapeXML(record.title[latin_index]['title'].substring(prefix.length + 1)) + '</TitleWithoutPrefix>\n';
		}
		else {
			title_detail += '\t\t\t\t\t<NoPrefix/>\n';
			title_detail += '\t\t\t\t\t<TitleWithoutPrefix>' + escapeXML(record.title[latin_index]['title']) + '</TitleWithoutPrefix>\n';
		}
	}
	else {
		title_detail += '\t\t\t\t\t<NoPrefix/>\n';
		title_detail += '\t\t\t\t\t<TitleWithoutPrefix>' + escapeXML(record.title[latin_index]['title']) + '</TitleWithoutPrefix>\n';
	}

	if (checkExists(record.title[0]['subtitle'])) {
		title_detail += '\t\t\t\t\t<Subtitle>' + escapeXML(record.title[latin_index]['subtitle']) + '</Subtitle>\n';
	}

	title_detail += '\t\t\t\t</TitleElement>\n\t\t\t</TitleDetail>\n';

	return title_detail;
}

function addSubjects(scheme_identifier,scheme_version,scheme_name,subject_code,subject_heading) {
	var new_subject = '\t\t\t<Subject>\n';

	new_subject += '\t\t\t\t<SubjectSchemeIdentifier>' + escapeXML(scheme_identifier) + '</SubjectSchemeIdentifier>\n';

	if (checkExists(scheme_version)) {
		new_subject += '\t\t\t\t<SubjectSchemeVersion>' + escapeXML(scheme_version) + '</SubjectSchemeVersion>\n';
	}

	if (checkExists(scheme_name)) {
		new_subject += '\t\t\t\t<SubjectSchemeName>' + escapeXML(scheme_name) + '</SubjectSchemeName>\n';
	}

	if (checkExists(subject_code)) {
		new_subject += '\t\t\t\t<SubjectCode>' + escapeXML(subject_code) + '</SubjectCode>\n';
	}

	new_subject += '\t\t\t\t<SubjectHeadingText>' + escapeXML(subject_heading) + '</SubjectHeadingText>\n';

	new_subject += '\t\t\t</Subject>\n';
	return new_subject;
}

function addDescriptiveDetails(record) {
	var descriptive_detail = '\t\t<DescriptiveDetail>\n';

	descriptive_detail += '\t\t\t<ProductComposition>00</ProductComposition>\n';

	descriptive_detail += '\t\t\t<ProductForm>ED</ProductForm>\n';

	descriptive_detail += '\t\t\t<NoCollection/>\n';

	descriptive_detail += addTitles(record);

	if (checkExists(record.author)) {
		var sequence_counter = 1

		descriptive_detail += addContributor(record.author,sequence_counter);

		sequence_counter += 1;

		if (record.additional_authors.length > 0) {
			for (var index = 0; index < record.additional_authors.length; index++) {
				if (checkExists(record.additional_authors[index][0]['family']) || checkExists(record.additional_authors[index][0]['given'])) {
					descriptive_detail += addContributor(record.additional_authors[index],sequence_counter)
					sequence_counter += 1;
				}
			}
		}
	}
	else {
		descriptive_detail += '\t\t\t<NoContributor/>\n';
	}

	if (checkExists(record.edition)) {
		descriptive_detail += '\t\t\t<EditionStatement>' + escapeXML(record.edition) + '</EditionStatement>\n';
	}
	else {
		descriptive_detail += '\t\t\t<NoEdition/>\n';
	}

	descriptive_detail += '\t\t\t<Language>\n\t\t\t\t<LanguageRole>01</LanguageRole>\n\t\t\t\t<LanguageCode>' + record.language + '</LanguageCode>\n\t\t\t</Language>\n';

	descriptive_detail += '\t\t\t<Illustrated>'
	if (checkExists(record.illustrations_yes) && record.illustrations_yes == true) {
		descriptive_detail += '02';
	}
	else {
		descriptive_detail += '01';
	}
	descriptive_detail += '</Illustrated>\n';

	if (record.subjects.length > 0) {
		for (var i = 0; i < record.subjects.length; i++) {
			var new_term = record.subjects[i]['root'] + '--' + record.subjects[i]['level1'];

			if ('level2' in record.subjects[i]) {
				new_term += '--' + record.subjects[i]['level2'];

				if ('level3' in record.subjects[i]) {
					new_term += '--' + record.subjects[i]['level3'];
				}
			}

			descriptive_detail += addSubjects('10','2015',null,record.subjects[i]['id_number'],new_term);
		}
	}

	if (record.fast.length > 0) {
		for (var i = 0; i < record.fast.length; i++) {
			descriptive_detail += addSubjects('24',null,'FAST',record.fast[i][1],record.fast[i][0]);
		}
	}

	if (record.keywords.length > 0) {
		for (var i = 0; i < record.keywords.length; i++) {
			descriptive_detail += addSubjects('20',null,null,null,record.keywords[i]);
		}
	}

	descriptive_detail += '\t\t</DescriptiveDetail>\n';

	return descriptive_detail;
}

function addPublicationDetails(record) {
	if (checkExists(record.publisher) || checkExists(record.publication_place) || checkExists(record.publication_country) || checkExists(record.publication_year) || checkExists(record.copyright_year)) {
		var publication_detail = '\t\t<PublicationDetail>\n';

		if (checkExists(record.publisher)) {
			publication_detail += '\t\t\t<Publisher>\n';
			publication_detail += '\t\t\t\t<PublishingRole>01</PublishingRole>\n';
			publication_detail += '\t\t\t\t<PublisherName>' + escapeXML(record.publisher) + '</PublisherName>\n';
			publication_detail += '\t\t\t</Publisher>\n';
		}

		if (checkExists(record.publication_place)) {
			publication_detail += '\t\t\t<CityOfPublication>' + escapeXML(record.publication_place) + '</CityOfPublication>\n';
		}

		if (checkExists(record.publication_country)) {
			publication_detail += '\t\t\t<CountryOfPublication>' + getCountry(record.publication_country) + '</CountryOfPublication>\n';
		}

		if (checkExists(record.publication_year)) {
			publication_detail += '\t\t\t<PublishingDate>\n';
			publication_detail += '\t\t\t\t<PublishingDareRole>01</PublishingDareRole>\n';
			publication_detail += '\t\t\t\t<Date dateformat="05">' + record.publication_year + '</Date>\n';
			publication_detail += '\t\t\t</PublishingDate>\n';
		}

		if (checkExists(record.copyright_year)) {
			publication_detail += '\t\t\t<CopyrightStatement>\n';
			publication_detail += '\t\t\t\t<CopyrightYear dateformat="05">' + record.copyright_year + '</CopyrightYear>\n';
			publication_detail += '\t\t\t</CopyrightStatement>\n';
		}

		publication_detail += '\t\t</PublicationDetail>\n';
	}
	else {
		var publication_detail = '';
	}

	return publication_detail;
}

function addProduct(record) {
	var record_reference = '\t\t<RecordReference>[Insert Record Reference Here]</RecordReference>\n';

	var notification_type = '\t\t<NotificationType>03</NotificationType>\n';

	var isbn = ''
	if (checkExists(record.isbn)) {
		if (record.isbn.length == 13) {
			isbn += '\t\t<ProductIdentifier>\n\t\t\t<ProductIDType>15</ProductIDType>\n\t\t\t<IDValue>' + record.isbn + '</IDValue>\n\t\t</ProductIdentifier>\n';
			isbn += '\t\t<ProductIdentifier>\n\t\t\t<ProductIDType>03</ProductIDType>\n\t\t\t<IDValue>' + record.isbn + '</IDValue>\n\t\t</ProductIdentifier>\n';
		}
		else if (record.isbn.length == 10) {
			isbn += '\t\t<ProductIdentifier>\n\t\t\t<ProductIDType>02</ProductIDType>\n\t\t\t<IDValue>' + record.isbn + '</IDValue>\n\t\t</ProductIdentifier>\n';
		}
	}

	var descriptive_detail = addDescriptiveDetails(record);

	var publication_detail = addPublicationDetails(record);

	var product_supply = '\t\t<ProductSupply>\n';

	product_supply += '\t\t\t<ProductDetail>\n';
	product_supply += '\t\t\t\t<Supplier>\n';
	product_supply += '\t\t\t\t\t<SupplierRole>09</SupplierRole>\n';
	if (checkExists(record.publisher)) {
		product_supply += '\t\t\t\t\t<SupplierName>' + escapeXML(record.publisher) + '</SupplierName>\n';
	}
	product_supply += '\t\t\t\t\t<Website>\n';
	product_supply += '\t\t\t\t\t\t<WebsiteRole>18</WebsiteRole>\n';
	product_supply += '\t\t\t\t\t\t<WebsiteLink>' + escapeXML(record.web_url) + '</WebsiteLink>\n';
	product_supply += '\t\t\t\t\t</Website>\n';
	product_supply += '\t\t\t\t</Supplier>\n';
	product_supply += '\t\t\t\t<ProductAvailability>20</ProductAvailability>\n';
	product_supply += '\t\t\t</ProductDetail>\n';

	product_supply += '\t\t</ProductSupply>\n';

	return record_reference + notification_type + isbn + descriptive_detail + publication_detail + product_supply
}

function downloadONIX(record,institution_info) {
	var startText = '<?xml version="1.0" encoding="utf-8"?>\n<ONIXMessage>\n'

	var headerText = '\t<Header>\n';
	headerText += addHeader(record);
	headerText += '\t</Header>\n';

	var productText = '\t<Product>\n';
	productText += addProduct(record);
	productText += '\t</Product>\n';

	var endText = '</ONIXMessage>';

	var text = startText + headerText + productText + endText;
	downloadFile(text,'onix');
}
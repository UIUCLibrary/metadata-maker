# MetadataMaker
**The pre-2023 development history of this page can be found in the [Theses-&-Dissertations branch](https://github.com/UIUCLibrary/metadata-maker/tree/Theses-%26-Dissertations) of the repo**

Metadata Maker is a web application that is used for creating *good enough* quality metadata in four different formats depending on the needs of the system to which the metadata will be ingested. A live version of the tool hosted by the University of Illinois can be found at http://quest.library.illinois.edu/marcmaker/

## Editing institution information

By default the records produced by MetadataMaker list the University of Illinois at Urbana-Champaign as the institution that created the records, and as the location of the physical holding. To change the default institution in code, edit the strings created in **`generateInstitutionInfo()`** in **`metadatamaker/submitForm.js`**. The institution information can also be customized by setting certain values in the url. These values largely correspond to the variables in **`generateInstitutionInfo()`** are:

* **marc** - corresponds to `output['marc']`
* **physicalLocation** - corresponds to `output['mods']['physicalLocation']`
* **recordContentSource** - corresponds to `output['mods']['recordContentSource']`
* **lcn** - organization's LC authority number, used to construct the url in `output['html']['url']`
* **n** - corresponds to `output['html']['name']`

A custom url should look something like:

	http://quest.library.illinois.edu/marcmaker/?marc=_&physicalLocation=_&recordContentSource=_&lcn=_&n=_

## Browser compatibility

The recommended browsers for MetadataMaker are Chrome and Firefox. MetadataMaker is not yet fully functional in Internet Explorer or Safari. While Opera was not specifically targeted in the development of this tool, light testing suggests it is compatible.

## Updates

**08-21-2015:** The 008 field is now constructed as an array of individual strings, making it easy to change when you know the index that needs changing.

The information for the organization creating the record can be altered via the url. See the "Editing institution information" section above for more details.

## Contact info

Comments and questions can be directed to Deren Kudeki at dkudeki@illinois.edu and Myung-Ja Han at mhan3@illinois.edu
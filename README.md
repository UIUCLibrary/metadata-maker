# MetadataMaker

## Editing institution information

The records produced by MetadataMaker list the University of Illinois at Urbana-Champaign as the institution that created the records, and as the location of the physical holding. To change the institution, edit the strings created in **generateInstitutionInfo()** in **marcmaker.js**.

## Browser compatibility

The recommended browsers for MetadataMaker are Chrome and Firefox. MetadataMaker is not yet fully functional in Internet Explorer or Safari. While Opera was not specifically targeted in the development of this tool, light testing suggests it is compatible.

## Updates

**02-06-2015:** Changed the Author field to be called Names, and created dropdown to define each name's role

**03-20-2015:** Keyword field now suggest FAST headings based on what the user has typed in the field. Uses OCLC's assignFAST web service. The Keyword field differentiates between FAST terms and non-FAST terms, and records each appropriately.

The file structure has been altered, placing the javascript files in subdirectories, and splitting marcmaker.js into more manageable chunks within the metadatamaker folder.

## Contact info

Comments and questions can be directed to Deren Kudeki at dkudeki@illinois.edu
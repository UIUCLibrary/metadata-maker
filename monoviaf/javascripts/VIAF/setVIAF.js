$(function() {
	$(".author").viafautox( {
		select: function(event, ui){
			startupVAIF('author',ui);
		}
	});

	$(".corporate").viafautox( {
		select: function(event, ui){
			startupVAIF('corporate',ui);
		}
	});
});

function startupVAIF(type,ui) {
	var item = ui.item;
	document.getElementById(`hiddenremind_${type}`).style.display="";
	document.getElementById(`hiddenwiki_${type}`).setAttribute('href', item.wikiuri);
	document.getElementById(`hiddenwikidiv_${type}`).style.display="";
	if (item.viafuri) {
		document.getElementById(`hiddenviaf_${type}`).setAttribute('href', item.viafuri);
		document.getElementById(`hiddenviafdiv_${type}`).style.display="";
	}
	if (item.lcuri) {
		document.getElementById(`hiddenlc_${type}`).setAttribute('href', item.lcuri);
		document.getElementById(`hiddenlcdiv_${type}`).style.display="";
	}
}

function setUpVIAF() {
	$(".author").viafautox( {
		select: function(event, ui){
			const item = ui.item
			const thisid = $(this).attr('id');
			setUpVIAFByType('author',item,thisid);
		}
	});

	$(".corporate").viafautox( {
		select: function(event, ui) {
			const item = ui.item
			const thisid = $(this).attr('id');
			setUpVIAFByType('corporate',item,thisid);
		}
	});
}

function setUpVIAFByType(type,item,thisid) {
	suffix = thisid.replace(`${type}_name`, '');
	const hiddenwikiid = `hiddenwiki_${type}${suffix}`;
	const hiddenwikidivid = `hiddenwikidiv_${type}${suffix}`;
	const hiddenviafid = `hiddenviaf_${type}${suffix}`;
	const hiddenviafdivid = `hiddenviafdiv_${type}${suffix}`;
	const hiddenlcid = `hiddenlc_${type}${suffix}`;
	const hiddenlcdivid = `hiddenlcdiv_${type}${suffix}`;
	document.getElementById(hiddenwikiid).setAttribute('href', item.wikiuri);
	document.getElementById(hiddenwikidivid).style.display="";
	if (item.viafuri) {
		document.getElementById(hiddenviafid).setAttribute('href', item.viafuri);
		document.getElementById(hiddenviafdivid).style.display="";
	}
	if (item.lcuri){
		document.getElementById(hiddenlcid).setAttribute('href', item.lcuri);
		document.getElementById(hiddenlcdivid).style.display="";
	}
}
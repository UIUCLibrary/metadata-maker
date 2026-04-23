$(function() {
	$(".author").viafautox( {
		select: function(event, ui){
			var item = ui.item;
			document.getElementById("hiddenremind").style.display="";
			document.getElementById("hiddenwiki").setAttribute('href', item.wikiuri);
			document.getElementById("hiddenwikidiv").style.display="";
			if (item.viafuri) {
				document.getElementById("hiddenviaf").setAttribute('href', item.viafuri);
				document.getElementById("hiddenviafdiv").style.display="";
			}
			if (item.lcuri) {
				document.getElementById("hiddenlc").setAttribute('href', item.lcuri);
				document.getElementById("hiddenlcdiv").style.display="";
			}
		}
	});

});


function setUpVIAF() {
	$(".author").viafautox( {
		select: function(event, ui){
			const item = ui.item
			const thisid = $(this).attr('id');
			suffix = thisid.replace('author_name', '');
			const hiddenwikiid = `hiddenwiki${suffix}`;
			const hiddenwikidivid = `hiddenwikidiv${suffix}`;
			const hiddenviafid = "hiddenviaf" + suffix;
			const hiddenviafdivid = "hiddenviafdiv" + suffix;
			const hiddenlcid = "hiddenlc" + suffix;
			const hiddenlcdivid = "hiddenlcdiv" + suffix;
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
	});
}
$(function() {
	$(".author").viafautox( {
		select: function(event, ui){
			var item = ui.item;
			document.getElementById("hiddenremind").style.display="";
			document.getElementById("hiddenviaf").setAttribute('href', item.viafuri);
			document.getElementById("hiddenviafdiv").style.display="";
			if (item.lcuri!="noLC"){
				document.getElementById("hiddenlc").setAttribute('href', item.lcuri);
				document.getElementById("hiddenlcdiv").style.display="";
			}
		}
	});

});


function setUpVIAF() {
	$(".author").viafautox( {
		select: function(event, ui){
			var item = ui.item
			var thisid = $(this).attr('id');
			suffix = thisid.replace('family_name', '');
			var hiddenviafid = "hiddenviaf" + suffix;
			var hiddenviafdivid = "hiddenviafdiv" + suffix;
			var hiddenlcid = "hiddenlc" + suffix;
			var hiddenlcdivid = "hiddenlcdiv" + suffix;
			document.getElementById(hiddenviafid).setAttribute('href', item.viafuri);
			document.getElementById(hiddenviafdivid).style.display="";
			if (item.lcuri!="noLC"){
				document.getElementById(hiddenlcid).setAttribute('href', item.lcuri);
				document.getElementById(hiddenlcdivid).style.display="";
			}
		}
	});
}
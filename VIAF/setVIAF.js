$(function() {
	$(".author").viafautox( {
		select: function(event, ui){
			var item = ui.item;
			event.preventDefault();
			event.stopPropagation();
		}
	});
});

function setUpVIAF() {
	$(".author").viafautox( {
		select: function(event, ui){
			var item = ui.item;
			event.preventDefault();
			event.stopPropagation();
		}
	});
}
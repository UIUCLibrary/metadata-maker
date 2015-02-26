/*
* A jQuery UI widget for getting VIAF identifiers via autosuggest
*  h/t to 	Matthew Hailwood http://jquery.webspirited.com/author/Hailwood/ for his
* most excellent jquery UI widget framework at 
* http://jquery.webspirited.com/2011/03/jquery-ui-widget-development-skeleton/#more-109
*/
/*
 * Depends on jQuery UI version 1.8.1 or higher
 *  jquery.ui.core.js
 *  jquery.ui.widget.js
 *  jquery.ui.position.js
 *  jquery.ui.button.js
 *  jquery.ui.dialog.js
 *  jquery.ui.autocomplete.js
 *  
 *  Assumes jQuery UI css, images, etc.
 *  
 *  Make sure you load the right version of jQuery for your version of jQuery UI!!
 */

/*
 * We can use $ as an alias to jQuery in a closure/wrapper avoiding conflict w/ prototype et al.
 */
(function($) {

  $.widget("oclc.viafauto", $.ui.autocomplete, {
   options: {
 // select: function(event, ui) { alert("Selected!"); return this._super(event, ui); },
    source: function(request, response) {
        var term = $.trim(request.term); 
        var url  = "http://viaf.org/viaf/AutoSuggest?query=" + term;
        var me = this; 
        $.ajax({
            url: url,
            dataType: "jsonp",
            success: function(data) {
                if (data.result) {
                    response( $.map( data.result, function(item) {
                        var retLbl = item.term + " [" + item.nametype + "]";
                        return {
                            label: retLbl,
                            value: item.term,
                            id: item.viafid,
                            nametype: item.nametype
                        }
                    }));
                } else {
                    me._trigger('nomatch', null, {term: term});
                }
            },
        });  // end of $.ajax()
    }},      // end of source:, options

    /*
     * Punt a few fundamental tasks to the parent class
     */
    _create: function() {
        return this._super();
    },
    _setOption: function( key, value ) {
        this._super( key, value );
    },
    _setOptions: function( options ) {
        this._super( options );
    }
  });
})(jQuery);

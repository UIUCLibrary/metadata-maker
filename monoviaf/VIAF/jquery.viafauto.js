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
 select: function(event, ui) { 
    alert("Selected!"); return this._super(event, ui); },
    source: function(request, response) {
        const term = $.trim(request.term); 
        const url  = `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${term}&language=en&format=json`;
        const service_header = { 'User-Agent': 'Metadata Maker / 1.2.0 University of Illinois at Urbana-Champaign Library' };
        const me = this; 
        $.ajax({
            url: url,
            dataType: "jsonp",
            headers: service_header,
            success: function(data) {
                if (data.search) {
                    console.log(data.search);
                    const wdids = $.map(data.search, function(item) {
                        return item.id;
                    });
                    console.log(wdids);
                    if (wdids.length) {
                        const ids_string = wdids.join("|");
                        const details_url = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${ids_string}&languages=en&props=labels|claims&format=json`;
                        $.ajax({
                            url: details_url,
                            dataType: "jsonp",
                            headers: service_header,
                            success: function(full_data) {
                                console.log(full_data);
                            },
                        });
                    }
                    else {
                        me._trigger('nomatch', null, {term: term});
                    }
/*                    response( $.map( data.search, function(item) {
                        if (item.nametype == "personal"){
                            var retLbl = item.term + " [" + item.nametype + "]";
                            var uri = "http://viaf.org/viaf/" + item.viafid;
                            if (item.lc){
                                return {
                                    label: retLbl,
                                    value: item.term,
                                    id: item.viafid,
                                    viafuri: uri,
                                    lcuri: "http://id.loc.gov/authorities/names/" + item.lc,
                                    nametype: item.nametype
                                }
                            }else{
                                return {
                                    label: retLbl,
                                    value: item.term,
                                    id: item.viafid,
                                    viafuri: uri,
                                    lcuri: "noLC",
                                    nametype: item.nametype
                                }
                            }
                        }
                            
                        
                    }));*/
                } else {
                    me._trigger('nomatch', null, {term: term});
                }
            },
        });  // end of $.ajax()
    }
    // change: function(event, ui){
    // if(ui.item){
    //     console.log(ui.item);
    // }


    },      // end of source:, options

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

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
        const input_field = this.element[0]['id'];
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
                                if (full_data.entities) {
                                    response( $.map( full_data.entities, function(item) {
                                        const target_codes = new Set(['Q4830453','Q6881511','Q43229','Q17197366','Q110315658','Q115456878','Q1752939','Q2085381','Q476190','Q1639780','Q327333','Q105062392']);
                                        //P31 means "instance of"
                                        //Q5 means "human", so we're filtering for humans in case 1
                                        //Q4830453 = business, Q6881511 = enterprise, Q43229 = organization, Q17197366 = type of organization
                                        //Q110315658 = elected legislative house, Q115456878 = legislative branch agency, Q1752939 = independent agency of the United States government
                                        //Q2085381 = publishing house, Q476190 = United States congressional committee, Q1639780 = regulatory agency, Q327333 = government agency
                                        //Q105062392 = financial regulatory agency
                                        if ('P31' in item.claims && 
                                            (input_field.includes('author') ? 
                                            item['claims']['P31'][0]['mainsnak']['datavalue']['value']['id'] == 'Q5' : 
                                            target_codes.intersection(new Set(item.claims.P31.map(instanceObject => instanceObject?.mainsnak?.datavalue?.value?.id))).size)
                                        ) {
                                            const description = data.search.find(obj => {
                                                return obj.id == item.id;
                                            })?.description;
                                            const retLbl = `${item.labels.en.value} [${description}]`;
                                            const viafid = item.claims?.P214 ? item.claims.P214[0]?.mainsnak?.datavalue?.value : undefined;
                                            const lcid = item.claims?.P244 ? item.claims.P244[0]?.mainsnak?.datavalue?.value : undefined;

                                            return {
                                                label: retLbl,
                                                value: item.labels.en.value,
                                                id: item.id,
                                                viafuri: viafid ? `http://viaf.org/viaf/${viafid}` : undefined,
                                                lcuri: lcid ? `http://id.loc.gov/authorities/names/${lcid}` : undefined,
                                                wikiuri: `http://www.wikidata.org/wiki/${item.id}`
                                            }
                                        }
                                    }));
                                }
                            },
                        });
                    }
                    else {
                        me._trigger('nomatch', null, {term: term});
                    }
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

/*
* A jQuery UI widget for getting VIAF identifiers via autosuggest
*  h/t to     Matthew Hailwood http://jquery.webspirited.com/author/Hailwood/ for his
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
 * Additional features: nomatch, noselect
 *
 * Closure function makes $ safe to use here without conflict with prototype et al.
 */
(function($) {
  $.widget("oclc.viafautox", $.oclc.viafauto, {
    _setOptions: function( options  ) { this._super( options  ); },
    _setOption:  function(key, value) { this._super(key, value); },
    _create:     function(          ) {    return this._super(); },
    _init:       function() {
        var me = this;
        $(me.element).on("viafautoxchange", function(event, ui) {
            $(me.element).removeClass("ui-autocomplete-loading");
            if (! ui.item){
             // console.log("_triggering noselect"); console.log(event.currentTarget);
                me._trigger("noselect", event, {});
            }
        });
    }
  });
})(jQuery);

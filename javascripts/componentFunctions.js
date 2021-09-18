/* gh-COMPONENTS
 *
 * STYLE -> webroot/skin/stylesheets/gh_components.css
 *   ex: you just need to import, this css file above, inside the main css file that a "html" page is using: @import url(somepath.../webroot/skin/stylesheets/gh_components.css)
 *
 *
 * HTML -> class="gh-nomeComponent"
 *   ex: as convention, you'll use "gh" -nameOfComponent".
 *       So a "gh" component will have the following class name "gh-nameOfComponentAbc"
 *
 *
 * JAVASCRIPT -> webroot/javascripts/ghComponentFunctions.js
 *   ex: if a component name is "gh-componentA", the javascript fn name will be "ghComponentA(){ ... }"
 *       All the gh-component functions will be into "ghComponentFunctions.js" and we'll just need to import manually it into the block (blocks.json), where we need to use it
 *   IMPORTANT: any function needs to check if: $(".gh-nameOfComponent).length > 0 (or scan the page by some LOOP function)
 *             (name of the function with ".gh-nameOfFunction"), and it's supposed to be inside the MAIN init fn: $(function(){ ... });
 *
 * */


///// GLOBAL OBJs/VARs /////
//This because we could have more than one same component in a page.
var __ghDropTextField = [];

////////////////////////////


//MAIN jQuery init
//we check if in the page there's some gh-component
$(function(){
    ghDropTextField();

});


/*
 HTML: <input type="text" class="gh-dropTextField ghTransition" data-gh-params='{"idWrapper":"quickTransferNote", "slist" : ["a", "b", "c"], "css-li":{"border-color":"#66baec"}, "css-.gh-cont-ico-dropTextField":{"border-color":"#66baec"}}'/>

 gh-dropTextField: it's the name to build that component
 ghTransition: if you want the animation of slide down/up
 gh-params: is a json object, order to add some feature
 "idWrapper": it sets up an ID attribute for the wrapper of the HTML component (gh-wrap-dropTextField in that case).
              This is useful if you want to change some CSS of some element inside the component, pointing at the ID wrapper
 "list": it's the list of options of the drop menu. It might be a static list or a list generate from a ajax call
         FORMAT: (A-jax)   {"alist" : "url":"mny/child-payment" }
                 (S-tatic) {"slist" : ["a", "b", "c"]}
 "css-TAG/CLASS{prop:value}": order to set up some css inline for some element inside the WRAPPER, wrapper which wraps the MAIN HTML element, in this case <input class="gh-dropTextField">
                              For this element the INLINE CSS works under focus and/or blur events
                              FORMAT: css- [nameTag, .nameClass (or .nameId)]
 child-payment -> message: "some NOTE" in POST when the users does a quick transfer
 */


function ghDropTextField(){

    $(".gh-dropTextField").each(function(ii, el){
        //__ghDropTextField: is a global array
        if( __ghDropTextField[ii] === el ){ return; }
        __ghDropTextField.push(el);

        //HTML building
        $(el).wrap('<div class="gh-wrap-dropTextField"></div>');
        $(el).parent().append('<div class="gh-cont-ico-dropTextField"><span></span></div>');
        //the first LI it's just for padding, to join the input text field with the UL
        $(el).parent().append('<ul><li></li></ul>');

        var wrapper = $(el).parent();

        if( $(el).hasClass("ghTransition") ){ $(wrapper).find("ul").addClass("ghTransitionApplied"); }

        var hasGhParams = !!$(el).data("gh-params");
        var paramObj;

        //LIST
        if(hasGhParams){
            var paramObj = $(el).data("gh-params");

            if(paramObj.hasOwnProperty("id")){ $(wrapper).attr("id", paramObj.id); }

            for(var key in paramObj){
                if(key+"" == "slist"){
                    for(var jj in paramObj[key]){
                        wrapper.find("ul").append("<li>"+ paramObj[key][jj] +"</li>");
                    }
                    break;
                }
                else if(key+"" == "alist"){
                    /* we don't have the API yet to retrieve a list of tasks or whatever else
                     $.ajax({
                     url: apiPath + paramObj[key],
                     type: 'GET',
                     async: false,
                     dataType: 'json',
                     success: function(data){

                     }
                     });
                    */
                }

            }
        }


        //EVENTS
        $(".gh-dropTextField").on("focus", function(){
            if( hasGhParams ) {
                for(key in paramObj){
                    if( (key+"").match(/css\-.*/) ){//set the style up for different elements inside the WRAPPER
                        wrapper.find( (key+"").substr(4) ).css( paramObj[key] );
                    }
                }
            }
        }).on("blur", function(){//reset the inline-style
            if( hasGhParams ) {
                for(key in paramObj){
                    if( (key+"").match(/css\-.*/) ){
                        wrapper.find( (key+"").substr(4) ).attr( "style", "" );
                    }
                }
            }
        });

        //delete PARAMs infoes from the HTML element (data- attribute)
        wrapper.find(".gh-dropTextField").removeAttr("data-gh-params");

        //sliding of the UL down/up
        $(".gh-cont-ico-dropTextField").on("click", function(){
            var ul = $(this).parents(".gh-wrap-dropTextField").find("ul");

            if( parseInt(ul.css("height"), 10) == 0){
                var liH = parseInt(ul.find("li:eq(1)").css("height"), 10);
                ul.css("height", (((ul.find("li").length-1) * liH) + 2) +"px");//(+ 2px) more is to make sure that the UL will be longer than list of LIs
            }
            else{ ul.css("height", "0px"); }
        });

        //fill the input text field after clicked on some LI
        $(".gh-wrap-dropTextField li").on("click", function(){
            var text = $(this).text();
            var inputField = $(this).parents(".gh-wrap-dropTextField").find(".gh-dropTextField");
            inputField.val(text);
            $(".gh-dropTextField").trigger("focus");
        });

    });//END each

}

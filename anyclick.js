
    (function($){

        var methods = {
            target:false,
            event:false,
            init:function( options ) {

                return this.each(function(){

                    if( !$(this).data('anymodal') ) {

                        $(this).data('anymodal', $.extend({
                            target: null,
                            type: "toggle", //"add", "remove",
                            triggerActive: "active",
                            targetActive: "active",
                            escButton: 1,
                            outerClick: 1
                        }, options)).on("click", function(ev){
                            methods[$(this).data("anymodal").type](ev);
                        });
                    }
                });
            },

            bind: function(ev){
                ev.stopPropagation();

                if(!methods.event){

                    var $this,data;

                    methods.event = ev;

                    $this = $(methods.event.target);
                    data = $this.data("anymodal");

                    $this.addClass(data.triggerActive).trigger("bind.anymodal");
                    $(data.target).addClass(data.targetActive);

                    if(data.outerClick){
                        $("body").on("click.anymodal", methods.onDomClick);
                    }
                    if(data.escButton){
                        $("body").on("keyup.anymodal", methods.onEscape);
                    }
                }
                else if( !$(methods.event.target).is($(ev.target)) ){
                    methods.unbind();
                    methods.bind(ev);
                }
                else {
                    event.stopPropagation();
                }
            },

            unbind: function(){

                if(methods.event){

                    var $this = $(methods.event.target),
                        data = $this.data("anymodal");

                    $this.removeClass(data.triggerActive).trigger("unbind.anymodal");
                    $(data.target).removeClass(data.targetActive);
                    methods.event = false;

                    $("body").off(".anymodal");
                }
            },

            toggle: function(ev){

                if(!methods.event){
                    methods.bind(ev);
                }
                else if( !$(methods.event.target).is( $(ev.target) ) ){
                    methods.unbind();
                    methods.bind(ev);
                }
                else {
                    methods.unbind();
                }
            },

            onDomClick: function(event){

                var data = $(methods.event.target).data("anymodal");

                if( !$(event.target).is( $(data.target) ) && !$(event.target).is($(data.target).find("*")) ){
                    methods.unbind();
                }
            },

            onEscape: function(){
                if(event.which === 27){
                    methods.unbind();
                }
            }
        };

        $.fn.anymodal = function( method ) {
            
            if ( methods[method] ) {
                return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
            } else if ( typeof method === 'object' || ! method ) {
                return methods.init.apply( this, arguments );
            } else {
                $.error( method + " method is not exist for jQuery.anymodal " );
            }
        };

    })( jQuery );
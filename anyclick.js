
    (function($){

        var methods = {
            target:false,
            event:false,
            init:function( options ) {

                var defaults = $.extend({
                    target: null,
                    action: "toggle",
                    triggerActive: "active",
                    targetActive: "active",
                    escButton: 1,
                    outerClick: 1,
                    beforeBind: function(){},
                    beforeUnbind: function(){},
                    afterBind: function(){},
                    afterUnbind: function(){}
                }, options);

                return this.each(function(){
                    if( !$(this).data('anymodal') ) {
                        $(this).data('anymodal', defaults).on("click", methods[defaults.action]);
                    }
                });
            },

            bind: function(ev){
                ev.stopPropagation();

                if(!methods.event){

                    methods.event = ev;
                    
                    var $this = $(ev.target),
                        data = $this.data("anymodal"),
                        targetNode = typeof data.target === "object" ? data.target : $(data.target);

                    data.beforeBind($this, targetNode);

                    $this.addClass(data.triggerActive);
                    targetNode.addClass(data.targetActive);

                    data.afterBind($this, targetNode);

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
                        data = $this.data("anymodal"),
                        targetNode = typeof data.target === "object" ? data.target : $(data.target);

                    data.beforeUnbind($this, targetNode);

                    $this.removeClass(data.triggerActive);
                    targetNode.removeClass(data.targetActive);

                    data.afterUnbind($this, targetNode);

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

            onDomClick: function(ev){
                
                var data = $(methods.event.target).data("anymodal"),
                    targetNode = typeof data.target === "object" ? data.target : $(data.target);

                if( !$(ev.target).is( targetNode ) && !$(ev.target).is( targetNode.find("*") ) ){
                    methods.unbind();
                }
            },

            onEscape: function(ev){
                if(ev.which === 27){
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
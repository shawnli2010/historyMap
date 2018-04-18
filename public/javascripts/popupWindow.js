$(document).ready(function(){

    /*
    We use this to hide the floating window in case they click outside it.
    As html will be 'everything', we will use then an stopPropagation event.
    */
    $('html, .close').click(function(){
        $('.selection').hide();
        $('#darkOverlay').hide();
        $("body").css("overflow", "visible");

    });
    

    /*
    Here we use the stopPropagation event in order to prevent hidding the 
    floating window when we click anywhere inside the #mainFloat element. 
    */
    $("#mainFloat").click(function(event){
        event.stopPropagation();
    });
    

    /*
    Adding the option to hide the windows by pressing the 'escape' (ESC) 
    key with the keyboard.
    */
    $(document).keyup(function(e) {
        if (e.keyCode == 27) {
            $('#darkOverlay').hide(); 
            $("body").css("overflow", "auto");
        }
    }); 


    /*
    Clicking over the .floatMenu selector, we will show the floating window.
    */
    $('.floatMenu').click(function(event){
        // Showing the floating window
        $('#darkOverlay').show();

        // Hidding the background page scroll 
        $("body").css("overflow", "hidden");

        /*default content for the first tab. (you could use
        JSON, .load, append... whatever you want */
        $("#infoContent").html('Hello world');

        // When clicking on the left tab menu...
        $('.floatCategory').click(function() {
            
            // Chaning the active tab... 
            $(this).parent().addClass("active").siblings().removeClass('active');

            //We have to know in which tab the user has clicked
            //so we take the attribute 'data-content' as an identifier of the tab
            var content = $(this).attr('data-content');

            /* Here you could do whatever you want, getting 
            info from JSON, using the .load function... having fun!!*/
            $("#infoContent").html(content);
        });

        /* In order to prevent hidding the floating window, as we are on the 'html' element.
        We have to stop the click event propagation so it won't reach 'html' */
        event.stopPropagation();
    });
    
});
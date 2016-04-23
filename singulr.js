/* global jQuery */


(function ($) {
    var history = [];
    var options = {
        test: true
    };
    var HOME_PAGE = 'home.html';
    var BASE_PAGE = 'base.html';
    var PAGE_ID = 'page';
    var CONTENT_ID = 'content';
    
    
    
    window.Singulr = function (userOptions) {
        // Add user options
        for (var option in userOptions) {
            options[option] = userOptions[option];
        }
        
        
        // load base
        $('#' + PAGE_ID).load(BASE_PAGE, function() {
            loadPage(HOME_PAGE);
        });
    };
    
    
    
    function bindEventHandlers() {
        // bind event handlers
        $('a').click(function(event) {
            event.preventDefault();
            var page = $(this).attr('href');
            
            loadPage(page);
            // push to history
            // history.push(page);
            console.log(history);
        });
        
        
        $('#back-arrow').click(function() {
            // goBack();
        });
    }
    
    
    function loadPage(page) {
        $('#' + CONTENT_ID).load(page, function() {
            bindEventHandlers();
        });
    }
    
    
    function goBack() {
        if (history.length === 1) {
            loadPage(HOME_PAGE);
        } else if (history.length > 1) {
            history.pop();
            var page = history[history.length - 1];
            loadPage(page);
        }
        console.log(history);
    }
})(jQuery);
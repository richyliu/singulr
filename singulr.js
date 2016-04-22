/* global $ */


(function () {
    var history = [];
    var options = {
        test: true
    };
    var HOME_PAGE = 'home.html'
    
    
    
    window.Singulr = function (userOptions) {
        // Add user options
        for (var option in userOptions) {
            options[option] = userOptions[option];
        }
        
        
        // load home page
        $('#page').load(HOME_PAGE, function() {
            bindEventHandlers();
        });
        
        
        // bindEventHandlers();
    };
    
    
    
    function bindEventHandlers() {
        // bind event handlers
        $('a').click(function(event) {
            event.preventDefault();
            // var page = $(this).attr('href');
            var page = $(this).attr('url');
            
            loadPage(page);
            // push to history
            history.push(page);
            console.log(history);
        });
        
        
        $('#back-arrow').click(function() {
            goBack();
        });
    }
    
    
    function loadPage(page) {
        $('#page').load(page);
        bindEventHandlers();
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
})();
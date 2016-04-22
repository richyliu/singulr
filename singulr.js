/* global $ */


(function () {
    var history = [];
    var options = {
        test: true
    };
    
    
    
    window.Singulr = function (userOptions) {
        // Add user options
        for (var option in userOptions) {
            options[option] = userOptions[option];
        }
        
        
        
        // load home page
        loadPage('home.html');
        
        
        
        // bind event handlers
        $('a').click(function(event) {
            event.preventDefault();
            var page = $(this).attr('href');
            
            loadPage(page);
            // push to history
            history.push(page);
            
            console.log(history);
        });
        
        
        $('#back-arrow').click(function() {
            goBack();
        });
    };
    
    
    
    
    function loadPage(page) {
        $('#page').load(page);
    }
    
    
    function goBack() {
        if (!history.length < 1) {
            var page = history.pop();
            loadPage(page);
        }
    }
})();
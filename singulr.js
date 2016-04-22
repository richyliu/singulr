/* global $ */

(function () {
    window.Singulr = function (userOptions) {
        // Default options
        var options = {
            test: true
        }
        
        // Add user options
        for (var option in userOptions) {
            options[option] = userOptions[option];
        }
        
        $('a').click(function(event) {
            event.preventDefault();
            
            $('#page').load($(this).attr('href'));
        });
    }
})();
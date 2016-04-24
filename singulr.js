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
        
        console.log(options);
        if (options.homePage !== undefined) HOME_PAGE = options.homePage;
        if (options.basePage !== undefined) BASE_PAGE = options.basePage;
        if (options.pageId !== undefined) PAGE_ID = options.pageId;
        if (options.contentId !== undefined) CONTENT_ID = options.contentId;
        if (options.alteredHistory !== undefined) history = options.alteredHistory;
        
        
        // load base
        $('#' + PAGE_ID).load(BASE_PAGE, function() {
            loadPage(HOME_PAGE);
        });
    };
    
    
    
    function bindEventHandlers() {
        // unbind event handlers to make sure
        $('a').unbind();
        $('#back-arrow').unbind();
        
        // bind event handlers
        $('a').click(function(event) {
            event.preventDefault();
            var page = $(this).attr('href');
            // console.log(page);
            
            loadPage(page);
            // push to history
            // history.push(page);
        });
        
        
        $('#back-arrow').click(function() {
            // goBack();
        });
    }
    
    
    function loadPage(page) {
        $('#' + CONTENT_ID).load(page, function(result) {
            bindEventHandlers();
            
            var html = $.parseXML('<t>' + result + '</t>');
            
            
            window.html = html;
            if (html.childNodes[0].childNodes[0].getAttribute('id') === 'css-override') {
                var override = html.childNodes[0].childNodes[0].getAttribute('id');
                
            // style tags
            } else if (html.getElementsByTagName('style') !== []) {
                var styles = html.getElementsByTagName('style');
                var cssCode = [];
                var cssSrc = [];
                window.styles = styles;
                
                // use both the content and src attribute
                for (var i = 0; i < styles.length; i++) {
                    var css = styles[i].childNodes[0].nodeValue;
                    var src = styles[i].getAttribute('src');
                    cssCode.push(css);
                    cssSrc.push(src);
                }
                
                console.log(cssCode);
                console.log(cssSrc);
            }
            console.log(html);
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
        // console.log(history);
    }
})(jQuery);
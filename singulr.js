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
    var STYLE_CLASS = 'css-style';
    
    
    
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
        if (options.styleClass !== undefined) STYLE_CLASS = options.styleClass;
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
        $('#' + CONTENT_ID).load(page, function(response) {
            bindEventHandlers();
            
            // clear css
            
            
            // the t is there to make it valid xml
            var html = $.parseXML('<t>' + response + '</t>');
            var cssCode = [];
            var cssSrc = [];
            var result;
            
            
            window.html = html;
            
            if (html.childNodes[0].childNodes[0].getAttribute('id') === 'css-override') {
                result = getCssFromElement(html.childNodes[0].childNodes[0].getElementsByClassName('css-style'));
                cssCode = result[0];
                cssSrc = result[1];
                
                // override, so remove all css except for singulr.css
                
                
                // apply cssCode and cssSrc
                for (var i = 0; i < cssCode.length; i++) {
                    $('head').append('<style>' + cssCode[i] + '</style>');
                }
                for (var i = 0; i < cssSrc.length; i++) {
                    $('head').append('<link rel="stylesheet" type="text/css" href="' + cssSrc[i] + '">');
                }
            // style tags
            } else if (html.getElementsByClassName('css-style') !== []) {
                result = getCssFromElement(html.getElementsByClassName('css-style'));
                cssCode = result[0];
                cssSrc = result[1];
                
                // apply cssCode and cssSrc
                for (var i = 0; i < cssCode.length; i++) {
                    $('head').append('<style>' + cssCode[i] + '</style>');
                }
                for (var i = 0; i < cssSrc.length; i++) {
                    $('head').append('<link rel="stylesheet" type="text/css" href="' + cssSrc[i] + '">');
                }
            }
            
            
            // parse cssCode and cssSrc
            console.log(cssCode);
            console.log(cssSrc);
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
    
    
    function getCssFromElement(element) {
        var styles = element;
        var css;
        var src;
        var cssCode = [];
        var cssSrc = [];
        
        // use both the content and src attribute
        for (var i = 0; i < styles.length; i++) {
            css = styles[i].childNodes[0].nodeValue;
            src = styles[i].getAttribute('src');
            cssCode.push(css);
            cssSrc.push(src);
        }
        
        return [cssCode, cssSrc];
    }
    
    
    // WIP
    // http://www.jquerybyexample.net/2012/06/get-url-parameters-using-jquery.html
    function getPage(sParam) {
        return window.location.search.substring(1);
    }
    
    window.gup = getPage;

})(jQuery);
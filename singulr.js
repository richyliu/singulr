/* global jQuery */


/*
    TODO:
    - load scripts
    - give every page its own url
*/

(function ($) {
    var history = [];
    var currentPage = '';
    var options = {
        test: true
    };
    
    var Constants = {
        HOME_PAGE: 'home.html',
        BASE_PAGE: 'base.html',
        PAGE_ID: 'page',
        CONTENT_ID: 'content',
        STYLE_CLASS: 'css-style',
        STYLE_OVERRIDE_ID: 'css-override',
        SCRIPT_CLASS: 'js-style',
        SCRIPT_OVERRIDE_ID: 'js-override',
        TITLE_ID: 'page-title',
        DEFAULT_CSS: [],
        DEFAULT_JS: []
    };
    
    // var HOME_PAGE = 'home.html';
    // var BASE_PAGE = 'base.html';
    // var PAGE_ID = 'page';
    // var CONTENT_ID = 'content';
    // var STYLE_CLASS = 'css-style';
    // var DEFAULT_CSS = [];
    // var DEFAULT_JS = [];
    
    
    
    window.Singulr = function (userOptions) {
        // Add user options
        for (var option in userOptions) {
            options[option] = userOptions[option];
        }
        
        console.log(options);
        if (options.homePage !== undefined) Constants.HOME_PAGE = options.homePage;
        if (options.basePage !== undefined) Constants.BASE_PAGE = options.basePage;
        if (options.pageId !== undefined) Constants.PAGE_ID = options.pageId;
        if (options.contentId !== undefined) Constants.CONTENT_ID = options.contentId;
        if (options.styleClass !== undefined) Constants.STYLE_CLASS = options.styleClass;
        if (options.alteredHistory !== undefined) history = options.alteredHistory;
        if (options.defaultCss !== undefined) Constants.DEFAULT_CSS = options.defaultCss;
        if (options.defaultJs !== undefined) Constants.DEFAULT_JS = options.defaultJs;
        
        
        // load base
        ajaxLoad(Constants.PAGE_ID, Constants.BASE_PAGE, function() {
            loadPage(Constants.HOME_PAGE);
        });
    };
    
    
    
    function bindEventHandlers() {
        // unbind other event handlers
        var elements = document.getElementsByTagName('a');
        for (var i = 0; i < elements.length; i++) {
            elements[i].removeEventListener('click', onclick);
        }
        // document.getElementById('back-arrow').removeEventListener('click');
        
        
        // bind event handlers
        elements = document.getElementsByTagName('a');
        for (var i = 0; i < elements.length; i++) {
            elements[i].addEventListener('click', onclick);
        }
        
        function onclick() {
            event.preventDefault();
            var page = this.getAttribute('href');
            // console.log(page);
            
            if (currentPage !== page) {
                loadPage(page);
                currentPage = page;
            }
            // push to history
            // history.push(page);
        }
        
        
        // document.getElementById('back-arrow').addEventListener('click', function () {
        //     goBack();
        // });
    }
    
    
    function loadPage(page) {
        ajaxLoad(Constants.CONTENT_ID, page, function(response) {
            bindEventHandlers();
            
            // the t is there to make it valid xml
            var html = $.parseXML('<t>' + response + '</t>');
            var cssCode = [];
            var cssSrc = [];
            var result;
            var jsCode = [];
            var jsSrc = [];
            
            
            window.html = html;
            
            
            /* set title */
            
            if (html.getElementById(Constants.TITLE_ID) !== null) {
                document.title = html.getElementById(Constants.TITLE_ID).innerHTML;
            }
            
            
            /* load css */
            
            // style override
            if (html.getElementById(Constants.STYLE_OVERRIDE_ID) !== null) {
                result = getCssFromElement(html.getElementById(Constants.STYLE_OVERRIDE_ID));
                cssCode = result[0];
                cssSrc = result[1];
                
                // override, so remove all css except for singulr.css
                var links = document.querySelectorAll('head link');
                var styles = document.querySelectorAll('head style');
                window.links = links;
                for (var i = 0; i < links.length; i++) {
                    if (links[0].getAttribute('href').match(/singulr/g) === null) {
                        links[i].parentElement.removeChild(links[i]);
                    }
                }
                for (var i = 0; i < styles.length; i++) {
                    styles[i].parentElement.removeChild(styles[i]);
                }
                
                // apply cssCode and cssSrc
                for (var i = 0; i < cssCode.length; i++) {
                    document.getElementsByTagName('head')[0].appendChild(str2Element('<style>' + cssCode[i] + '</style>'));
                }
                for (var i = 0; i < cssSrc.length; i++) {
                    document.getElementsByTagName('head')[0]
                        .appendChild(str2Element('<link rel="stylesheet" type="text/css" href="' + cssSrc[i] + '">'));
                }
            // style tags
            } else if (html.getElementsByClassName(Constants.STYLE_CLASS) !== []) {
                result = getCssFromElement(html.getElementsByClassName(Constants.STYLE_CLASS));
                cssCode = result[0];
                cssSrc = result[1];
                
                // apply cssCode and cssSrc
                for (var i = 0; i < cssCode.length; i++) {
                    document.getElementsByTagName('head')[0].appendChild(str2Element('<style>' + cssCode[i] + '</style>'));
                }
                for (var i = 0; i < cssSrc.length; i++) {
                    document.getElementsByTagName('head')[0]
                        .appendChild(str2Element('<link rel="stylesheet" type="text/css" href="' + cssSrc[i] + '">'));
                }
            }
            
            /* load scripts */
            
            
            
        });
    }
    
    
    function goBack() {
        if (history.length === 1) {
            loadPage(Constants.HOME_PAGE);
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
    
    
    function ajaxLoad(elementId, url, callback) {
        $('#' + elementId).load(url, callback);
    }
    
    
    // WIP
    // http://www.jquerybyexample.net/2012/06/get-url-parameters-using-jquery.html
    function getPage(sParam) {
        return window.location.search.substring(1);
    }
    
    window.gup = getPage;


    // http://krasimirtsonev.com/blog/article/Revealing-the-magic-how-to-properly-convert-HTML-string-to-a-DOM-element
    var str2Element = function(html) {
        var wrapMap = {
            option: [1, "<select multiple='multiple'>", "</select>"],
            legend: [1, "<fieldset>", "</fieldset>"],
            area: [1, "<map>", "</map>"],
            param: [1, "<object>", "</object>"],
            thead: [1, "<table>", "</table>"],
            tr: [2, "<table><tbody>", "</tbody></table>"],
            col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
            td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
            body: [0, "", ""],
            _default: [1, "<div>", "</div>"]
        };
        wrapMap.optgroup = wrapMap.option;
        wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
        wrapMap.th = wrapMap.td;
        var match = /<\s*\w.*?>/g.exec(html);
        var element = document.createElement('div');
        if (match != null) {
            var tag = match[0].replace(/</g, '').replace(/>/g, '').split(' ')[0];
            if (tag.toLowerCase() === 'body') {
                var dom = document.implementation.createDocument('http://www.w3.org/1999/xhtml', 'html', null);
                var body = document.createElement("body");
                // keeping the attributes
                element.innerHTML = html.replace(/<body/g, '<div').replace(/<\/body>/g, '</div>');
                var attrs = element.firstChild.attributes;
                body.innerHTML = html;
                for (var i = 0; i < attrs.length; i++) {
                    body.setAttribute(attrs[i].name, attrs[i].value);
                }
                return body;
            }
            else {
                var map = wrapMap[tag] || wrapMap._default,
                    element;
                html = map[1] + html + map[2];
                element.innerHTML = html;
                // Descend through wrappers to the right content
                var j = map[0] + 1;
                while (j--) {
                    element = element.lastChild;
                }
            }
        }
        else {
            element.innerHTML = html;
            element = element.lastChild;
        }
        return element;
    }
})(jQuery);
/* global jQuery */
/* global DOMParser */


/*
    TODO:
    - give every page its own url (example.com/#!about?foo=bar&more=0)
*/

(function () {
    var currentPage = '';
    var addedContent = [];
    var options = {
        test: true
    };
    
    var Constants = {
        HOME_PAGE: 'home.html',
        BASE_PAGE: 'base.html',
        PAGE_ID: 'page',
        CONTENT_ID: 'content',
    };
    
    
    
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
        }
    }
    
    
    function loadPage(page) {
        // remove previous page's js and css
        if (addedContent !== []) {
            window.ac = addedContent;
            for (var i = 0; i < addedContent.length; i++) {
                removeNode(addedContent[i]);
            }
            addedContent = [];
        }
        
        
        ajaxLoad(Constants.CONTENT_ID, page, function(response) {
            bindEventHandlers();
            
            // check if page is valid
            if (!response || typeof response !== "string") {
                throw 'Invalid page xml';
            }
            // the t is there to make it valid xml
            var html = (new DOMParser()).parseFromString('<t>' + response + '</t>', 'text/xml');
            var cssCode;
            var cssSrc;
            var jsCode = [];
            var jsSrc = [];
            var temp;
            
            
            
            /* set title */
            
            var titleElement = html.getElementsByTagName('title')[0];
            if (titleElement !== null && titleElement !== '') {
                document.title = titleElement.innerHTML;
            }
            
            
            /* load css */
            
            if (html.getElementsByTagName('style') !== []) {
                var styleElements = html.getElementsByTagName('style');
                
                for (var i = 0; i < styleElements.length; i++) {
                    cssCode = styleElements[i].innerHTML;
                    if (cssCode !== '') {
                        temp = str2Element('<style>' + cssCode + '</style>');
                        document.getElementsByTagName('head')[0].appendChild(temp);
                        addedContent.push(temp);
                    }
                    
                    removeNode(styleElements[i]);
                }
            }
            if (html.getElementsByTagName('link') !== []) {
                var linkElements = html.getElementsByTagName('style');
                
                for (var i = 0; i < linkElements.length; i++) {
                    cssSrc = linkElements[i].getAttribute('src');
                    temp = str2Element('<link rel="stylesheet" type="text/css" href="' + cssSrc + '">');
                    document.getElementsByTagName('head')[0].appendChild(temp);
                    addedContent.push(temp);
                    
                    removeNode(linkElements[i]);
                }
            }
            
            
            /* load scripts */
            
            if (html.getElementsByTagName('script') !== []){
                var scriptElements = html.getElementsByTagName('script');
                
                for (var i = 0; i < scriptElements.length; i++) {
                    jsSrc = scriptElements[i].getAttribute('src');
                    jsCode = scriptElements[i].innerHTML;
                    if (jsSrc !== null) {
                        temp = str2Element('<script src="' + jsSrc + '"></script>');
                        document.getElementsByTagName('body')[0].appendChild(temp);
                        addedContent.push(temp);
                    } else if (jsCode !== '') {
                        temp = str2Element('<script>' + jsCode + '</script>');
                        document.getElementsByTagName('body')[0].appendChild(temp);
                        addedContent.push(temp);
                    }
                    
                    removeNode(scriptElements[i]);
                }
            }
            
            
            window.html = html;
        });
    }
    
    
    function ajaxLoad(elementId, url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                document.getElementById(elementId).innerHTML = xhr.responseText;
                callback(xhr.responseText);
            }
        };
        
        xhr.send();
    }
    
    function removeNode(node) {
        if (node === undefined || node === null) {
            throw 'No node provided';
        } else if (node.parentNode === null) {
            throw 'Node has been already removed';
        } else {
            node.parentNode.removeChild(node);
        }
    }
    
    
    // WIP
    // http://www.jquerybyexample.net/2012/06/get-url-parameters-using-jquery.html
    function getPage(sParam) {
        return window.location.search.substring(1);
    }
    
    // window.gup = getPage;


    // http://krasimirtsonev.com/blog/article/Revealing-the-magic-how-to-properly-convert-HTML-string-to-a-DOM-element
    var str2Element=function(t){var e={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],area:[1,"<map>","</map>"],param:[1,"<object>","</object>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>",
    "</tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],body:[0,"",""],_default:[1,"<div>","</div>"]};e.optgroup=e.option,e.tbody=e.tfoot=e.colgroup=e.caption=e.thead,
    e.th=e.td;var l=/<\s*\w.*?>/g.exec(t),a=document.createElement("div");if(null!=l){var o=l[0].replace(/</g,"").replace(/>/g,"").split(" ")[0];if("body"===o.toLowerCase()){var r=(document.implementation.createDocument("http://www.w3.org/1999/xhtml",
    "html",null),document.createElement("body"));a.innerHTML=t.replace(/<body/g,"<div").replace(/<\/body>/g,"</div>");var d=a.firstChild.attributes;r.innerHTML=t;for(var n=0;n<d.length;n++)r.setAttribute(d[n].name,d[n].value);return r}var a,i=e[o]||
    e._default;t=i[1]+t+i[2],a.innerHTML=t;for(var b=i[0]+1;b--;)a=a.lastChild}else a.innerHTML=t,a=a.lastChild;return a};
})();
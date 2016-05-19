/*! Singulr v0.1.0 | (c) Richard Liu | MIT License */
/*
    TODO:
     - allow href's with url parameters
     - 404 page
     - init. things like trackers on every load
     - styles applied to body aren't applied
     - only add link rel="stylesheet"
     - accept seperate pages which do not follow base
     
     
     
     - compress code using yui compressor
     - or use closure (http://closure-compiler.appspot.com/home)
     - dynamically change favicon
*/


// (function () {
    var currentPage = '';
    var addedContent = [];
    var removalQueue = [];
    var options = {
        onPageLoaded: function() {},
        analyticsScripts: []
    };
    
    var Constants = {
        HOME_PAGE: 'home.html',
        BASE_PAGE: 'base.html',
        PAGE_ID: 'page',
        CONTENT_ID: 'content',
        SWIPE_TO_ID: 'swipe-to',
        SWIPE_FROM_ID: 'page'
    };
    
    
    
    
    window.Singulr = {
        init: function (userOptions) {
            // Add user options
            for (var option in userOptions) {
                if (options[option] !== undefined) {
                    options[option] = userOptions[option];
                } else if (Constants[option] !== undefined) {
                    Constants[option] = userOptions[option];
                }
            }
            
            
            // load base on startup
            ajaxLoad(Constants.PAGE_ID, Constants.BASE_PAGE, function() {
                if (getPage() !== null && getPage() !== currentPage) {
                    loadPage(getFullPage());
                } else {
                    loadPage(Constants.HOME_PAGE);
                }
            });
        },
        getPage: getPage,
        loadPage: loadPage
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
        if (window.onhashchange === null) {
            window.onhashchange = onhashchange;
        }
        
        
        function onclick() {
            var page = this.getAttribute('href');
            
            
            // http://stackoverflow.com/questions/10687099/how-to-test-if-a-url-string-is-absolute-or-relative
            // direct url
            if (page.search(new RegExp('^(?:[a-z]+:)?//', 'i')) > -1) {
                return;
            }
                
            loadPage(page);
            
            event.preventDefault();
        }
        
        function onhashchange() {
            loadPage(getFullPage());
        }
    }
    
    
    
    function loadPage(page) {
        setPage(page);
        
        var requestPage;
        if (page.search(/\?/) > -1) {
            requestPage = page.slice(0, page.search(/\?/));
        } else {
            requestPage = page;
        }
        if (requestPage === currentPage) return;
        currentPage = requestPage;
        
        
        ajaxLoad(Constants.CONTENT_ID, requestPage, function(response) {
            // remove previous page's js and css
            if (addedContent !== []) {
                for (var i = 0; i < addedContent.length; i++) {
                    addNodeToRemovalQueue(addedContent[i]);
                }
                removeNodesInQueue();
                addedContent = [];
            }
            
            bindEventHandlers();
            
            
            // check if page is valid
            if (!response || typeof response !== 'string') {
                throw 'Invalid page';
            }
            
            var html = document.implementation.createHTMLDocument();
            // has enclosing html tags
            if (response.search('<html>') > -1) {
                html.body.parentElement.innerHTML = response;
            } else {
                html.body.parentElement.innerHTML = '<html>' + response + '</html>';
            }
            
            
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
                        temp = document.createElement('style');
                        temp.innerHTML = cssCode;
                        document.getElementsByTagName('head')[0].appendChild(temp);
                        addedContent.push(temp);
                    }
                    
                    addNodeToRemovalQueue(styleElements[i]);
                }
            }
            if (html.getElementsByTagName('link') !== []) {
                var linkElements = html.getElementsByTagName('link');
                
                for (var i = 0; i < linkElements.length; i++) {
                    cssSrc = linkElements[i].getAttribute('href');
                    temp = document.createElement('link');
                    temp.rel = 'stylesheet';
                    temp.type = 'text/css';
                    temp.href = cssSrc;
                    document.getElementsByTagName('head')[0].appendChild(temp);
                    addedContent.push(temp);
                    
                    addNodeToRemovalQueue(linkElements[i]);
                }
            }
            
            
            /* load scripts */
            if (html.getElementsByTagName('script') !== []){
                var scriptElements = html.getElementsByTagName('script');
                
                for (var i = 0; i < scriptElements.length; i++) {
                    jsSrc = scriptElements[i].getAttribute('src');
                    jsCode = scriptElements[i].innerHTML;
                    if (jsSrc !== null) {
                        temp = document.createElement('script');
                        temp.src = jsSrc;
                        document.getElementsByTagName('body')[0].appendChild(temp);
                        addedContent.push(temp);
                    } else if (jsCode !== '') {
                        temp = document.createElement('script');
                        temp.innerHTML = jsCode;
                        document.getElementsByTagName('body')[0].appendChild(temp);
                        addedContent.push(temp);
                    }
                    addNodeToRemovalQueue(scriptElements[i]);
                }
            }
            
            /* load analytics scripts */
            var as = options.analyticsScripts;
            if (as.length > 0) {
                for (var i = 0; i < as.length; i++) {
                    temp = document.createElement('script');
                    temp.src = as[i];
                    document.getElementsByTagName('body')[0].appendChild(temp);
                    addedContent.push(temp);
                }
            }
            
            
            removeNodesInQueue();
            
            return html.documentElement.getElementsByTagName('body')[0].innerHTML;
        });
    }
    
    
    
    // callback needs to return the html to be added (type string)
    function ajaxLoad(elementId, url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var res = callback(xhr.responseText);
                if (typeof res === 'string') {
                    document.getElementById(elementId).innerHTML = res;
                } else if (res === undefined) {
                    document.getElementById(elementId).innerHTML = xhr.responseText;
                } else {
                    throw new Error('Invalid callback return!');
                }
                options.onPageLoaded();
            }
        };
        
        xhr.send();
    }
    
    
    
    // removal queue needed because removing a node while iterating through a
    // list of nodes has bad effects
    function addNodeToRemovalQueue(node) {
        if (node === undefined || node === null) {
            throw new Error('No node provided');
        } else if (node.parentNode === null) {
            throw new Error('Node has been already removed');
        } else {
            removalQueue.push(node);
        }
    }
    
    
    function removeNodesInQueue() {
        for (var i = 0; i < removalQueue.length; i++) {
            var node = removalQueue[i];
            node.parentNode.removeChild(node);
        }
        removalQueue = [];
    }
    
    
    
    function setPage(page) {
        window.location.href = `${window.location.protocol}//${window.location.host + window.location.pathname}#!${page}`;
    }
    
    
    function getFullPage() {
        var hash = window.location.hash;
        
        return (hash[1] === '!') ? hash.slice(2) : null;
    }
    
    
    function getPage() {
        var hash = window.location.hash;
        
        if (hash[1] === '!') {
            var page = hash.slice(2);
            if (page.search(/\?/) > -1) {
                return page.slice(0, page.search(/\?/));
            } else {
                return page;
            }
        } else {
            return null;
        }
    }
// }());
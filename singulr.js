/*! Singulr v0.1.0 | (c) Richard Liu | MIT License */
/*
    BUGS:
     - 
    
    FEATURES:
     - accept seperate pages which do not follow base
     - nested pages (hello/foo.html)
     - dynamically change favicon
     
     - compress code with Google Closure (http://closure-compiler.appspot.com/home)
    
    NOTES:
     - styles applied to body aren't applied
*/


// (function () {
    var currentPage = '';
    var addedContent = [];
    var removalQueue = [];
    var addOnLoad = [];
    
    var options = {
        onPageLoaded: function() {},
        onCurrentPageLoad: function() {},
        analyticNodes: [],
        HOME_PAGE: 'home.html',
        BASE_PAGE: 'base.html',
        PAGE_404: '404.html',
        PAGE_ID: 'page',
        CONTENT_ID: 'content',
    };
    
    
    
    
    window.Singulr = {
        init: function (userOptions) {
            // Add user options
            for (var option in userOptions) {
                if (userOptions.hasOwnProperty(option) && options[option] !== undefined) {
                    options[option] = userOptions[option];
                }
            }
            
            
            // load base on startup
            ajaxLoad(options.PAGE_ID, options.BASE_PAGE, function() {
                if (getPage() !== null && getPage() !== currentPage) {
                    loadPage(getFullPage());
                } else {
                    loadPage(options.HOME_PAGE);
                }
            });
        },
        getPage: getPage,
        loadPage: loadPage,
        onCurrentPageLoad: function(func) {
            if (typeof func === 'function') options.onCurrentPageLoad = func; 
        }
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
        
        try {
            ajaxLoad(options.CONTENT_ID, requestPage, callback);
        } catch (e) {
            console.error(e);
            loadPage(options.PAGE_404);
        }
        
        function callback (response) {
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
                    if (cssCode !== '' && styleElements[i].getAttribute('rel') === 'stylesheet') {
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
            
            
            /* load scripts in head */
            if (html.getElementsByTagName('head')[0].getElementsByTagName('script') !== []){
                var scriptElements = html.getElementsByTagName('head')[0].getElementsByTagName('script');
                
                for (var i = 0; i < scriptElements.length; i++) {
                    jsSrc = scriptElements[i].getAttribute('src');
                    jsCode = scriptElements[i].innerHTML;
                    if (jsSrc !== null) {
                        temp = document.createElement('script');
                        temp.src = jsSrc;
                        document.getElementsByTagName('head')[0].appendChild(temp);
                        addedContent.push(temp);
                    } else if (jsCode !== '') {
                        temp = document.createElement('script');
                        temp.innerHTML = jsCode;
                        document.getElementsByTagName('head')[0].appendChild(temp);
                        addedContent.push(temp);
                    }
                    addNodeToRemovalQueue(scriptElements[i]);
                }
            }
            
            
            /* deferr scripts loading in body */
            if (html.getElementsByTagName('body')[0].getElementsByTagName('script') !== []){
                scriptElements = html.getElementsByTagName('body')[0].getElementsByTagName('script');
                
                console.log(scriptElements)
                
                for (var i = 0; i < scriptElements.length; i++) {
                    jsSrc = scriptElements[i].getAttribute('src');
                    jsCode = scriptElements[i].innerHTML;
                    if (jsSrc !== null) {
                        temp = document.createElement('script');
                        temp.src = jsSrc;
                        addOnLoad.push(temp);
                    } else if (jsCode !== '') {
                        temp = document.createElement('script');
                        temp.innerHTML = jsCode;
                        addOnLoad.push(temp);
                    }
                    addNodeToRemovalQueue(scriptElements[i]);
                }
            }
            
            
            /* load analytic nodes */
            var an = options.analyticNodes;
            if (an.length > 0) {
                for (var i = 0; i < an.length; i++) {
                    document.getElementsByTagName('body')[0].appendChild(an[i]);
                    addedContent.push(an[i]);
                }
            }
            
            
            removeNodesInQueue();
            
            return html.documentElement.getElementsByTagName('body')[0].innerHTML;
        }
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
            } else if (xhr.status === 404) {
                loadPage(options.PAGE_404);
            }
            
            options.onCurrentPageLoad();
            for (var i = 0; i < addOnLoad.length; i++) {
                document.getElementsByTagName('body')[0].appendChild(addOnLoad[i]);
                addedContent.push(addOnLoad[i]);
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
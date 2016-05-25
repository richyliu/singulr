/*! Singulr v0.0.1r1 | (c) Richard Liu | MIT License */
/*
    BUGS:
     - var something is not exposed to the global scope (but window.something is) (eval)
    
    FEATURES:
     - loading screen and defer loading of unnecessary css
     - accept seperate pages which do not follow base
     - dynamically change favicon
     
     - compress code with Google Closure (http://closure-compiler.appspot.com/home)
    
    NOTES:
     - styles applied to body aren't applied
     - snippet needs to be added at the top of every file
         <script id="singulr-ignore">var a=window.location.href;window.location.href='index.html?'+a.substr(a.lastIndexOf('/')+1)</script>
     - the index.html can be changed in the above
     - INDEX_PATH must be followed by a /. Ex:
         Valid:
             /foo/
             /foo/bar/
             / (default)
         Invalid:
             /foo
             bar/
              (empty string)
    
*/


// (function () {
    var currentPage = '';
    var addedContent = [];
    var removalQueue = [];
    var addOnLoad = [];
    var allScripts = [];
    
    var options = {
        onPageLoaded: function() {},
        onCurrentPageLoad: function() {},
        analyticNodes: [],
        HOME_PAGE: 'home.html',
        BASE_PAGE: 'base.html',
        PAGE_404: '404.html',
        PAGE_ID: 'page',
        CONTENT_ID: 'content',
        INDEX_PATH: '/'
    };
    
    
    String.prototype.allIndexOf = function (lookFor) {
        var indices = [];
        for (var i = 0; i < this.length; i++) {
            if (this[i] === lookFor) indices.push(i);
        }
        return indices;
    };
    
    
    
    
    window.Singulr = {
        init: function (userOptions) {
            // Add user options
            if (userOptions !== undefined) {
                for (var option in userOptions) {
                    if (userOptions.hasOwnProperty(option) && options[option] !== undefined) {
                        options[option] = userOptions[option];
                    }
                }
            }
            
            
            // load base on startup
            ajaxLoad(options.PAGE_ID, options.BASE_PAGE, function() {
                var curFullPageUrl = window.location.href.substr(window.location.href.lastIndexOf('/') + 1);
                curFullPageUrl = curFullPageUrl.substr(curFullPageUrl.indexOf('?') + 1);
                console.log('startup url: ' + curFullPageUrl);
                replacePage(curFullPageUrl);
                if (curFullPageUrl.length > 0 && getPageWithFolder() !== currentPage) {
                    loadPageExternal(curFullPageUrl);
                } else {
                    loadPage(options.HOME_PAGE);
                }
            });
        },
        getPage: getPageWithFolder,
        loadPage: loadPageExternal,
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
        if (window.onpopstate === null) {
            window.onpopstate = onpopstate;
        }
        
        
        function onclick() {
            var page = this.getAttribute('href');
            
            // http://stackoverflow.com/questions/10687099/how-to-test-if-a-url-string-is-absolute-or-relative
            // absolute url
            if (page.search(new RegExp('^(?:[a-z]+:)?//', 'i')) > -1 || page === currentPage) {
                return;
            }    
            loadPageExternal(page);
            
            event.preventDefault();
        }
        
        function onpopstate(event) {
            loadPage(document.location.href.substr(document.location.href.lastIndexOf('/') + 1));
        }
    }
    
    
    
    function loadPageExternal(page) {
        setPage(page);
        loadPage(page);
    }
    
    
    function loadPage(page) {
        currentPage = options.INDEX_PATH + page;
        printStackTrace();
        
        try {
            ajaxLoad(options.CONTENT_ID, currentPage, callback);
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
                    if (linkElements[i].getAttribute('rel') === 'stylesheet') {
                        cssSrc = linkElements[i].getAttribute('href');
                        temp = document.createElement('link');
                        temp.rel = 'stylesheet';
                        temp.type = 'text/css';
                        temp.href = cssSrc;
                        document.getElementsByTagName('head')[0].appendChild(temp);
                        addedContent.push(temp);
                    }
                    
                    addNodeToRemovalQueue(linkElements[i]);
                }
            }
            
            
            /* load scripts in head */
            var allScripts = [];
            if (html.getElementsByTagName('head')[0].getElementsByTagName('script') !== []){
                var scriptElements = html.getElementsByTagName('head')[0].getElementsByTagName('script');
                
                for (var i = 0; i < scriptElements.length; i++) {
                    if (scriptElements[i].getAttribute('id') === 'singulr-ignore') {
                        continue;
                    }
                    jsSrc = scriptElements[i].getAttribute('src');
                    jsCode = scriptElements[i].innerHTML;
                    if (jsSrc !== null) {
                        allScripts.push(['src', jsSrc]);
                    } else if (jsCode !== '') {
                        allScripts.push(['code', jsCode]);
                    }
                    addNodeToRemovalQueue(scriptElements[i]);
                }
            }
            loadScripts(allScripts);
            
            
            /* deferr scripts loading in body */
            if (html.getElementsByTagName('body')[0].getElementsByTagName('script') !== []){
                scriptElements = html.getElementsByTagName('body')[0].getElementsByTagName('script');
                
                for (var i = 0; i < scriptElements.length; i++) {
                    if (scriptElements[i].getAttribute('id') === 'singulr-ignore') {
                        continue;
                    }
                    jsSrc = scriptElements[i].getAttribute('src');
                    jsCode = scriptElements[i].innerHTML;
                    if (jsSrc !== null) {
                        addOnLoad.push(['src', jsSrc]);
                    } else if (jsCode !== '') {
                        addOnLoad.push(['code', jsCode]);
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
                // loadPage(options.PAGE_404);
            }
            
            loadScripts(addOnLoad);
            addOnLoad = [];
            
            options.onCurrentPageLoad();
        };
        
        xhr.send();
    }
    
    
    
    function getScript(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                globalEval(xhr.responseText);
                if (typeof callback === 'function') {
                    callback();
                }
            }
        };
        
        xhr.send();
    }
    
    
    function loadScripts(scripts) {
        if (scripts.length === 0) {
            return;
        }
        
        allScripts = [];
        allScripts = scripts;
        
        miniLoadScripts(0);
    }
    
    
    function miniLoadScripts(currentIndex) {
        if (allScripts[currentIndex][0] === 'src') {
            getScript(allScripts[currentIndex][1], function() {
                if (allScripts[currentIndex + 1] !== undefined) {
                    miniLoadScripts(currentIndex + 1);
                }
            });
        } else if (allScripts[currentIndex][0] === 'code') {
            globalEval(allScripts[currentIndex][1]);
            if (allScripts[currentIndex + 1] !== undefined) {
                miniLoadScripts(currentIndex + 1);
            }
        }
    }
    
    
    
    // removal queue needed because removing a node while iterating through a
    // list of nodes has bad effects
    function addNodeToRemovalQueue(node) {
        if (node === undefined || node === null) {
            if (typeof console.warn !== 'function') {
                console.warn('No node provided');
            } else {
                console.log('No node provided');
            }
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
        window.history.pushState({}, '', page);
    }
    
    function replacePage(page) {
        window.history.replaceState({}, '', page);
    }
    
    
    function getFullPage() {
        // matches hello.html#hello?poo=1 in:
        /*
            https://example.com/folder/hello.html#hello?poo=1
        */
        return window.location.href.substr(window.location.href.lastIndexOf("/") + 1);
    }
    
    
    function getPage() {
        if (window.location.href.lastIndexOf('/') === window.location.href.length - 1) {
            return options.HOME_PAGE;
        } else {
            // matches hello.html in:
            /*
                https://example.com/folder/hello.html#hello?poo=1
                https://example.com/folder/hello.html?poo=1
                https://example.com/folder/hello.html
            */
            return window.location.href.match(/\/[\w\%\-\_]+\.[a-zA-Z]+(?:(?=#|\?)|$)/)[0].substr(1);
        }
    }
    
    
    function getPageWithFolder() {
        if (window.location.href.lastIndexOf('/') === window.location.href.length - 1) {
            return options.HOME_PAGE;
        } else {
            return getPageWithFolderFromFullUrl(window.location.href);
        }
    }
    
    
    function getPageWithFolderFromFullUrl(fullUrl) {
        console.log('full url: ' + fullUrl);
        // matches /folder/hello.html in:
        /*
            https://example.com/folder/hello.html#hello?poo=1
            https://example.com/folder/hello.html?poo=1
            https://example.com/folder/hello.html
        */
        return fullUrl.match(/[^\/](\/[\w\%\-\_]+(\.[a-zA-Z]+)?)+(?:(?=\#|\?)|$)/)[0].substr(1);
    }
    
    
    
    function globalEval(code) {
        window.eval(code);
    }
    
    
    
    function printStackTrace() {
        if (typeof console.warn === 'function') {
            console.warn((new Error()).stack);
        } else {
            console.log((new Error()).stack);
        }
    }
    
    
    
    function loadStyleSheet(src) {
        var s = document.createElement('link');
        s.href = src;
        s.rel = 'stylesheet';
        s.type = 'text/css';
        document.getElementsByTagName('head')[0].appendChild(s);
    }
// }());
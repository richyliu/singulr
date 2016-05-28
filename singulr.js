/*! Singulr v0.0.1r7 | (c) Richard Liu | MIT License */
/*
    BUGS:
     - 
    
    FEATURES:
     - load fonts
     - accept seperate pages which do not follow base
     - dynamically change favicon
    
    NOTES:
     - styles applied to body aren't applied
     - snippet needs to be added at the top of every file
         <script id="singulr-ignore">var a=window.location.href;window.location.href='/index.html?'+encodeURIComponent(a.match(/[^\/](\/[\w\%\-\_]+(\.[a-zA-Z]+)?)+(?:(?=\#|\?)|$)/)[0].substr(1))</script>
                                                home(where you put singulr.js) url----^^^^^^^^^^^^
     - dependencies must be urls
    
*/


// (function (document, window) {
    var currentPage = '';
    var addedContent = [];
    var removalQueue = [];
    var addOnLoad = [];
    var allScripts = [];
    
    var options = {
        onDocumentLoaded: function() {},
        onPageLoaded: function() {},
        onDependenciesLoaded: function() {},
        analyticNodes: [],
        HOME_PAGE: 'home.html',
        BASE_PAGE: 'base.html',
        PAGE_404: '404.html',
        PAGE_ID: 'page',
        CONTENT_ID: 'content',
        dependencies: {
            javascript: [],
            css: []
        }
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
            
            
            // load dependencies
            
            // javascript
            var javascriptDependencies = [];
            for (var i = 0; i < options.dependencies.javascript.length; i++) {
                javascriptDependencies.push(['src', options.dependencies.javascript[i]]);
            }
            loadScripts(javascriptDependencies, function() {
                // css
                var styleDependencies = options.dependencies.css;
                var loadedCss = [];
                console.log(loadedCss);
                var curStylesheet;
                for (var i = 0; i < styleDependencies.length; i++) {
                    curStylesheet = loadCSS(styleDependencies[i]);
                    onloadCSS(curStylesheet, function() {
                        loadedCss[i] = true;
                        // if there still is unloaded css
                        for (var i = 0; i < loadedCss.length; i++) {
                            if (loadedCss[i] === false) return;
                        }
                        
                        // all css (and javascript) loaded
                        options.onDependenciesLoaded();
                        
                        
                        // load base and page
                        ajaxLoad(options.PAGE_ID, options.BASE_PAGE, function() {
                            var curFullPageUrl = window.location.href.substr(window.location.href.lastIndexOf('/') + 1);
                            curFullPageUrl = curFullPageUrl.substr(curFullPageUrl.indexOf('?') + 1);
                            curFullPageUrl = decodeURIComponent(curFullPageUrl);
                            replacePage(curFullPageUrl);
                            if (curFullPageUrl.length > 0 && getPageWithFolder() !== currentPage) {
                                loadPageExternal(curFullPageUrl);
                            } else {
                                loadPage(options.HOME_PAGE);
                            }
                        });
                    });
                }
            });
            
            
        },
        getPage: getFullPageWithFolder,
        loadPage: loadPageExternal,
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
        console.log('loading: ' + page);
        setPage(page);
        loadPage(page);
    }
    
    
    function loadPage(page) {
        currentPage = page;
        
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
                options.onDocumentLoaded();
            } else if (xhr.status === 404) {
                loadPage(options.PAGE_404);
            }
            
            loadScripts(addOnLoad);
            addOnLoad = [];
            
            options.onPageLoaded();
        };
        
        xhr.send();
    }
    
    
    
    function getScript(source, callback) {
        var script = document.createElement('script');
        script.async = 1;
        script.onload = script.onreadystatechange = function() {
            callback();
            script.parentNode.removeChild(script);
        };
        script.src = source;
        
        document.getElementsByTagName('body')[0].appendChild(script);
    }
    
    
    function loadScripts(scripts, callback) {
        if (scripts.length === 0) {
            return;
        }
        callback = callback || function() {};
        console.log(scripts);
        
        allScripts = [];
        allScripts = scripts;
        
        miniLoadScripts(0, callback);
    }
    
    
    function miniLoadScripts(currentIndex, callback) {
        if (allScripts[currentIndex][0] === 'src') {
            getScript(allScripts[currentIndex][1], function() {
                if (allScripts[currentIndex + 1] !== undefined) {
                    miniLoadScripts(currentIndex + 1, callback);
                } else {
                    callback();
                }
            });
        } else if (allScripts[currentIndex][0] === 'code') {
            globalEval(allScripts[currentIndex][1]);
            if (allScripts[currentIndex + 1] !== undefined) {
                miniLoadScripts(currentIndex + 1, callback);
            } else {
                callback();
            }
        }
    }
    
    
    
    // removal queue needed because removing a node while iterating through a
    // list of nodes has bad effects
    function addNodeToRemovalQueue(node) {
        if (node === undefined || node === null) {
            console.warn('No node provided!');
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
    
    
    
    function getPageWithFolder() {
        // index page
        if (window.location.href.lastIndexOf('/') === window.location.href.length - 1) {
            return '/' + options.HOME_PAGE;
        } else {
            // matches /folder/hello.html in:
            /*
                https://example.com/folder/hello.html#hello?poo=1
                https://example.com/folder/hello.html?poo=1
                https://example.com/folder/hello.html
            */
            return window.location.href.match(/[^\/](\/[\w\%\-\_]+(\.[a-zA-Z]+)?)+(?:(?=\#|\?)|$)/)[0].substr(1);
        }
    }
    
    
    function getFullPageWithFolder() {
        // index page
        if (window.location.href.lastIndexOf('/') === window.location.href.length - 1) {
            return '/' + options.HOME_PAGE;
        } else {
            /*
                https://example.com/folder/hello.html#hello?poo=1
                    match /folder/hello.html#hello?poo=1
                https://example.com/folder/hello.html?poo=1
                    match /folder/hello.html?poo=1
                https://example.com/folder/hello.html
                    match /folder/hello.html
            */
            return window.location.href.match(/[^\/](\/[\w\%\-\_]+(\.[a-zA-Z]+)?)+.*$/)[0].substr(1);
        }
    }
    
    
    
    
    function globalEval(data) {
        (function(data) {
            window['eval'].call(window, data);
        })(data);
    }
    
    
    
    function printStackTrace() {
        console.warn((new Error()).stack);
    }
    
    
    
    // https://github.com/filamentgroup/loadCSS
    /*! loadCSS: load a CSS file asynchronously. [c]2016 @scottjehl, Filament Group, Inc. Licensed MIT */
    var loadCSS = function(href, before, media) {
        // Arguments explained:
        // 'href' [REQUIRED] is the URL for your CSS file.
        // 'before' [OPTIONAL] is the element the script should use as a reference for injecting our stylesheet <link> before
        // By default, loadCSS attempts to inject the link after the last stylesheet or script in the DOM. However, you might desire a more specific location in your document.
        // 'media' [OPTIONAL] is the media type or query of the stylesheet. By default it will be 'all'
        var doc = window.document;
        var ss = doc.createElement("link");
        var ref;
        if (before) {
            ref = before;
        } else {
            var refs = (doc.body || doc.getElementsByTagName("head")[0]).childNodes;
            ref = refs[refs.length - 1];
        }

        var sheets = doc.styleSheets;
        ss.rel = "stylesheet";
        ss.href = href;
        // temporarily set media to something inapplicable to ensure it'll fetch without blocking render
        ss.media = "only x";

        // wait until body is defined before injecting link. This ensures a non-blocking load in IE11.
        function ready(cb) {
            if (doc.body) {
                return cb();
            }
            setTimeout(function() {
                ready(cb);
            });
        }
        // Inject link
        // Note: the ternary preserves the existing behavior of "before" argument, but we could choose to change the argument to "after" in a later release and standardize on ref.nextSibling for all refs
        // Note: 'insertBefore' is used instead of 'appendChild', for safety re: http://www.paulirish.com/2011/surefire-dom-element-insertion/
        ready(function() {
            ref.parentNode.insertBefore(ss, (before ? ref : ref.nextSibling));
        });
        // A method (exposed on return object for external use) that mimics onload by polling until document.styleSheets until it includes the new sheet.
        var onloadcssdefined = function(cb) {
            var resolvedHref = ss.href;
            var i = sheets.length;
            while (i--) {
                if (sheets[i].href === resolvedHref) {
                    return cb();
                }
            }
            setTimeout(function() {
                onloadcssdefined(cb);
            });
        };

        function loadCB() {
            if (ss.addEventListener) {
                ss.removeEventListener("load", loadCB);
            }
            ss.media = media || "all";
        }

        // once loaded, set link's media back to 'all' so that the stylesheet applies once it loads
        if (ss.addEventListener) {
            ss.addEventListener("load", loadCB);
        }
        ss.onloadcssdefined = onloadcssdefined;
        onloadcssdefined(loadCB);
        return ss;
    };
    
    
    /*! onloadCSS: adds onload support for asynchronous stylesheets loaded with loadCSS. [c]2016 @zachleat, Filament Group, Inc. Licensed MIT */
    /* global navigator */
    /* exported onloadCSS */
    function onloadCSS( ss, callback ) {
    	var called;
    	function newcb(){
    			if( !called && callback ){
    				called = true;
    				callback.call( ss );
    			}
    	}
    	if( ss.addEventListener ){
    		ss.addEventListener( "load", newcb );
    	}
    	if( ss.attachEvent ){
    		ss.attachEvent( "onload", newcb );
    	}
    
    	// This code is for browsers that don’t support onload
    	// No support for onload (it'll bind but never fire):
    	//	* Android 4.3 (Samsung Galaxy S4, Browserstack)
    	//	* Android 4.2 Browser (Samsung Galaxy SIII Mini GT-I8200L)
    	//	* Android 2.3 (Pantech Burst P9070)
    
    	// Weak inference targets Android < 4.4
     	if( "isApplicationInstalled" in navigator && "onloadcssdefined" in ss ) {
    		ss.onloadcssdefined( newcb );
    	}
    }
    
// }(document, window));
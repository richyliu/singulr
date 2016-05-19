(function() {
    var preListenToTouch = false;
    var listenToTouch = false;
    var touchStartTime = -1;
    var xStart = -1;
    var yStart = -1;
    
    var options = {
        SWIPE_TO_ID: 'swipe-to',
        SWIPE_FROM_ID: 'page',
        swipeCompleted: function() {
            history.back();
            out('history back');
        }
    };
    
    var out = function(a) { console.log(a) };
    
    
    window.Slideback = function(user_options) {
        // init options
        if (user_options !== undefined) {
            for (var option in options) {
                if (options.hasOwnProperty(option) && user_options[option] !== undefined) {
                    options[option] = user_options[option];
                }
            }
        }
        
        bindEventHandlers();
    };
    
    
    function bindEventHandlers() {
        window.removeEventListener('touchstart', touchstart);
        window.removeEventListener('touchmove', touchmove);
        window.removeEventListener('touchend', touchend);
        
        window.addEventListener('touchstart', touchstart);
        window.addEventListener('touchmove', touchmove);
        window.addEventListener('touchend', touchend);
    }
    
    
    function touchstart(e) {
        var xRatio = e.changedTouches[0].clientX / window.innerWidth;
        // is this touch event slide to go back
        preListenToTouch = xRatio < 0.10;
        touchStartTime = (new Date).getTime();
        xStart = e.changedTouches[0].clientX;
        yStart = e.changedTouches[0].clientY;
        out('start');
        
        touchmove(e);
    }
    
    function touchmove(e) {
        var xRatio = e.changedTouches[0].clientX / window.innerWidth;
        var xDelta = e.changedTouches[0].clientX - xStart;
        var yDelta = e.changedTouches[0].clientY - yStart;
        
        if (preListenToTouch && (new Date).getTime() - touchStartTime > 50) {
            out('end');
            if (xDelta > yDelta && (xDelta / window.innerWidth) > 0.01 && (yDelta / window.innerHeight) > 0.01) {
                listenToTouch = true;
                // reset
                preListenToTouch = false;
                touchStartTime = false;
                xStart = -1;
                yStart = -1;
            }
        }
        
        if (listenToTouch) {
            moveSwipeToContent(xRatio * 100);
            moveContentContainer(xRatio * 100);
        }
    }
    
    function touchend(e) {
        if (!listenToTouch) return;
        // reset
        listenToTouch = false;
        var xRatio = e.changedTouches[0].clientX / window.innerWidth;
        
        document.getElementById(options.SWIPE_TO_ID).classList.add('transition');
        document.getElementById(options.SWIPE_FROM_ID).classList.add('transition');
        
        // half way
        if (xRatio > 0.5) {
            options.swipeCompleted();
            
            moveSwipeToContent(100);
            moveContentContainer(100);
        } else {
            moveSwipeToContent(0);
            moveContentContainer(0);
        }
        
        // reset swipe-to
        setTimeout(function() {
            document.getElementById(options.SWIPE_TO_ID).classList.remove('transition');
            document.getElementById(options.SWIPE_FROM_ID).classList.remove('transition');
            moveSwipeToContent(0);
            moveContentContainer(0);
        }, 300);
    }
    
    
    // offset a number from 0 to 100
    // 0 ======= 100
    function moveSwipeToContent(offset) {
        document.getElementById(options.SWIPE_TO_ID).style.transform = `translate(${offset}vw, 0px)`;
    }
    function moveContentContainer(offset) {
        document.getElementById(options.SWIPE_FROM_ID).style.transform = `translate(${offset}vw, 0px)`;
        out('moving content to ' + offset);
    }
}());
/* global boxbox */

// (function() {
    function out(a) { console.log(a); }
      
    var canvas = document.getElementById('main-cv');
    var ctx = canvas.getContext('2d');
    
    var background = new Image();
    background.src = '240px-8col-30w-0gut.png';
    
    background.onload = function(){
        ctx.drawImage(background, 0, 0);
        out('loaded');
    }
    
    var world = boxbox.createWorld(canvas, {debugDraw:false});
    
    var player = world.createEntity({
        name: 'player',
        x: 0.5,
        y: 12,
        height: 0.2,
        width: 0.2,
        fixedRotation: true,
        friction: .3,
        restitution: 0,
        color: 'blue'
    });
    
    // world.createEntity({
        
    // });
    
    player.onKeydown(function(e) {
        var i;
        var obj;
        var player = this;

        // determine what you're standing on
        var standingOn;
        var pos = this.position();
        var allUnderMe = world.find(pos.x - .08, pos.y + .1, pos.x + .09, pos.y + .105);
        for (i = 0; i < allUnderMe.length; i++) {
            obj = allUnderMe[i];
            if (obj !== player) {
                standingOn = obj;
                break;
            }
        }
        
        // jump
        if (e.keyCode === 32 && standingOn) {
            this.applyImpulse(2);
            return false;
        }

        // when airborn movement is restricted
        var force = 4;
        if (!standingOn) {
            force = force / 2;
        }

        // move left
        if (e.keyCode === 37) {
            this.setForce('movement', force, 270);
            this.friction(.1);
            return false;
        }

        // move right
        if (e.keyCode === 39) {
            this.setForce('movement', force, 90);
            this.friction(.1);
            return false;
        }
        
    });
    
    player.onKeyup(function(e) {
        // clear movement force on arrow keyup
        if (e.keyCode === 37 || e.keyCode === 39) {
            this.clearForce('movement');
            this.friction(3);
            return false;
        }
        
    });

    var groundTemplate = {
        name: 'ground',
        type: 'static',
        height: .1,
        color: 'green'
    };

    world.createEntity(groundTemplate, {width: 10, x: 10, y: 13.22});

    world.createEntity(groundTemplate, {width: 3, x: 3, y: 5});

    world.createEntity(groundTemplate, {width: 4, x: 16, y: 5});
    
    world.createEntity(groundTemplate, {height: 1, width: 1, x: 0, y: 0});
    
    world.createEntity({
        name: 'square',
        x: 13,
        y: 8,
        height: .8,
        width: .2,
        imageOffsetY: -.2
    });
    
    world.createEntity({
        name: 'poly',
        shape: 'polygon',
        x: 5,
        y: 8,
        color: 'purple'
    });

    world.createEntity({
        name: 'platform',
        fixedRotation: true,
        height: .1
    });
    
// })();
//* global boxbox */

// (function() {
    function out(a) { console.log(a); }
    
    
    var scale = 30;
    
    var worldWidth = 600 / scale;
    var worldHeight = 420 / scale;
    
    
    var canvas = document.getElementById('main-cv');
    canvas.width = worldWidth * scale;
    canvas.height = worldHeight * scale;
    
    var world = boxbox.createWorld(canvas, {
        debugDraw: false,
        scale: scale
    });
    // world.camera({x:-5, y: -5});
    // world.scale(20);
    

    var groundTemplate = {
        name: 'ground',
        type: 'static',
        color: 'green'
    };
    
    // top
    world.createEntity(groundTemplate, {height: 0.1, width: worldWidth / 2, x: worldWidth / 2, y: -0.1});
    // bottom
    world.createEntity(groundTemplate, {height: 0.1, width: 10, x: 10, y: worldHeight + 0.1});
    // left
    world.createEntity(groundTemplate, {height: worldHeight / 2, width: 0.1, x: -0.1, y: worldHeight / 2});
    // right
    world.createEntity(groundTemplate, {height: worldHeight / 2, width: 0.1, x: worldWidth + 0.1, y: worldHeight / 2});
    
    
    var gridTemplate = {
        name: 'ground',
        type: 'static',
        height: 0.5,
        width: 0.5,
        color: 'pink',
        borderWidth: 0
    };
    
    // world.createEntity(gridTemplate, {x: 0.5, y: 0.5});
    // world.createEntity(gridTemplate, {x: 1.5, y: 1.5});
    // world.createEntity(gridTemplate, {x: 2.5, y: 2.5});
    // world.createEntity(gridTemplate, {x: 3.5, y: 3.5});
    // world.createEntity(gridTemplate, {x: 4.5, y: 4.5});
    // world.createEntity(gridTemplate, {x: 5.5, y: 5.5});
    // world.createEntity(gridTemplate, {x: 6.5, y: 6.5});
    // world.createEntity(gridTemplate, {x: 7.5, y: 7.5});
    // world.createEntity(gridTemplate, {x: 8.5, y: 8.5});
    // world.createEntity(gridTemplate, {x: 9.5, y: 9.5});
    // world.createEntity(gridTemplate, {x: 10.5, y: 10.5});
    // world.createEntity(gridTemplate, {x: 11.5, y: 11.5});
    
    
    var hoopTemplate = {
        name: 'hoop',
        type: 'static',
        height: 0.1,
        width: 0.1,
        color: 'blue',
    }
    
    world.createEntity(hoopTemplate, {x: 0.5, y: 6});
    world.createEntity(hoopTemplate, {x: 2, y: 6});
    
    
    var ball = world.createEntity({
        name: 'ball',
        shape: 'circle',
        radius: 0.5,
        x: 10,
        y: 10,
        active: true,
        color: 'orange',
        bullet: true
    });
    
    world.createEntity(groundTemplate, {width: 3, height: 0.1, x: 10, y: 10.1});
    
    // ball.applyImpulse(30, 325);
// })();
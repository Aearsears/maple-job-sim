$(function(){
// The status of the arrow keys
var keys = {
    right: false,
    left: false,
    up: false,
    };
// The friction and gravity to show realistic movements    
var gravity = 0.6;
var friction = 0.7;
// The number of platforms
var num = 2;
// The platforms
var platforms = [];

// This function will be called when a key on the keyboard is pressed
function keydown(e) {
    // 37 is the code for the left arrow key
    if(e.keyCode == 37) {
        keys.left = true;
    }
    // 37 is the code for the up arrow key
    if(e.keyCode == 38) {
        if(player.jump == false) {
            player.y_v = -10;
        }
    }
    // 39 is the code for the right arrow key
    if(e.keyCode == 39) {
        keys.right = true;
    }
}
// This function is called when the pressed key is released
function keyup(e) {
    if(e.keyCode == 37) {
        keys.left = false;
    }
    if(e.keyCode == 38) {
        if(player.y_v < -2) {
        player.y_v = -3;
        }
    }
    if(e.keyCode == 39) {
        keys.right = false;
    }
} 
function loop() {
    // If the player is not jumping apply the effect of frictiom
    if(player.jump == false) {
        player.x_v *= friction;
    }
    // } else {
    //     // If the player is in the air then apply the effect of gravity
    //     player.y_v += gravity;
    // }
    player.jump = true;
    // If the left key is pressed increase the relevant horizontal velocity
    if(keys.left) {
        player.x_v = -2.5;
    }
    if(keys.right) {
        player.x_v = 2.5;
    }
    // Updating the y and x coordinates of the player
    player.y += player.y_v;
    player.x += player.x_v;
    // A simple code that checks for collions with the platform
    let i = -1;
    if(platforms[0].x < player.x && player.x < platforms[0].x + platforms[0].width &&
    platforms[0].y < player.y && player.y < platforms[0].y + platforms[0].height){
        i = 0;
    }
    if(platforms[1].x < player.x && player.x < platforms[1].x + platforms[1].width &&
    platforms[1].y < player.y && player.y < platforms[1].y + platforms[1].height){
        i = 1;
    }
    if (i > -1){
        player.jump = false;
        player.y = platforms[i].y;    
    }
    // Rendering the canvas, the player and the platforms
    rendercanvas();
    renderplayer();
    renderplat();
}

bgcanvas=document.getElementById("bgCanvas");
bgctx=bgcanvas.getContext("2d");

encanvas=document.getElementById("entityCanvas");
enctx=encanvas.getContext("2d");

let img = new Image();
img.src='henesysground.png';
img.onload = function(){
    var pattern = bgctx.createPattern(img, 'no-repeat');
    bgctx.fillStyle = pattern;
    bgctx.fillRect(0, 0, 800, 600);
};

let p1 = new Image();
p1.src = 'player_sprites/player_nude_comp.png'
p1.onload = function(){
    
    init();
};

const SCALE = 1;
const WIDTH = 45;
const HEIGHT = 66;
const SCALEDWIDTH = SCALE * WIDTH;
const SCALEDHEIGHT = SCALE * HEIGHT;
const MOVEMENT_SPEED = 20;

function init(){
    document.addEventListener("keydown",keydown);
    document.addEventListener("keyup",keyup);
    window.requestAnimationFrame(gameloop);
}

function drawFrame(frameX, frameY, canvasX, canvasY) {
    enctx.drawImage(p1,
                  frameX, frameY * HEIGHT, WIDTH, HEIGHT,
                  canvasX, canvasY, SCALEDWIDTH, SCALEDHEIGHT);
  }

  const CYCLELOOPIDLE = [0, 1, 2, 1];
  const CYCLEWALK = [0, 1, 2, 3];
  const CYCLEJUMP = 1;
  const RIGHT = 0;
  const LEFT =9;
  let currentLoopIndex = 0;
  let frameCount = 0;
  let currentDir = 0; //left or right

  //later create player class that inherits from entity class
  let posX = 0;
  let posY = 0;


  function gameloop(){
      frameCount++;
      if (frameCount<15){
          window.requestAnimationFrame(gameloop);
          return;
      }
      frameCount = 0;
      enctx.clearRect(0,0,encanvas.width,encanvas.height);
      let hasMoved = false;
      //check for movement
      if(keys.left){
        posX -=MOVEMENT_SPEED;
        currentDir= LEFT;
        hasMoved = true;
      }
      if(keys.right){
          posX += MOVEMENT_SPEED;
          currentDir = RIGHT;
          hasMoved = true;
      }

      //then redraw the position of the entity
      if(hasMoved){
          if(currentDir==0){

              drawFrame((CYCLEWALK[currentLoopIndex]+3)*WIDTH,0,posX,posY);
            }
            else{
              drawFrame((CYCLEWALK[currentLoopIndex]+12)*WIDTH,0,posX,posY);

          }

      }
      else{

          drawFrame((CYCLELOOPIDLE[currentLoopIndex]+currentDir)*WIDTH,0,posX,posY);
      }
      currentLoopIndex++;
      if (currentLoopIndex >= CYCLELOOPIDLE.length) {
        currentLoopIndex = 0;
      }
      window.requestAnimationFrame(gameloop); 
    }
    

//npm server to get resources
//http-server -c-1

// Adding the event listeners
// document.addEventListener("keydown",keydown);
// document.addEventListener("keyup",keyup);
// setInterval(loop,22);

// The main game loop
// var lastTime;
// function main() {
//     var now = Date.now();
//     var dt = (now - lastTime) / 1000.0;

//     update(dt);
//     render();

//     lastTime = now;
//     requestAnimFrame(main);
// };


});

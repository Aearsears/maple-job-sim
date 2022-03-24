$(function(){
// The status of the arrow keys
var keys = {};
// The friction and gravity to show realistic movements    
var gravity = 0.6;
var friction = 0.7;
// The number of platforms
var num = 2;
// The platforms
var platforms = [];

// This function will be called when a key on the keyboard is pressed
function keyDownListener(event) {
    keys[event.code]=true;
    // // 37 is the code for the left arrow key
    // if(e.keyCode == 37) {
    //     keys.left = true;
    // }
    // // 37 is the code for the up arrow key
    // if(e.keyCode == 38) {
    //     if(player.jump == false) {
    //         player.y_v = -10;
    //     }
    // }
    // // 39 is the code for the right arrow key
    // if(e.keyCode == 39) {
    //     keys.right = true;
    // }
}
// This function is called when the pressed key is released
function keyUpListener(event) {
    keys[event.code]=false;
    // if(e.keyCode == 37) {
    //     keys.left = false;
    // }
    // if(e.keyCode == 38) {
    //     if(player.y_v < -2) {
    //     player.y_v = -3;
    //     }
    // }
    // if(e.keyCode == 39) {
    //     keys.right = false;
    // }
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
img.src='henesys_hunt.png';
img.onload = function(){
    var pattern = bgctx.createPattern(img, 'no-repeat');
    bgctx.fillStyle = pattern;
    bgctx.fillRect(0, 0, 1710, 1299);
};

let sprites_path = ['player_sprites/jump_r.png','player_sprites/jump_l.png','player_sprites/idle_l.png','player_sprites/idle_r.png','player_sprites/walk_l.png','player_sprites/walk_r.png','skills/roar/effect_sheet.png']
let sprites_name = ['jump_r','jump_l','idle_l','idle_r','walk_l','walk_r','roar']
function loadSprites(sprites_path,sprites_name){
    let i = sprites_path.length;
    const images = {};
    for (i=0; i<sprites_path.length;i++){
        const img = images[sprites_name[i]]=new Image();
        img.src = sprites_path[i];
        img.onload = onload;
    }
    return images;
}
images = loadSprites(sprites_path,sprites_name);
// let p1 = new Image();
// p1.src = 'player_sprites/player_nude_comp.png'
// p1.onload = function(){
    
//     init();
// };
init();

const SCALE = 1;
const WIDTH = 39;
const HEIGHT = 64;
const SCALEDWIDTH = SCALE * WIDTH;
const SCALEDHEIGHT = SCALE * HEIGHT;
const MOVEMENT_SPEED =1;

function init(){
    document.addEventListener("keydown",keyDownListener);
    document.addEventListener("keyup",keyUpListener);
    window.requestAnimationFrame(gameloop);
}

function drawFrame(img,frameX, frameY, canvasX, canvasY) {
    enctx.drawImage(img,
                  frameX, frameY * HEIGHT, WIDTH, HEIGHT,
                  canvasX, canvasY, SCALEDWIDTH, SCALEDHEIGHT);
  }

  const CYCLELOOPIDLE = [0, 1, 2,1];
  const CYCLEWALK = [0, 1, 2, 3];
  const CYCLEJUMP = 1;
  const RIGHT = 0;
  const LEFT =1;
  const JUMP = 2;
  let currentLoopIndex = 0;
  let index =0;
  let frameCount = 0;
  let currentDir = 0; //left or right

  //later create player class that inherits from entity class
  let posX = 0;
  let posY = 0;

  function mapping(number){
      if(number>=0 && number<=14){
          return 0;
      }
      if(number>=15 && number<=30){
          return 1;
      }
      if(number>=31 && number<=45){
          return 2;
      }
      if(number>=46 && number<=59){
          return 3;
      }
  }
  function roar(){
      for(let i=0;i<14;i++){
        enctx.drawImage(images['roar'],
            365*i, 0, 365, 376,
            posX, posY, 365, 376);
      }
  }

  function gameloop(){
      frameCount++;
      if (frameCount>59){
          frameCount = 0;
        //   window.requestAnimationFrame(gameloop);
        //   return;
      }
      enctx.clearRect(0,0,encanvas.width,encanvas.height);
      let hasMoved = false;
      let hasRoared = false;
      //check for movement
      if(keys["ArrowLeft"]){
        posX -=MOVEMENT_SPEED;
        currentDir= LEFT;
        hasMoved = true;
      }
      if(keys["ArrowRight"]){
          posX += MOVEMENT_SPEED;
          currentDir = RIGHT;
          hasMoved = true;
      }
      if(keys["ArrowUp"]){

          posY -= 20;

          currentDir = JUMP;
          hasMoved = true;
      }
      if(keys["KeyA"]){
            hasRoared = true;
      }

      //then redraw the position of the entity
      if(hasMoved){
          if(currentDir==0){
                    drawFrame(images['walk_r'],(CYCLEWALK[mapping(frameCount)])*WIDTH,0,posX,posY);
                    

            }
            else if (currentDir==1){
                    drawFrame(images['walk_l'],(CYCLEWALK[mapping(frameCount)])*WIDTH,0,posX,posY);
                
          }
          else if (currentDir==2){
            drawFrame(images['jump_l'],0,0,posX,posY);
          }

      }
      else{
          if(posY<937){
              posY+=10;
          }
            drawFrame(images['idle_l'],(CYCLELOOPIDLE[mapping(frameCount)]*WIDTH),0,posX,posY);
            

      }
      currentLoopIndex++;
      if (currentLoopIndex >= CYCLELOOPIDLE.length) {
        currentLoopIndex = 0;
      }
      if(hasRoared){
          enctx.drawImage(images['roar'],
          365*index, 0, 365, 376,
          posX, posY, 365, 376);
        }
        index++;
        if (index >= 14) {
          index = 0;
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

//https://maplestory.io/api/GMS/219/mob/100004/render/move
//https://maplestory.io/api/GMS/219/map/100010001/render/
//https://maplestory.io/api/character/%7B%22ItemId%22%3A2000%2C%22Version%22%3A%22219%22%2C%22Region%22%3A%22GMS%22%7D%2C%7B%22ItemId%22%3A12012%2C%22Version%22%3A%22219%22%2C%22Region%22%3A%22GMS%22%7D/walk1/animated?showEars=False&showLefEars=False&showHighLefEars=False&padding=0&name=&renderMode=Full&bgColor=
//https://maplestory.io/api/GMS/219/mob/100004/
//https://maplestory.io/api/GMS/219/mob/100004/render/move
//https://keycode.info/
//https://maplestory.io/api/character/%7B%22ItemId%22%3A2000%2C%22Version%22%3A%22219%22%2C%22Region%22%3A%22GMS%22%7D%2C%7B%22ItemId%22%3A12012%2C%22Version%22%3A%22219%22%2C%22Region%22%3A%22GMS%22%7D/walk1/animated


//https://maplestory.io/api/character/%7B%22itemId%22%3A2000%2C%22version%22%3A%22219%22%7D%2C%7B%22itemId%22%3A12000%2C%22version%22%3A%22219%22%7D%2C%7B%22itemId%22%3A1012394%2C%22animationName%22%3A%22default%22%2C%22version%22%3A%22219%22%7D%2C%7B%22itemId%22%3A50004%2C%22version%22%3A%22219%22%7D%2C%7B%22itemId%22%3A30476%2C%22version%22%3A%22219%22%7D%2C%7B%22itemId%22%3A1001020%2C%22version%22%3A%22219%22%7D%2C%7B%22itemId%22%3A1050291%2C%22version%22%3A%22219%22%7D/walk1/animated?showears=false&showLefEars=false&showHighLefEars=undefined&resize=1&name=&flipX=false&bgColor=0,0,0,0

//MAP JSON https://maplestory.io/api/GMS/219/map/100000203
//https://maplestory.io/api/GMS/219/map/100000203/render

});

var PLAY = 1;
var END = 0;
var gameState = PLAY;

var mario, mario_running, mario_collided;
var ground, invisibleGround, groundImage;

var bricksGroup, brickImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOver, restart;



function preload(){    
  bg=loadImage("bg.png")
  mario_running =   loadAnimation("mario00.png","mario01.png","mario02.png","mario03.png");
  mario_collided = loadAnimation("collided.png");
  
  groundImage = loadImage("ground2.png");
  
  brickImage = loadImage("brick.png");
  
  obstacleimage = loadAnimation("obstacle1.png","obstacle2.png","obstacle3.png","obstacle4.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  mario = createSprite(50,height-200,20,50),
  
  mario.addAnimation("running",mario_running);
  mario.addAnimation("collided", mario_collided);
  mario.scale = 2;
 // mario.debug=true
  ground = createSprite(width,height,width-60,2);
  ground.addImage("ground",groundImage);
  ground.velocityX = -(2);
  ground.x = width/2;
  ground.scale = 3
  
  
  gameOver = createSprite(width/2,height/2-50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(width/2 +40,height-60,width,125);
  invisibleGround.visible = false;
  
  bricksGroup = new Group();
  obstaclesGroup = new Group();
  fill(0);
textSize(24);
textFont('Georgia');
  score = 0;
}

function draw() {
  //trex.debug = true;
 background(bg);
  text("Score: "+ score, 480,30);
  
  if (gameState===PLAY){
    
    ground.velocityX = -(12);
  
    if((touches.length>0 ||keyDown("space") ) && mario.collide(invisibleGround)) {
      mario.velocityY = -15;
      jumpSound.play();
      touches = [];
    }
  if(score>0 && score%10 === 0){
       checkPointSound.play() 
    }
    mario.velocityY = mario.velocityY + 0.5
    
    if (ground.x < 0){
      ground.x = width/2
    }

    for (var i = 0; i < bricksGroup.length; i++) {
    
      if(bricksGroup.get(i).isTouching(mario)){
      bricksGroup.get(i).remove()
      score =score+1;
    }
    }
    mario.collide(invisibleGround);
    spawnbricks();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(mario)){
        gameState = END;
      jumpSound.play();
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    mario.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    bricksGroup.setVelocityXEach(0);
    
    //change the trex animation
    mario.changeAnimation("collided",mario_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    bricksGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart) || touches.length>0) {
      reset();
      touches = [];
    }
  }
  
  
  drawSprites();
}

function spawnbricks() {
  //write code here to spawn the brick
  if (frameCount % 60 === 0) {
    var brick = createSprite(width+20,height-400,40,10);
    brick.debug=true
    brick.y = Math.round(random(height-200,height-400));
    brick.addImage(brickImage);
    brick.scale = 1;
    brick.velocityX = -3;
    
     //assign lifetime to the variable
    brick.lifetime = 700;
    
    //adjust the depth
    brick.depth = mario.depth;
    mario .depth = mario.depth + 1;
    
    //add each brick to the group
    bricksGroup.add(brick);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(width+20,height-140,20,30);
    //obstacle.debug = true;
    obstacle.velocityX = -(6);
    
    //generate random obstacles
    obstacle.addAnimation("obstacles",obstacleimage)
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 1;
    obstacle.lifetime = 600;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  bricksGroup.destroyEach();
  
  mario.changeAnimation("running",mario_running);
  
  
  score = 0;
  
}
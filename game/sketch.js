let gameManager;
p5.disableFriendlyErrors = true;


function preload() {
    gameManager = new GameManager();
}

// This is where we initiliaze our game
function setup() {
    createCanvas(innerWidth, innerHeight);
}

// Where our game loops, called every 60 frames per second
function draw() {
    background(50);
    gameManager.render();
}
var game = new Phaser.Game(640,480,Phaser.AUTO,'content',{preload: preload, create: create,update:update});
function essai(acteur,souris) {
    turtle.x = 320;
    turtle.y = 240;
    turtle.angle = game.rnd.angle();
} 
var turtle;
function preload(){   
    game.load.image("fond","img/sable.jpg");
    game.load.spritesheet("tortue","img/tortue.png",100,121,8);
}
function create(){ 
    var fond = game.add.tileSprite(0,0,game.width,game.height,"fond"); 
    turtle = game.add.sprite(160,120,"tortue");
    turtle.anchor.setTo(0.5);
    turtle.scale.setTo(0.5);
    var walk=turtle.animations.add("walk");
    turtle.animations.play("walk",16,true);
    fond.inputEnabled=true;
    fond.events.onInputDown.add(essai,this);
}
function update(){ 
    turtle.x += 1.2*Math.cos(Math.PI*turtle.angle/180);
    turtle.y += 1.2*Math.sin(Math.PI*turtle.angle/180);
}


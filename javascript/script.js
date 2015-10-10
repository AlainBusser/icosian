var game = new Phaser.Game(640,480,Phaser.AUTO,'content',{preload: preload, create: create,update:update});
function essai(acteur,souris) {
    turtle.x = 320;
    turtle.y = 240;
    turtle.angle = game.rnd.angle();
} 
var turtle;
function preload(){   
    game.load.image("fond","img/sable.jpg"); // mettre un masque sur le sable qu'il représente le graphe (en-desous, ocean.jpg)
    //une arète = un rectangle judicieusement tournée
    //un sommet = un disque avec un gaignpi.jpg caché et par-dessus un rubygem.png
    //ici on charge la tortue (un png mais c'est animé)
    game.load.spritesheet("tortue","img/tortue.png",100,121,8);
}
function create(){ 
    var fond = game.add.tileSprite(0,0,game.width,game.height,"fond"); 
    turtle = game.add.sprite(160,120,"tortue");
    turtle.anchor.setTo(0.5); // que la tortue soit centrée sur sa case
    turtle.scale.setTo(0.5); // elle est un peu trop grosse la tortue
    var walk=turtle.animations.add("walk");// la tirtue avance toute seul, l faut qu'elle n'avance que quand on a cliqué sur une arête jouable
    turtle.animations.play("walk",16,true);//16 images par seconde c'est bon?
    fond.inputEnabled=true;
    fond.events.onInputDown.add(essai,this);//ce qui se passe quand on clique sur le fond
}
function update(){ //l'animation elle-même (fonction appelée 16 fois par seconde)
    turtle.x += 1.2*Math.cos(Math.PI*turtle.angle/180);
    turtle.y += 1.2*Math.sin(Math.PI*turtle.angle/180);
}


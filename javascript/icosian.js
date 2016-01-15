/* bibliothèque de graphes
Un graphe est un objet contenant deux tableaux:
nodes, dont chaque élément est un Phaser.Point 
edges, dont chaque élément est lui-même un tableau, 
contenant les numéros des sommets auxquels est relié un sommet donné

Phaser c'est le moteur de jeu
game c'est le jeu (la mer)
gemmes est la liste des objets se trouvant sur chaque sommet du graphe
(initialement des rubis, ensuite des plantes carnivores)
chemin est le nom du graphe sur lequel on joue

Utilitaires sous licence MIT
Alain Busser 2016
*/

/* global Phaser, game, gemmes, chemin */

function addNode(graphe,x,y){                   // ajouter un sommet
    graphe.nodes.push(new Phaser.Point(x,y));
}
function addEdge(graphe,a,b){                   // ajouter une arête
    graphe.edges[a].push[b];
}
function dessineGraphe(g){                      // dessiner le graphe dans le jeu
    var graphique = game.add.graphics(0,0);     // dessin vectoriel
    graphique.z = 2;                            // en-dessous de la tortue
    graphique.lineStyle(16,0x8F6D45);           // couleur sable
    graphique.beginFill(0x8F6D45); 
    for(var dep in g.edges){                    // on dessine d'abord les arêtes
        for(var na in g.edges[dep])  {          // numéros des arêtes
            var arr = g.edges[dep][na];         // les arêtes elles-mêmes
            graphique.moveTo(g.nodes[dep].x,g.nodes[dep].y);
            graphique.lineTo(g.nodes[arr].x,g.nodes[arr].y);
        }
    }
    for(var s in g.nodes){                      // ensuite on dessine les sommets, de rayon 24 pixels
        graphique.drawCircle(g.nodes[s].x,g.nodes[s].y,24);
        if(s>0){                                // pas de rubis au départ
            gemmes[s] = game.add.sprite(g.nodes[s].x,g.nodes[s].y,"rubis");
            gemmes[s].anchor.setTo(0.5);
            gemmes[s].scale.setTo(0.25);
        }
    }
    graphique.endFill();
}


function contient(tableau,element){             // Le "element in tableau" de JavaScript ne fonctionne pas bien
    var rep = false;                            // a priori l'element n'est pas dans le tableau
    for (var e in tableau){
        if (tableau[e] == element) {rep=true}   // a postériori peut-être que si
    }
    return rep;
}


function liaison(a,b){                          // dit s'il y a une arête entre a et b (numéros des sommets)
    return (contient(chemin.edges[a],b) || contient(chemin.edges[b],a));
}
/* global Phaser */
var game = new Phaser.Game(480,480,Phaser.AUTO,'content',{preload: preload, create: create,update:update});
var chemin = [ ];                                       // le graphe
chemin.nodes = [ ];                                     // les sommets
var gemmes = [ ];                                       // les rubis
var lieu = 0;


var abcs = [240,30,450,130,350,240,94,386,168,312,177,303,142,338,240,205,275,183,297,240];
var ords = [30,200,200,440,440,100,220,220,382,382,165,165,294,294,368,205,205,270,270,316];
for (var n in abcs) { addNode(chemin,abcs[n],ords[n]) }
chemin.edges = [ [1,2,5], [3,6], [4,7], [4,8], [9], 
    [10,11], [10,12], [11,13], [12,14], [13,14],
    [15],[16],[17],[18],[19],
    [16,17],[18],[19],[19],[]
];
var possible = [];
for (var n in abcs){
    possible[n] = true;
}
function essai(acteur,souris) {
    var oussamissava = prochain(souris.x, souris.y);
    if(liaison(lieu, oussamissava) && possible[oussamissava]){
        promenade(chemin.nodes[lieu],chemin.nodes[oussamissava]);
        lieu = oussamissava;
    }
} 
function manger(){
    possible[lieu] = false;
    gemmes[lieu].destroy();
    gemmes[lieu] = game.add.sprite(chemin.nodes[lieu].x,chemin.nodes[lieu].y,"bouche");
    gemmes[lieu].anchor.setTo(0.5);
    gemmes[lieu].scale.setTo(0.3);
}
function promenade(P1,P2){ // parcours d'une arête du graphe (d'un point P1 à un autre P2)
    turtle.x = P1.x;
    turtle.y = P1.y;
    turtle.angle = Phaser.Point.angle(P2,P1)*180/Math.PI;
    P2.angle = turtle.angle;
    var voyage = game.add.tween(turtle).to(P2,20*P1.distance(P2),"Linear",true);
    voyage.onComplete.add(manger);
}
function prochain(x,y){
    var dmin = 1e6;
    var numero = -1;
    for (var n in chemin.nodes){
        if (Phaser.Math.distance(x,y,chemin.nodes[n].x,chemin.nodes[n].y)<dmin){
            numero = n;
            dmin = Phaser.Math.distance(x,y,chemin.nodes[n].x,chemin.nodes[n].y);
        }
    }
    return numero;
}
var turtle;
function preload(){   
    game.load.image("fond","img/ocean.jpg"); // mettre un masque sur le sable qu'il représente le graphe (en-desous, ocean.jpg)
    //une arète = un rectangle judicieusement tourné
    //un sommet = un disque avec un gaignpi.jpg caché et par-dessus un rubygem.png
    //ici on charge la tortue (un png mais c'est animé)
    game.load.spritesheet("tortue","img/tortue.png",100,121,8);
    game.load.spritesheet("bouche","img/gaignpi.png");
    game.load.spritesheet("rubis","img/rubygem.png");
}
function create(){ 
    var fond = game.add.tileSprite(0,0,game.width,game.height,"fond");
    dessineGraphe(chemin);
    turtle = game.add.sprite(240,30,"tortue");
    turtle.z = 3;
    turtle.anchor.setTo(0.5); // que la tortue soit centrée sur sa case
    turtle.scale.setTo(0.5); // elle est un peu trop grosse la tortue
    turtle.angle = 90;
    var walk=turtle.animations.add("walk");// la tortue avance toute seule, il faut qu'elle n'avance que quand on a cliqué sur une arête jouable
    turtle.animations.play("walk",16,true);//16 images par seconde c'est bon?
    fond.inputEnabled=true;
    fond.events.onInputDown.add(essai,this);//ce qui se passe quand on clique sur le fond
}
function update(){ //l'animation elle-même (fonction appelée 16 fois par seconde)
}


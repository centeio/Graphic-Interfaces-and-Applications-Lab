function MyPiece(scene, player, name){
    this.scene = scene;
    this.player = player;
    this.name = name;
}

MyPiece.prototype.display = function(){

    this.scene.graph.primitives.get(this.name).display();
}
function MyPiece(scene, player, name, piece){
    this.scene = scene;
    this.player = player;
    this.name = name;
    this.piece = piece;
}

MyPiece.prototype.display = function(){
    this.piece.display();
}
function MyNode(scene){
    this.scene = scene;
    this.node = new MyCylinder(scene, 0.3, 0, 1, 20, 20);
}

MyNode.prototype.display = function(){
    this.scene.pushMatrix();
    this.scene.rotate(-Math.PI/2,1,0,0);
    this.node.display();
    this.scene.popMatrix();
}
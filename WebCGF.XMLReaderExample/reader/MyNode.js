function MyNode(scene){
    this.scene = scene;
    this.node = new MyCylinder(scene, 0.1, 0.05, 0.6, 20, 20);
    this.bottom = new MySphere(scene, 0.2, 20, 20);
    this.base = new MySphere(scene, 0.3, 20, 20);
    this.top = new MySphere(scene, 0.1, 20, 20);
    this.player = 0;
    this.name = "name";
}

MyNode.prototype.display = function(){
    this.scene.pushMatrix();
    this.scene.scale(1,0.3,1);
    this.base.display();        
    this.scene.popMatrix();
    
    this.scene.pushMatrix();
    this.scene.translate(0,0.9,0);    
    this.top.display();        
    this.scene.popMatrix();
    
    this.scene.pushMatrix();
    this.scene.translate(0,0.2,0);    
    this.bottom.display();        
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(0,0.3,0);        
    this.scene.rotate(-Math.PI/2,1,0,0);
    this.node.display();
    this.scene.popMatrix();
}
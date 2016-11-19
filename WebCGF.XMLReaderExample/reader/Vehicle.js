function Vehicle(scene) {
    this.scene = scene;
    var u = 3;
    var v = 3;
    var h = 3;

    var cv = [[
                [-u/2, 0, 0, 1],
                [-u/2, 0, 0, 1],
                [-u/2, 0, 0, 1]],
               [
                [-u/4, 0, v/2, 1],
                [-u/4, h, 0, 1],
                [-u/4, 0, -v/2, 1]],
               [
                [u/2, 0, 0, 1],
                [u/2, 0, 0, 1],
                [u/2, 0, 0, 1]]];

     this.cover = new Patch(scene, 2, 2, 100, 100, cv);
     this.body = new MyTorus(scene, 0.5, u/4, 20, 20);
}

Vehicle.prototype.display = function () {
    this.cover.display();

    this.scene.pushMatrix();
    this.scene.scale(1.5,0.5,1);
    this.scene.rotate(Math.PI/2,1,0,0);
    this.body.display();
    this.scene.popMatrix();
}
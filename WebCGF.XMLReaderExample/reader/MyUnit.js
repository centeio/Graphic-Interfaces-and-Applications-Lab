/**
 * MyUnit
 * @constructor
 */
function MyUnit(scene) {
    this.scene = scene;
    this.sphere = new MySphere(scene, 1, 20, 20);

}

MyUnit.prototype.display = function() {
    this.scene.scale(0.3,0.15,0.3);
    this.sphere.display();
}
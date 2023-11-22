import * as THREE from "three";

export default class Food {
  constructor(foodWidth, foodHeight, foodName,eventBus) {
    this._foodWidth = foodWidth;
    this._foodHeight = foodHeight;
    this._foodName = foodName;
    this._eventBus = eventBus;
    this.vectUp = new THREE.Vector3();
    this.vectDown = new THREE.Vector3();
  }

  drawFood(areaWidth, areaHeight) {
    this.areaHeight = areaHeight;
    this.areaWidth = areaWidth;
    this.geometry = new THREE.TorusGeometry(
      this._foodWidth,
      this._foodHeight,
      16,
      100
    );
    this.material = new THREE.MeshStandardMaterial({ color: 0xebde34 });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.name = this._foodName;
    this.makeDots(this.mesh);
    this.mesh.position.set(
      this.getRandomNum(
        -this.areaWidth/2 + this._foodWidth * 3,
        this.areaWidth/2 - this._foodWidth * 3
      ),
      0.6,
      this.getRandomNum(
        -this.areaHeight/2 + this._foodWidth * 3,
        this.areaHeight/2 - this._foodWidth * 3
      )
    );
    return this.mesh;
  }

  makeDots(mesh) {
    this.geometryDot = new THREE.CapsuleGeometry(0.1, 0.1, 10, 10);
    this.materialDot = new THREE.MeshStandardMaterial({ color: 0x9426de });
    this.dotUp = new THREE.Mesh(this.geometryDot, this.materialDot);
    this.dotUp.name = "DotCollision";
    this.dotDown = this.dotUp.clone();
    mesh.add(this.dotUp, this.dotDown);
    this.dotDown.position.set(-this._foodWidth, 0, 0);
    this.dotUp.position.set(this._foodWidth, 0, 0);
    this.FoodDots = [this.dotUp, this.dotDown];
  }

  getRandomNum(min, max) {
    let rand;
    if (max) {
      rand = Math.random() * (max - min) + min;
    } else {
      rand = Math.random() * min;
    }
    return +rand.toFixed(2);
  }

  getWorldPosDots() {
    this.FoodDots[0].getWorldPosition(this.vectUp);
    this.FoodDots[1].getWorldPosition(this.vectDown);
    return [this.vectUp, this.vectDown];
  }
}

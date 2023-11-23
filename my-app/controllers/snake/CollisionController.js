import { Vector3 } from "three";

export default class CollisionController {
  groups = {};
  constructor({ eventBus, container }) {
    this._container = container;
    this._eventBus = eventBus;

    this.onCollisionCreated = this.onCollisionCreated.bind(this);
    this.onCollisionDelete = this.onCollisionDelete.bind(this);
    eventBus.addEventListener("collision:created", this.onCollisionCreated);
    eventBus.addEventListener("collision:delete", this.onCollisionDelete);
  }

  onCollisionCreated({ data: { collisionType, group, name, data } }) {
    if (!this.groups[group]) this.groups[group] = {};

    this.groups[group][name] = { type: collisionType, data };
  }

  onCollisionDelete({ data: { group, name } }) {
    delete this.groups[group][name];
  }

  update() {
    const groups = Object.entries(this.groups);
    let i = groups.length;
    while (i--) {
      const item = groups[i];
      const [groupName, entries] = item;
      Object.entries(entries).forEach(([collisionName, collisionData]) => {
        groups.forEach(([name, entries]) => {
          if (name === groupName) return;
          Object.entries(entries).forEach(
            ([sCollisionName, sCollisionData]) => {
              const isCollide = this.check(collisionData, sCollisionData);
              if (isCollide) {
                this._eventBus.dispatchEvent({
                  type: sCollisionData.type,
                });
              }
            }
          );
        });
      });
      groups.splice(i, 1);
    }
  }

  check(target, obj) {
    this.poligonTarget = this.poligonArr(this.getWorldPosDots(target.data));
    this.poligonObj = this.poligonArr(this.getWorldPosDots(obj.data));
    this.flag = this.poligonIntersection(this.poligonTarget, this.poligonObj);
    if (this.flag) {
      return true;
    }
    return false;
  }

  getWorldPosDots(arr) {
    return arr.map((dot) => dot.getWorldPosition(new Vector3()));
  }

  //poligons
  poligonArr(arr) {
    return arr.map(val => {
      return { x: val.x, y: val.z };
    });
  }

  poligonIntersection(a, b) {
    let polygons = [a, b];
    let minA, maxA, projected, i, i1, j, minB, maxB;

    for (i = 0; i < polygons.length; i++) {
      let polygon = polygons[i];
      for (i1 = 0; i1 < polygon.length; i1++) {
        let i2 = (i1 + 1) % polygon.length;
        let p1 = polygon[i1];
        let p2 = polygon[i2];
        let normal = { x: p2.y - p1.y, y: p1.x - p2.x };
        minA = maxA = undefined;
        for (j = 0; j < a.length; j++) {
          projected = normal.x * a[j].x + normal.y * a[j].y;
          if (minA === undefined || projected < minA) {
            minA = projected;
          }
          if (maxA === undefined || projected > maxA) {
            maxA = projected;
          }
        }
        minB = maxB = undefined;
        for (j = 0; j < b.length; j++) {
          projected = normal.x * b[j].x + normal.y * b[j].y;
          if (minB === undefined || projected < minB) {
            minB = projected;
          }
          if (maxB === undefined || projected > maxB) {
            maxB = projected;
          }
        }
        if (maxA < minB || maxB < minA) {
          return false;
        }
      }
    }
    return true;
  }
}

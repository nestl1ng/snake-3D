export default class CollisionController {
  groups = {};

  constructor({ eventBus, container }) {
    this._container = container;
    this._eventBus = eventBus;

    this.onCollisionCreated = this.onCollisionCreated.bind(this);
    eventBus.addEventListener("collision:created", this.onCollisionCreated);
  }

  onCollisionCreated({ data: { collisionType, group, name, data } }) {
    if (!this.groups[group]) this.groups[group] = {};

    this.groups[group][name] = { type: collisionType, data };
    console.log(this.groups);
  }

  update() {
    //console.log(this.groups.target.SnakeHead.data[0]);
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
              const isCollide = this.check(sCollisionData, collisionData);
              if (isCollide) {
                //TODO:dispatch
              }
            }
          );
        });
      });
      groups.splice(i, 1);
    }
  }

  check(target, obj) {
    this.polTarget = this.poligonMass(target);
    this.flag = [];
    for (let i = 0; i < obj.length; i++) {
      this.polObj = this.poligonMass(obj[i]);
      this.flag.push(this.poligonIntersection(this.polTarget, this.polObj));
    }
    for (let i = 0; i < obj.length; i++) {
      if (this.flag[i]) {
        return true;
      }
    }
    return false;
  }

  checkCollision(target, obj, event) {
    this.polTarget = this.poligonMass(target);
    this.flag = [];
    for (let i = 0; i < obj.length; i++) {
      this.polObj = this.poligonMass(obj[i]);
      this.flag.push(this.poligonIntersection(this.polTarget, this.polObj));
    }
    for (let i = 0; i < obj.length; i++) {
      if (this.flag[i]) {
        this._eventBus.dispatchEvent(event);
      }
    }
  }

  //poligons
  poligonMass(mass) {
    let polMass = [];
    for (let i = 0; i < mass.length; i++) {
      polMass.push({ x: mass[i].x, y: mass[i].z });
    }
    return polMass;
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

import { dot } from "./util";

export class RayCaster {
  constructor() {
    this.objects = [];
  }

  add(object) {
    this.objects.push(object);
  }

  hit(ray, tmin, tmax, record) {
    const temp_rec = new HitRecord();
    let hit_anyting = false;
    let closest_so_far = tmax;
    for (let i = 0; i < this.objects.length; i++) {
      const object = this.objects[i];
      if (object.hit(ray, tmin, closest_so_far, temp_rec)) {
        hit_anyting = true;
        closest_so_far = temp_rec.t;
        Object.assign(record, temp_rec);
      }
    }
    return hit_anyting;
  }
}



export class HitRecord {
  constructor(p, normal, mat, t, front_face) {
    this.p = p;
    this.normal = normal;
    this.mat = mat;
    this.t = t;
    this.front_face = front_face;
  }

  set_face_normal(ray, outwardNormal) {
    this.front_face = dot(ray.direction, outwardNormal) < 0;
    this.normal = this.front_face ? outwardNormal : outwardNormal.multiply(-1);
  }
}
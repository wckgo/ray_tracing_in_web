import { random, Vec3, sub, multiply } from "./util";
import { aspect_ratio } from "./constants";

// camera config
const lookfrom = new Vec3(12, 2, 3);
const lookat = new Vec3();
const vup = new Vec3(0, 1, 0);
const dist_to_focus = 10.0;
const aperture = 0.1;
const camera = {
  lookfrom,
  lookat,
  vup,
  aspect_ratio,
  dist_to_focus,
  aperture
};

export const scene = {
  samples_per_pixel: 16,
  ray_tracing_depth: 64,
  camera,
  world: random_world()
}

function random_world() {
  const word = [];
  word.push({
    center: { x: 0, y: -1000, z: 0 },
    radius: 1000,
    mat: {
      type: "metal",
      arg: [{ x: 0.3, y: 0.3, z: 0.3 }, 0.6]
    }
  });
  for (let a = -11; a < 11; a++) {
    for (let b = -11; b < 11; b++) {
      if (a > -5 && a < 5 && b > -1 && b < 1) continue;
      const choose_mat = random();
      const center = new Vec3(a + 0.9 * random(), 0.2, b + 0.9 * random());
      const point = new Vec3(4, 0.2, 0);
      if (sub(center, point).length() > 0.9) {
        if (choose_mat < 0.8) {
          // diffuse
          const albedo = multiply(Vec3.random(), Vec3.random());
          word.push({
            center,
            radius: 0.2,
            mat: {
              type: "lambertian",
              arg: [albedo]
            }
          });
        } else if (choose_mat < 0.95) {
          // metal
          const albedo = Vec3.random(0.5, 1);
          const fuzz = random(0, 0.5);
          word.push({
            center,
            radius: 0.2,
            mat: {
              type: "metal",
              arg: [albedo, fuzz]
            }
          });
        }
        else {
          // glass
          word.push({
            center,
            radius: 0.2,
            mat: {
              type: "dielectric",
              arg: [1.5]
            }
          });
        }
      }
    }
  }

  word.push({
    center: { x: 0, y: 1, z: 0 },
    radius: 1,
    mat: {
      type: "dielectric",
      arg: [1.5]
    }
  });
  word.push({
    center: { x: -4, y: 1, z: 0 },
    radius: 1,
    mat: {
      type: "lambertian",
      arg: [{ x: 0.4, y: 0.2, z: 0.1 }]
    }
  });
  word.push({
    center: { x: 4, y: 1, z: 0 },
    radius: 1,
    mat: {
      type: "metal",
      arg: [{ x: 0.8, y: 0.8, z: 0.8 }, 0]
    }
  });
  return word;
}
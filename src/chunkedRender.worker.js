import { Vec3, multiply, random, clamp } from "./util";
import Camera from "./camera";
import { RayCaster, HitRecord } from "./ray_caster";
import Sphere from "./sphere";
import { lambertian, metal, dielectric } from "./material";

self.addEventListener("message", event => {
  const { height, width, offset, chunkHeight, buffer, scene } = event.data;
  const camera = initCamera(scene.camera);
  const world = initWorld(scene.world);
  const samples_per_pixel = scene.samples_per_pixel;
  const ray_tracing_depth = scene.ray_tracing_depth;
  const scale = 1.0 / samples_per_pixel;
  const preLinePixelCount = width * 4;
  const view = new Uint8ClampedArray(buffer);
  for (let i = 0; i < chunkHeight; i++) {
    for (let j = 0; j < width; j++) {
      const pixel_color = new Vec3();
      for (let s = 0; s < samples_per_pixel; s++) {
        let u = j;
        let v = (i + offset);
        u = (u + random()) / (width - 1);
        v = (v + random()) / (height - 1);
        const r = camera.get_ray(u, 1 - v);
        pixel_color.add(ray_color(r, world, ray_tracing_depth));
      }
      let r = pixel_color.x;
      let g = pixel_color.y;
      let b = pixel_color.z;
      r = Math.sqrt(scale * r);
      g = Math.sqrt(scale * g);
      b = Math.sqrt(scale * b);
      const index = (i + offset) * preLinePixelCount + j * 4;
      view[index] = clamp(r, 0, 1) * 255;
      view[index + 1] = clamp(g, 0, 1) * 255;
      view[index + 2] = clamp(b, 0, 1) * 255;
      view[index + 3] = 255;
    }
    self.postMessage({ done: false });
  }
  self.postMessage({ done: true });
})

function ray_color(ray, world, depth) {
  if (depth <= 0) return new Vec3(0, 0, 0);
  const record = new HitRecord();
  if (world.hit(ray, 0.0001, Infinity, record)) {
    const result = record.mat.scatter(ray, record)
    if (result.scatter) {
      return multiply(result.attenuation, ray_color(result.scattered, world, depth - 1));
    }
    return new Vec3(0, 0, 0);
  }
  const normalize = ray.direction.clone().normalize();
  const t = 0.5 * (normalize.y + 1);
  return new Vec3(1, 1, 1).multiply(1 - t).add(new Vec3(0.5, 0.7, 1.0).multiply(t));
}

function initCamera(camera) {
  const { lookfrom, lookat, vup, aspect_ratio, aperture, dist_to_focus } = camera;
  return new Camera(new Vec3().copy(lookfrom), new Vec3().copy(lookat), new Vec3().copy(vup), 20, aspect_ratio, aperture, dist_to_focus);
}

function initWorld(world) {
  const list = new RayCaster();
  world.forEach(object => {
    const center = new Vec3().copy(object.center);
    const radius = object.radius;
    let mat;
    switch (object.mat.type) {
      case "lambertian":
        mat = new lambertian(new Vec3().copy(object.mat.arg[0]));
        break;
      case "metal":
        mat = new metal(new Vec3().copy(object.mat.arg[0]), object.mat.arg[1]);
        break;
      case "dielectric":
        mat = new dielectric(object.mat.arg[0]);
        break;
    }
    list.add(new Sphere(center, radius, mat));
  });
  return list;
}
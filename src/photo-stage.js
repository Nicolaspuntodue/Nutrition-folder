// Foto vere dei pasti in WebGL: dissolvenza tra un piatto e l'altro e una leggera inclinazione 3D con lo scroll.
import * as THREE from 'three'

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`
// Mescola le due foto con un rumore morbido: il nuovo piatto "affiora" sul vecchio.
const fragment = /* glsl */ `
  uniform sampler2D a; uniform sampler2D b; uniform float mixv; uniform vec2 cover;
  varying vec2 vUv;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
  }
  void main() {
    vec2 uv = (vUv - 0.5) * cover + 0.5;
    float n = noise(vUv * 6.0) * 0.6 + noise(vUv * 18.0) * 0.4;
    float t = smoothstep(n - 0.18, n + 0.18, mixv * 1.36 - 0.18);
    gl_FragColor = mix(texture2D(a, uv), texture2D(b, uv), t);
    #include <colorspace_fragment>
  }
`

export function createPhotoStage(canvas, urls) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 20)
  camera.position.z = 3.2

  const loader = new THREE.TextureLoader()
  const textures = urls.map((u) => {
    const t = loader.load(u)
    t.colorSpace = THREE.SRGBColorSpace
    t.anisotropy = 4
    return t
  })
  const uniforms = { a: { value: textures[0] }, b: { value: textures[0] }, mixv: { value: 1 }, cover: { value: new THREE.Vector2(1, 1) } }
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.ShaderMaterial({ uniforms, vertexShader: vertex, fragmentShader: fragment }))
  scene.add(mesh)

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  let tilt = 0, pointer = 0, current = 0, raf = 0

  function resize() {
    const { clientWidth: w, clientHeight: h } = canvas
    if (!w || !h) return
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    // Il piano riempie il riquadro, un filo più grande così l'inclinazione non scopre i bordi.
    const height = 2 * Math.tan((camera.fov * Math.PI) / 360) * camera.position.z * 1.12
    mesh.scale.set(height * camera.aspect, height, 1)
    // Foto quadrate ritagliate come object-fit: cover.
    uniforms.cover.value.set(Math.min(1, camera.aspect), Math.min(1, 1 / camera.aspect))
  }

  function frame() {
    if (uniforms.mixv.value < 1) uniforms.mixv.value = Math.min(1, uniforms.mixv.value + (reduce ? 1 : 0.022))
    const k = reduce ? 0 : 1
    mesh.rotation.x = k * (-0.1 + tilt * 0.22)
    mesh.rotation.y = k * pointer * 0.12
    renderer.render(scene, camera)
    raf = requestAnimationFrame(frame)
  }

  canvas.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect()
    pointer = (e.clientX - r.left) / r.width - 0.5
  })
  canvas.addEventListener('pointerleave', () => { pointer = 0 })

  new ResizeObserver(resize).observe(canvas)
  resize()
  raf = requestAnimationFrame(frame)

  return {
    show(i) {
      if (i === current) return
      uniforms.a.value = textures[current]
      uniforms.b.value = textures[i]
      uniforms.mixv.value = 0
      current = i
    },
    setTilt(p) { tilt = Math.max(0, Math.min(1, p)) },
    stop() { cancelAnimationFrame(raf) },
  }
}

// Імпорт через CDN як ES-модулі
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/loaders/RGBELoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/controls/OrbitControls.js';

/**
 * Cursor
 */
const cursor = {
    x: 0,
    y: 0
}

window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = - (event.clientY / sizes.height - 0.5)
})



/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Scene
const scene = new THREE.Scene()

// Camera
const camera = new THREE.PerspectiveCamera(60, sizes.width / sizes.height, 1, 100)
camera.position.set(0, 75, 50)

scene.add(camera)


// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(sizes.width, sizes.height)
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ACESFilmicToneMapping
document.body.appendChild(renderer.domElement)


const rgbeLoader = new RGBELoader()
rgbeLoader.load('https://cdn.jsdelivr.net/gh/PazyukAleksey/treejs-cource@main/src/webgl/cat/texture.hdr', (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping
    scene.environment = texture
    scene.background = texture
})

const gltfLoader = new GLTFLoader()
gltfLoader.load(
    'https://cdn.jsdelivr.net/gh/PazyukAleksey/treejs-cource@main/src/webgl/cat/cat-404.glb',
    (gltf) => {
        const model = gltf.scene
        model.scale.set(0.1, 0.1, 0.1)
        model.position.set(0, -15, 0)
        scene.add(model)
    },
    (progress) => {
        console.log(`load: ${(progress.loaded / progress.total * 100).toFixed(2)}%`)
    },
    (error) => {
        console.error('load error:', error)
    }
)

const light = new THREE.DirectionalLight(0x00ff00, 1)
light.position.set(5, 10, 5)
scene.add(light)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.enableZoom = false
controls.enablePan = false
controls.enableRotate = false

let mouseX = 0
let mouseY = 0
const targetX = 0
const targetY = 0

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 10 * (- 1)
    mouseY = -(event.clientY / window.innerHeight) * 10
})

function animate() {
    requestAnimationFrame(animate)

    camera.position.x += (mouseX * 2 - camera.position.x) * 0.1
    camera.position.y += (mouseY * 1 - camera.position.y) * 0.1
    camera.lookAt(0, 0, 0)

    controls.update()
    renderer.render(scene, camera)
}
animate()

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})
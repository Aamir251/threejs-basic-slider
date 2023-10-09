import * as THREE from 'three'
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import vertexShader from '/shaders/vertex.glsl'
import fragmentShader from '/shaders/fragment.glsl'

/**
 * Three JS Scene
*/
const scene = new THREE.Scene()

const canvas = document.querySelector('canvas')
const sizes = {
    width : window.innerWidth,
    height : window.innerHeight
}

const gui = new dat.GUI()


/**
 * Textures
 */

const textureLoader = new THREE.TextureLoader()

const waterTexture = textureLoader.load("/textures/water.jpg");



/**
 * Objects
 */
let time = 1.0
const geometry = new THREE.PlaneGeometry(0.5, 0.5, 32, 32)
const sphereGeom = new THREE.SphereGeometry(0.5, 32, 32)
// Material
const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  // wireframe : true,  
  uniforms : {
    time : { value : time },
    resolution : { value : new THREE.Vector2() },
    uTexture : { value : waterTexture }
  }
  // transparent : true
})

// mesh
const mesh = new THREE.Mesh(geometry, material)


scene.add(mesh)


/**
 * Camera
*/
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.01, 10)
camera.position.z = 1
scene.add(camera)


/**
 * Renderer
*/
const renderer = new THREE.WebGLRenderer({
  canvas
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


/** 
 * Orbit Controls
*/

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true


/**
 * Clock (Main function)
*/

const clock = new THREE.Clock()
// let time = Date.now()

const tick = () => {

  // time
  const currentTime = Date.now()
  const deltaTime = currentTime - time;

  const elapsedTime = clock.getElapsedTime()


  time += 0.05
  material.uniforms.time.value = time;
  // update orbitol controls
  controls.update()
  // render
  renderer.render(scene, camera)
  // time = currentTime

  window.requestAnimationFrame(tick)
}

tick()


/**
 * Responsive Canvas
 */
window.addEventListener('resize', () => {
  // update the sizes variable
  sizes.width = window.innerWidth,
  sizes.height = window.innerHeight

  // update camera
  camera.aspect = sizes.width / sizes.height

  // update the Three JS Projections matrix
  camera.updateProjectionMatrix()
  // update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})
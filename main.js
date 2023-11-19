import * as THREE from 'three'
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import vertexShader from '/shaders/vertex.glsl'
import fragmentShader from '/shaders/fragment.glsl'
import ASScroll from '@ashthornton/asscroll'
import barba from '@barba/core';
import gsap from 'gsap';

/**
 * ASScroll initialization
*/

let asscroll = new ASScroll({ disableRaf : true })
let scrollVal = 0.0;

let isScrolling = false;


window.addEventListener('load', () => {
  asscroll.enable({ 
    horizontalScroll : !document.body.classList.contains('b-inside'),
  })
})
let lastVal;
let timeoutId;
let isScrollingBackward = false

const updateScrollVal = () => 
{
  if (isScrolling) {
    scrollVal += 1;
    if(scrollVal > 50) {
      scrollVal = 50
    }
  } else {
    scrollVal -= 3
    if(scrollVal < 0) {
      scrollVal = 0
    }
  }
}

// let isExecuted = false
// asscroll.on('update', ({ targetPos, currentPos }) => {

//   if (targetPos !== lastVal) {
//     clearTimeout(timeoutId)
//     isScrolling = true;
//     console.log("scrolling true");
//     isExecuted = false
//   } else {
//     if (!isExecuted) {
//       isExecuted = true;

//       timeoutId = setTimeout(() => {
//         isScrolling = false;
//         console.log("trgg");
//       }, 150)
//     } 
//   }

//   lastVal = targetPos;
//   updateScrollVal()

// })



/**
 * Three JS Scene
*/
const scene = new THREE.Scene()

const canvas = document.querySelector('#app canvas')
const sizes = {
    width : window.innerWidth,
    height : window.innerHeight
}

/**
 * Properties 
*/

const settings = {
  progress : 0
}

/** Setup Dat GUI */
const gui = new dat.GUI()
gui.add(settings, 'progress').min(0).max(1).step(0.001)

/**
 * Textures
 */

const textureLoader = new THREE.TextureLoader()

const waterTexture = textureLoader.load("/textures/texture.jpg");


/**
 * Objects
*/

let time = 1.0
const geometry = new THREE.PlaneGeometry(1, 1, 100, 100)
// Material
const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  // wireframe : true,  
  uniforms : {
    time : { value : time },
    uProgress : { value : settings.progress },
    uResolution : { value : new THREE.Vector2(sizes.width, sizes.height) },
    uTexture : { value : waterTexture },
    // for the aspect ratio of texture rather than the actual texture size
    uTextureSize : { value : new THREE.Vector2(100, 100) }, 
    uQuadSize : { value : new THREE.Vector2(300, 300) },
    uCorners : { value : new THREE.Vector4(0, 0, 0, 0) },
    uScrollProgress : { value : scrollVal }
  }
  // transparent : true
})

// Original Mesh done for practice purpose
const mesh = new THREE.Mesh(geometry, material)
mesh.scale.set(300, 300, 1)
mesh.position.x = 200
// scene.add(mesh)

/**
 * HTML Images via WebGL 
*/

let slideMaterials = []
let imageStore = []
const addObjects = () => {
  const slideImages = [...document.querySelectorAll(".slider-image")];

  console.log("adding objects ");
  imageStore = slideImages.map((img, index) => {
    const bounds = img.getBoundingClientRect()
    const { top, left, height, width } = bounds;
  
    let m = material.clone()
    slideMaterials.push(m);
  
    let loader = new THREE.TextureLoader()
    let texture = loader.load(img.getAttribute('src'))
    m.uniforms.uTexture.value = texture
  
    let slideMesh = new THREE.Mesh(geometry, m)
    slideMesh.scale.set(width, height, 1)
    scene.add(slideMesh);
  
    return {
      img,
      mesh : slideMesh,
      width,
      height,
      top,
      left
    }
  })
  
}

addObjects()


const setSlideImagesPosition = () =>
{

  imageStore.forEach(obj => {
    obj.mesh.position.y = -obj.top + sizes.height / 2 - obj.height / 2
    obj.mesh.position.x = -asscroll.currentPos + obj.left - (sizes.width / 2) + obj.width / 2;
  })
  
}

const setClickListener = () => {
  imageStore.forEach(({ img, mesh }) => {
    img.addEventListener('click', () => {
      console.log("clicked");
      const tl = gsap.timeline()
      tl.to(mesh.material.uniforms.uCorners.value, {
        x : 1,
        duration : 0.4
      })
      .to(mesh.material.uniforms.uCorners.value, {
        y : 1,
        duration : 0.4
      }, 0.1)
      .to(mesh.material.uniforms.uCorners.value, {
        z : 1,
        duration : 0.4
      }, 0.3)
      .to(mesh.material.uniforms.uCorners.value, {
        w : 1,
        duration : 0.4
      }, 0.3)
  
    })
  })
}

setClickListener()


/**
 * Camera
*/
const camera = new THREE.PerspectiveCamera(80, sizes.width / sizes.height, 10, 1000)
camera.position.z = 600

camera.fov = Math.atan((sizes.height / 2)/600) * (180 / Math.PI) * 2;
camera.updateProjectionMatrix()
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

  asscroll.update()
  setSlideImagesPosition()
  
  // updateScrollVal()
  /** 
   Update material properties 
  */
  material.uniforms.time.value = time;
  material.uniforms.uProgress.value = settings.progress

  material.uniforms.uScrollProgress.value = scrollVal;
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

const handleResize = () => {
  // update the sizes variable
  sizes.width = window.innerWidth,
  sizes.height = window.innerHeight;


  // we need this for full screen size of the shader on inner page
  slideMaterials.forEach(m => {
    m.uniforms.uResolution.value.x = sizes.width;
    m.uniforms.uResolution.value.y = sizes.height;

  })


  //resetting things
  console.log("image store ", imageStore);
  imageStore.forEach(item => {
    let bounds = item.img.getBoundingClientRect()
    item.mesh.scale.set(bounds.width, bounds.height, 1)

    item.mesh.position.x = bounds.left - (sizes.width / 2) + bounds.width / 2
    item.mesh.position.y = -bounds.top + sizes.height / 2 - bounds.height / 2


    item.top = bounds.top;
    item.left = bounds.left + asscroll.currentPos;


    item.width = bounds.width;
    item.height = bounds.height

    item.mesh.material.uniforms.uQuadSize.value.x = bounds.width
    item.mesh.material.uniforms.uQuadSize.value.y = bounds.height;

    item.mesh.material.uniforms.uTextureSize.value.x = bounds.width
    item.mesh.material.uniforms.uTextureSize.value.y = bounds.height;


  })
  // update camera
  camera.aspect = sizes.width / sizes.height
  camera.fov = Math.atan((sizes.height / 2)/600) * (180 / Math.PI) * 2;
  // update the Three JS Projections matrix
  camera.updateProjectionMatrix()
  // update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
}


window.addEventListener('resize', handleResize)

handleResize()


/**
 * Barba Initialization
*/

barba.init({
  transitions : [
    {
      name : "from-home-transition",
      from: {
        namespace: ["home"]
      },
      leave(data) {
        asscroll.disable()
        return gsap.timeline()
          .to(data.current.container, {
            opacity : 0
          })
      },

      enter(data) {

        asscroll = new ASScroll({ 
          disableRaf : true,
          containerElement : data.next.container.querySelector('[asscroll-container]')
        })
        asscroll.enable({
          newScrollElements : data.next.container.querySelector(".scroll-wrap")
        })
        return gsap.timeline()
        .from(data.next.container, {
          opacity : 0,
          onComplete : () => {
            canvas.style.visibility = "hidden";
          }
        })
      }
    },
    {
      name : "from-inside-page-transition",
      from: {
        namespace: ["inside"]
      },
      leave(data) {
        asscroll.disable()
        return gsap.timeline()
          .to('.curtain', {
            duration : 0.3,
            y : 0
          })
          .to(data.current.container, {
            opacity : 0
          })
      },

      enter(data) {
        asscroll = new ASScroll({ 
          disableRaf : true,
          containerElement: data.next.container.querySelector("[asscroll-container]")

        })
        asscroll.enable({
          horizontalScroll: true,
          newScrollElements: data.next.container.querySelector('.scroll-wrap')
        })

        imageStore.forEach(m => {
          scene.remove(m.mesh)
        })
        imageStore = []
        slideMaterials = []
        addObjects()
        handleResize()
        setClickListener()
        canvas.style.visibility = 'visible'
        return gsap.timeline()
        .to(".curtain", {
          duration : 0.3,
          y : "-100%"
        })
        .from(data.next.container, {
          opacity : 0,
        })
      }
    }
  ]
})
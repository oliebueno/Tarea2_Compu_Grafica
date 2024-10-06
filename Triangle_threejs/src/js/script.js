import * as THREE from 'three'

// Canvas
const canvas = document.querySelector('canvas.webgl');
console.log(canvas);

// Create a scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1b1e2b);

// Create a object

// -Create a geometry 
const geometry = new THREE.BufferGeometry();

// -Vertices
const vertices = new Float32Array([
    -0.50, 0, 0, // Vertex 1
    0.50, 0, 0,  // Vertex 2
    0, 0.87, 0   // Vertex 3
]);

// Define the colors for each vertex
const colors = new Float32Array([
    0, 1, 0, // Green for vertex 1
    0, 0, 1, // Blue for vertex 2
    1, 0, 0  // Red for vertex 3
  ]);
  
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  
  const material = new THREE.MeshBasicMaterial({
    vertexColors: true
  });
  
  const mesh = new THREE.Mesh(geometry, material);

// Add the mesh to the scene
scene.add(mesh);

// Size
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Camera
const camera = new THREE.PerspectiveCamera(50, sizes.width/sizes.height, 0.1, 1000);
camera.position.z = 3;
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);

renderer.render(scene, camera);
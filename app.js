const THREE = require('three');
const OrbitControls = require('three/examples/jsm/controls/OrbitControls').OrbitControls;
const OBJLoader = require('three/examples/jsm/loaders/OBJLoader').OBJLoader;

// Create a list of collidable objects
let collidableMeshList = [];

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add a point light
const light = new THREE.PointLight(0xFFFFFF);
light.position.set(0, 0, 10);
scene.add(light);

// Load your .obj file
const objLoader = new OBJLoader();
objLoader.load('models/computerroom.obj', function (object) {
  scene.add(object);
  // Add loaded object to collidableMeshList
  collidableMeshList.push(object);
});

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;

function animate() {
  requestAnimationFrame(animate);
  controls.update();

  // Check for collisions
  for (var vertexIndex = 0; vertexIndex < camera.geometry.attributes.position.array.length; vertexIndex++) {
     var localVertex = new THREE.Vector3().fromBufferAttribute(camera.geometry.attributes.position, vertexIndex).clone();
     var globalVertex = localVertex.applyMatrix4(camera.matrix);
     var directionVector = globalVertex.sub(camera.position);

     var ray = new THREE.Raycaster(camera.position, directionVector.clone().normalize());
     var collisionResults = ray.intersectObjects(collidableMeshList);
     if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
        // A collision occurred, stop movement
        controls.stop();
     }
  }

  renderer.render(scene, camera);
}

animate();

import * as Three from 'three';

const vertexShader = `
    varying vec2 vUv;
    void main()	{
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }
  `;
const fragmentShader = `
		//#extension GL_OES_standard_derivatives : enable

    varying vec2 vUv;
    uniform float thickness;
    uniform sampler2D u_tex;

    float edgeFactor(vec2 p){
    	vec2 grid = abs(fract(p - 0.5) - 0.5) / fwidth(p) / thickness;
  		return min(grid.x, grid.y);
    }

    void main() {

      float a = edgeFactor(vUv);
      if (a > 0.3) {
        gl_FragColor = texture(u_tex, vUv);
      } else {
        gl_FragColor = vec4(0.019, 0.003, 0.578, 0);
      }
    }
  `;



const scene = new Three.Scene();
const camera = new Three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new Three.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement)

const geometry = new Three.PlaneGeometry(16, 9);

const texture = new Three.TextureLoader().load('/spotify.png');

// immediately use the texture for material creation
const material2 = new Three.MeshBasicMaterial({ map: texture });
var material3 = new Three.ShaderMaterial({
    uniforms: {
        thickness: {
            value: 2.5
        },
        u_tex: { type: "t", value: texture }
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader
});

const cube = new Three.Mesh(geometry, material3);

scene.add(cube);
scene.background = new Three.Color(0xff0000);

camera.position.z = 15;
cube.rotation.y = -0.7;
// cube.rotation.x = 0.2;

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();

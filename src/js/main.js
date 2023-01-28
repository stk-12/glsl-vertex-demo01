import '../css/style.scss'
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from 'lil-gui';
import vertexSource from "./shader/vertexShader.glsl";
import fragmentSource from "./shader/fragmentShader.glsl";

class Main {
  constructor() {
    this.viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    this.canvas = document.querySelector("#canvas");
    this.renderer = null;
    this.scene = new THREE.Scene();
    this.camera = null;
    this.cameraFov = 45;
    this.cameraFovRadian = (this.cameraFov / 2) * (Math.PI / 180);
    this.cameraDistance = (this.viewport.height / 2) / Math.tan(this.cameraFovRadian);
    this.controls = null;
    this.geometry = null;
    this.material = null;
    this.mesh = null;

    this.gui = new dat.GUI();

    this.step = 0;

    this.uniforms = {
      uTime: {
        value: 0.0
      },
      //振幅
      uWave: {
        value: 5.0
      },
      //周波数
      uFrequency: {
        // value: 3.0
        // value: new THREE.Vector2(4, 6)
        value: new THREE.Vector3(4, 4, 4)
      }
    };

    this.init();
  }

  _setRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.viewport.width, this.viewport.height);
  }

  _setCamera() {
    // this.camera = new THREE.PerspectiveCamera(45, this.viewport.width / this.viewport.height, 1, 100);
    // this.camera.position.set(0, 0, 5);
    // this.scene.add(this.camera);

    //ウインドウとWebGL座標を一致させる
    // const fov = 45;
    // const fovRadian = (fov / 2) * (Math.PI / 180); //視野角をラジアンに変換
    // const distance = (this.viewport.height / 2) / Math.tan(fovRadian); //ウインドウぴったりのカメラ距離
    this.camera = new THREE.PerspectiveCamera(this.cameraFov, this.viewport.width / this.viewport.height, 1, this.cameraDistance * 2);
    this.camera.position.z = this.cameraDistance;
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.scene.add(this.camera);
  }

  _setControlls() {
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;
  }

  _setGui() {
    this.gui.add(this.uniforms.uWave, "value").min(0).max(50).step(0.1);
  }

  _setLight() {
    const light = new THREE.DirectionalLight(0xffffff, 1.5);
    light.position.set(1, 1, 1);
    this.scene.add(light);
  }

  _addMesh() {
    //ジオメトリ
    this.geometry = new THREE.IcosahedronGeometry(200, 6);

    //マテリアル
    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: vertexSource,
      fragmentShader: fragmentSource,
      wireframe: true,
    });

    //メッシュ
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  init() {
    this._setRenderer();
    this._setCamera();
    this._setControlls();
    this._setLight();
    this._addMesh();

    this._update();
    this._addEvent();

    this._setGui();
  }

  _update() {

    // this.mesh.rotation.y += 0.001;
    this.step += 0.005;

    // this.camera.position.x = 1000 * Math.sin(this.step);
    // this.camera.position.z = 1000 * Math.cos(this.step);

    this.uniforms.uTime.value += 0.03;

    //レンダリング
    this.renderer.render(this.scene, this.camera);
    this.controls.update();
    requestAnimationFrame(this._update.bind(this));
  }

  _onResize() {
    this.viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    }
    // レンダラーのサイズを修正
    this.renderer.setSize(this.viewport.width, this.viewport.height);
    // カメラのアスペクト比を修正
    this.camera.aspect = this.viewport.width / this.viewport.height;
    this.camera.updateProjectionMatrix();
    // カメラの位置を調整
    this.cameraDistance = (this.viewport.height / 2) / Math.tan(this.cameraFovRadian); //ウインドウぴったりのカメラ距離
    this.camera.position.z = this.cameraDistance;

  }

  _addEvent() {
    window.addEventListener("resize", this._onResize.bind(this));
  }
}

const main = new Main();

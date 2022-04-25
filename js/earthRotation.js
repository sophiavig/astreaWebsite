/**
 * Inspired by Bryan Jones
 * @see https://codepen.io/bartuc/pen/yMMyav
 */

/**
 * @file
 * The main scene.
 */

/**
 * Define constants.
 */
 const TEXTURE_PATH = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/123879/';

 /**
  * Create the animation request.
  */
 if (!window.requestAnimationFrame) {
   window.requestAnimationFrame = (function() {
     return window.mozRequestAnimationFrame ||
     window.msRequestAnimationFrame ||
     window.oRequestAnimationFrame ||
     window.webkitRequestAnimationFrame ||
     function (callback, element) {
       // 60 FPS
       window.setTimeout(callback, 1000 / 60);
     };
   })();
 }

 /**
  * Set our global variables.
  */
 var camera,
     scene,
     renderer,
     effect,
     element,
     container,
     sphere,
     sphereCloud,
     rotationPoint;
 var degreeOffset = 90;
 var earthRadius = 300;

 var getEarthRotation = function() {
   // Get the current time.
   var d = new Date();
   var h = d.getUTCHours();
   var m = d.getUTCMinutes();

   // Calculate total minutes.
   var minutes = h * 60;
   minutes += m;

   // Turn minutes into degrees.
   degrees = minutes/3.9907;

   // Add an offset to match UTC time.
   degrees += degreeOffset;
   return degrees;
 }

 var degrees = getEarthRotation();

 // Calculate Earth's rotation position.
 setInterval(function() {
   // Get the current time.
   var d = new Date();
   var h = d.getUTCHours();
   var m = d.getUTCMinutes();

   // Calculate total minutes.
   var minutes = h * 60;
   minutes += m;

   // Turn minutes into degrees.
   degrees = minutes/3.9907;

   // Add an offset to match UTC time.
   degrees += degreeOffset;
 }, 60000);

 init();
 animate();

 /**
  * Initializer function.
  */
 function init() {
   // Build the container
   container = document.querySelector('#earth')

   // Create the scene.
   scene = new THREE.Scene();

   // Create a rotation point.
   baseRotationPoint = new THREE.Object3D();
   baseRotationPoint.position.set( 0, 0, 0 );
   scene.add( baseRotationPoint );

   // Create world rotation point.
   worldRotationPoint = new THREE.Object3D();
   worldRotationPoint.position.set( 0, 0, 0 );
   scene.add( worldRotationPoint );

   rotationPoint = new THREE.Object3D();
   rotationPoint.position.set( 0, -200, earthRadius * 2 );
   baseRotationPoint.add( rotationPoint );

   // Create the camera.
   camera = new THREE.PerspectiveCamera(
    35, // Angle
     window.innerWidth / 700, // Aspect Ratio.
     1, // Near view.
     10000 // Far view.
   );
   rotationPoint.add( camera );

   // Build the renderer.
   renderer = new THREE.WebGLRenderer({antialias: true});
   element = renderer.domElement;
   renderer.setSize( window.innerWidth, 700 );
   renderer.shadowMap.enabled;
   container.appendChild( element );

   // Ambient lights
   var ambient = new THREE.AmbientLight( 0x222222 );
   scene.add( ambient );

   // The sun.
   var light = new THREE.PointLight( 0xffeecc, 2, 5000 );
   light.position.set( -0, -800, 100 );
   scene.add( light );

   // Since the sun is much bigger than a point of light, add four fillers.
   var light2 = new THREE.PointLight( 0xffffff, 0.6, 4000 );
   light2.position.set( -0, -800, 250 );
   scene.add( light2 );

   var light3 = new THREE.PointLight( 0xffffff, 0.6, 4000 );
   light3.position.set( -0, -800, -150 );
   scene.add( light3 );

   var light4 = new THREE.PointLight( 0xffffff, 0.6, 4000 );
   light4.position.set( -0, 800, 100 );
   scene.add( light4 );

   var light5 = new THREE.PointLight( 0xffffff, 0.6, 4000 );
   light5.position.set( -0, -800, 100 );
   scene.add( light5 );

   // Add the Earth sphere model.
   var geometry = new THREE.SphereGeometry( earthRadius, 128, 128 );

   // Create the Earth materials.
   loader = new THREE.TextureLoader();
   loader.setCrossOrigin( 'https://s.codepen.io' );
   //var texture = loader.load( TEXTURE_PATH + 'ColorMap.jpg' );
   var texture = loader.load( '../img/ColorMap.jpg' );

   var bump = null;
   bump = loader.load( TEXTURE_PATH + 'Bump.jpg' );

   var spec = null;
   spec = loader.load( TEXTURE_PATH + 'SpecMask.jpg' );

   var material = new THREE.MeshPhongMaterial({
     color: "#ffffff",
     shininess: 6,
     map: texture,
     specularMap: spec,
     specular: "#666666",
     bumpMap: bump,
   });

   sphere = new THREE.Mesh( geometry, material );
   sphere.position.set( 0, 0, 0 );
   sphere.rotation.y = Math.PI;

   // Focus initially on the prime meridian.
   sphere.rotation.y = -1 * (8.7 * Math.PI / 17);

   // Add the Earth to the scene.https://s3-us-west-2.amazonaws.com/s.cdpn.io/123879/Bump.jpg
   worldRotationPoint.add( sphere );

   // Add the Earth sphere model.
   var geometryCloud = new THREE.SphereGeometry( earthRadius + 0.2, 128, 128 );

   loader = new THREE.TextureLoader();
   loader.setCrossOrigin( 'https://s.codepen.io' );
   //var alpha = loader.load( TEXTURE_PATH + "alphaMap.jpg" );
   var alpha = loader.load( '../img/fair_clouds_4k.jpg' );

   var materialCloud = new THREE.MeshPhongMaterial({
     alphaMap: alpha,
   });

   materialCloud.transparent = true;

   sphereCloud = new THREE.Mesh( geometryCloud, materialCloud );
   scene.add( sphereCloud );

   // Create a glow effect.
   loader = new THREE.TextureLoader();
   loader.setCrossOrigin( 'https://s.codepen.io' );
   var glowMap = loader.load( TEXTURE_PATH + "glow.png" );

   // Create the sprite to add the glow effect.
   var spriteMaterial = new THREE.SpriteMaterial({
     map: glowMap,
     color: 0x0099ff,
     transparent: false,
     blending: THREE.AdditiveBlending
   });
   var sprite = new THREE.Sprite( spriteMaterial );
   sprite.scale.set( earthRadius * 2.5, earthRadius * 2.5, 1.0);
   sphereCloud.add(sprite);

   // Add the skymap.
   addSkybox();

   window.addEventListener('resize', onWindowResize, false);
 }

 /**
  * Events to fire upon window resizing.
  */
 function onWindowResize() {
   camera.aspect = window.innerWidth / 700;
   camera.updateProjectionMatrix();
   renderer.setSize(window.innerWidth, 700);
 }

 /**
  * Updates to apply to the scene while running.
  */
 function update() {
   camera.updateProjectionMatrix();
   worldRotationPoint.rotation.y = degrees * Math.PI/180;
   sphereCloud.rotation.y += 0.00015;
   baseRotationPoint.rotation.y -= 0.00025;
 }

 /**
  * Render the scene.
  */
 function render() {
   renderer.render(scene, camera);
 }

 /**
  * Animate the scene.
  */
 function animate() {
   requestAnimationFrame(animate);
   update();
   render();
 }

 function addSkybox() {
   /*var urlPrefix = TEXTURE_PATH;
   var urls = [
     urlPrefix + 'test.jpg',
     urlPrefix + 'test.jpg',
     urlPrefix + 'test.jpg',
     urlPrefix + 'test.jpg',
     urlPrefix + 'test.jpg',
     urlPrefix + 'test.jpg',
   ];*/
   var urlPrefix = '../img/';
   var urls = [
     urlPrefix + 'skybox.jpg',
     urlPrefix + 'skybox.jpg',
     urlPrefix + 'skybox.jpg',
     urlPrefix + 'skybox.jpg',
     urlPrefix + 'skybox.jpg',
     urlPrefix + 'skybox.jpg'
   ];

   var loader = new THREE.CubeTextureLoader();
   loader.setCrossOrigin( 'https://s.codepen.io' );

   var textureCube = loader.load( urls );
   textureCube.format = THREE.RGBAFormat;

   var shader = THREE.ShaderLib[ "cube" ];
   shader.uniforms[ "tCube" ].value = textureCube;

   var material = new THREE.ShaderMaterial( {
     fragmentShader: shader.fragmentShader,
     vertexShader: shader.vertexShader,
     uniforms: shader.uniforms,
     depthWrite: false,
     side: THREE.BackSide
   } );

   var geometry = new THREE.BoxGeometry( 2000, 2000, 2000 );

   var skybox = new THREE.Mesh( geometry, material );

   scene.add( skybox );
 }
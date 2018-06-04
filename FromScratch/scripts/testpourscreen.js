
var canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas, true);
  function CreateScene(){


    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);

    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

    // This targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    // Our built-in 'sphere' shape. Params: name, subdivs, size, scene
    var stockage21  = BABYLON.SceneLoader.ImportMesh("", "/usine3d/FromScratch/objlouis/", "stockage2test7.obj", scene, function(newMeshes){
      var mesh = newMeshes[0];
       mesh.material = new BABYLON.StandardMaterial("mat",scene);
       mesh.material.emissiveColor = new BABYLON.Color3(1,0,1);


    });
    // Move the sphere upward 1/2 its height

    // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
    var ground = BABYLON.Mesh.CreateGround("ground1", 6, 6, 2, scene);

    return scene;

}

var scene1 = CreateScene(); // on crée une scène
engine.runRenderLoop(function() {
    scene1.render(); // refresh de la scene a chaque frame
});

var canvas = document.getElementById('renderCanvas');
var engine = new BABYLON.Engine(canvas, true);
var selectedMesh;
var initialMesh;
var joining = false;

var createScene = function() {

  // This creates a basic Babylon Scene object (non-mesh)
  var scene = new BABYLON.Scene(engine);

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //   Creation et gestion des cameras      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // This creates and positions a free camera (non-mesh)
  //var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
  // Free camera
  //var camera = new BABYLON.UniversalCamera('camera1', new BABYLON.Vector3(0, 20, -10), scene);
  //Arc camera
  var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), scene);
  camera.setPosition(new BABYLON.Vector3(1, 1, 1));

  // This targets the camera to scene origin
  camera.setTarget(BABYLON.Vector3.Zero());

  // This attaches the camera to the canvas
  camera.attachControl(canvas, true);
  camera.lowerBetaLimit = 0.1;
  camera.upperBetaLimit = (Math.PI / 2) * 0.99;
  camera.lowerRadiusLimit = 150;


  camera.wheelPrecision = 0.5;


  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////      Gestion de la lumière         ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  var light = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(-1, -2, -1), scene);
  light.position = new BABYLON.Vector3(0, 0, 0);
  light.intensity = 0.7;
  var light2 = new BABYLON.DirectionalLight("dir02", new BABYLON.Vector3(1, 2, 1), scene);
  light.position = new BABYLON.Vector3(0, 0, 0);


  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////  Gestion de l'objet selectionné     ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  window.addEventListener("click", function() {

    var pickResult = scene.pick(scene.pointerX, scene.pointerY);
    if (pickResult.hit) {
      selectedMesh = pickResult.pickedMesh;
      initialMesh = selectedMesh;
    }
  });

  var validscale = document.getElementById('validscaling');
  var validrot = document.getElementById('validrot');
  var deleteM = document.getElementById('deleteM');

  validscale.addEventListener('click', function() {
    var newscaleX = document.getElementById('scalingX');
    var newscaleY = document.getElementById('scalingY');
    var newscaleZ = document.getElementById('scalingZ');
    if (selectedMesh != undefined  && selectedMesh.id != ground.id) {
      modifyScaling(newscaleX.value, newscaleY.value, newscaleZ.value);
    }
  });

  validrot.addEventListener('click', function(){
    var newrotX = document.getElementById('rotationX').value;
    var newrotY = document.getElementById('rotationY').value;
    var newrotZ = document.getElementById('rotationZ').value;
    console.log(newrotX);
    console.log(newrotY);
    console.log(newrotZ);
    if (selectedMesh != undefined && selectedMesh.id != ground.id){
      modifyRotation(newrotX,newrotY,newrotZ);
    }
  });



  function modifyScaling(x, y, z) {
    selectedMesh.scaling.x = x;
    selectedMesh.scaling.y = y;
    selectedMesh.scaling.z = z;
  }

  function modifyRotation(x,y,z) {
    selectedMesh.rotation.x += x;
    selectedMesh.rotation.y += y;
    selectedMesh.rotation.z += z;
  }

  function deleteMesh(){

    selectedMesh.dispose();
  }



  $(aside).append('<button id="joinNow" class="btn" style="visibility:hidden" > Join</button>'); //boutton de validation de l'assemblage des mesh
  var joinNow = document.getElementById('joinNow');

  var selectedmeshes = [];

  function joinMeshes () {
    var here = false;
    joinNow.style.visibility = "visible";
    canvas.addEventListener('click', function(){
      for (var i=0; i<selectedmeshes.length; i++){
        if(selectedmeshes[i].name == selectedMesh.name){
          here = true;
        }
      }
      if (here == false) {
        selectedmeshes.push(selectedMesh);
        console.log("ajouté "+ selectedMesh.id);
      }

    });
    joinNow.addEventListener("click", function(){
      canvas.removeEventListener('click', function(){
        selectedmeshes.push(selectedMesh);
        console.log("ajouté "+ selectedMesh.id);
      });
      joinNow.style.visibility = "hidden";
      joinM(selectedmeshes.length);
    }
  );


}




function joinM (m) { //fonction recursive qui parcourt le tableau des mesh selectionnés, et les lie entre-eux par une relation parent-enfant.
  var i = m;

  if(i == 1){
    var newObj = new BABYLON.Mesh.MergeMeshes([selectedmeshes[i],selectedmeshes[i-1]],true); // cas de base, on merge l'objet pointé avec celui qui le précède.
    newObj.name = " objet : " + selectedmeshes[i].name +"."+selectedmeshes[i-1].name;

    //On réapplique des propriétés graphiques au nouvel objet créé.
    newObj.material.emissiveColor = new BABYLON.Color3(0,1,0); //la couleur "emissive" (pas influencée par l'éclairage) de l'objet est définie sur verte.
    newObj.actionManager = new BABYLON.ActionManager(scene);
    newObj.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOutTrigger, newObj.material, "emissiveColor", newObj.material.emissiveColor));
    newObj.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOverTrigger, newObj.material, "emissiveColor", BABYLON.Color3.White()));
    newObj.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOutTrigger, newObj, "scaling", new BABYLON.Vector3(newObj.scaling.x, newObj.scaling.y, newObj.scaling.z), 150));
    newObj.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOverTrigger, newObj, "scaling", new BABYLON.Vector3(newObj.scaling.x + newObj.scaling.x*0.1, newObj.scaling.y + newObj.scaling.y*0.1, newObj.scaling.z + newObj.scaling.z*0.1), 150));

    newObj.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPickTrigger, light, "diffuse", BABYLON.Color3.White(), 1))
    .then(new BABYLON.CombineAction(BABYLON.ActionManager.NothingTrigger, [ // Then is used to add a child action used alternatively with the root action.
      new BABYLON.SetValueAction(BABYLON.ActionManager.NothingTrigger, newObj.material, "wireframe", false)
    ]));
    newObj.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPickTrigger, newObj.material, "wireframe", true)).then(new BABYLON.DoNothingAction());
  }
  else { //si on est pas dans le cas de base alors on appelle la fonction
    joinM(i-1);
  }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Creation des objets             ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
initialMesh = new BABYLON.Mesh.CreateBox("initial", 10,scene);
initialMesh.position.x = 100;
othermesh = new BABYLON.Mesh.CreateSphere("other", 25, 10, scene);
var merged = new BABYLON.Mesh.MergeMeshes([initialMesh,othermesh], true);

//initialMesh.parent = othermesh;

function addBox() {

  var box = BABYLON.Mesh.CreateBox('box', 10, scene);
  var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(box, 1024, 1024, false);
  box.name = "box n° " + Math.random();
  box.position = new BABYLON.Vector3( // positionne les objets de façon aléatoire pour éviter la superposition
    Math.random() * 100,
    5,
    Math.random() * 100,
  );
  box.material = new BABYLON.StandardMaterial("mat", scene);
  box.material.emissiveColor = new BABYLON.Color3(1, 1, 0);

  box.actionManager = new BABYLON.ActionManager(scene);
  box.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOutTrigger, box.material, "emissiveColor", box.material.emissiveColor));
  box.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOverTrigger, box.material, "emissiveColor", BABYLON.Color3.White()));
  box.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOutTrigger, box, "scaling", new BABYLON.Vector3(box.scaling.x, box.scaling.y, box.scaling.z), 150));
  box.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOverTrigger, box, "scaling", new BABYLON.Vector3(box.scaling.x + box.scaling.x*0.1, box.scaling.y + box.scaling.y*0.1, box.scaling.z + box.scaling.z*0.1), 150));


  box.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPickTrigger, light, "diffuse", BABYLON.Color3.White(), 1))
  .then(new BABYLON.CombineAction(BABYLON.ActionManager.NothingTrigger, [ // Then is used to add a child action used alternatively with the root action.
    new BABYLON.SetValueAction(BABYLON.ActionManager.NothingTrigger, box.material, "wireframe", false)
  ]));
  box.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPickTrigger, box.material, "wireframe", true)).then(new BABYLON.DoNothingAction());


  var createLabel = function(box) {
    var label = new BABYLON.GUI.Rectangle("label for " + box.name);
    label.background = "black"
    label.height = "30px";
    label.alpha = 0.5;
    label.width = "100px";
    label.cornerRadius = 20;
    label.thickness = 1;
    label.linkOffsetY = 30;
    advancedTexture.addControl(label);
    label.linkWithMesh(box);

    var text1 = new BABYLON.GUI.TextBlock();
    text1.text = box.name;
    text1.color = "white";
    label.addControl(text1);
  }
  createLabel(box);
}



function addXWall() {
  var Xwall = BABYLON.Mesh.CreateBox('Xwall', 10, scene);
  Xwall.name = "Xwall n° " + Math.random();
  Xwall.position = new BABYLON.Vector3( // positionne les objets de façon aléatoire pour éviter la superposition
    Math.random() * 100,
    5,
    Math.random() * 100,
  );
  Xwall.scaling = new BABYLON.Vector3(
    10,
    1,
    1
  )
  Xwall.material = new BABYLON.StandardMaterial("mat", scene);
  Xwall.material.emissiveColor = new BABYLON.Color3(1, 0, 1);

  Xwall.actionManager = new BABYLON.ActionManager(scene);
  Xwall.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOutTrigger, Xwall.material, "emissiveColor", Xwall.material.emissiveColor));
  Xwall.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOverTrigger, Xwall.material, "emissiveColor", BABYLON.Color3.White()));
  Xwall.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOutTrigger, Xwall, "scaling", new BABYLON.Vector3(Xwall.scaling.x, Xwall.scaling.y, Xwall.scaling.z), 150));
  Xwall.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOverTrigger, Xwall, "scaling", new BABYLON.Vector3(Xwall.scaling.x+Xwall.scaling.x*0.1, Xwall.scaling.y+Xwall.scaling.y*0.1, Xwall.scaling.z+Xwall.scaling.z*0.1), 150));


  Xwall.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPickTrigger, light, "diffuse", BABYLON.Color3.White(), 1))
  .then(new BABYLON.CombineAction(BABYLON.ActionManager.NothingTrigger, [ // Then is used to add a child action used alternatively with the root action.
    new BABYLON.SetValueAction(BABYLON.ActionManager.NothingTrigger, Xwall.material, "wireframe", false)
  ]));
  Xwall.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPickTrigger, Xwall.material, "wireframe", true)).then(new BABYLON.DoNothingAction());

}

function addZWall() {
  var Zwall = BABYLON.Mesh.CreateBox('Zwall', 10, scene);
  Zwall.name = "Zwall n° " + Math.random();
  Zwall.position = new BABYLON.Vector3( // positionne les objets de façon aléatoire pour éviter la superposition
    Math.random() * 100,
    5,
    Math.random() * 100,
  );
  Zwall.scaling = new BABYLON.Vector3(
    1,
    1,
    10
  )
  Zwall.material = new BABYLON.StandardMaterial("mat", scene);
  Zwall.material.emissiveColor = new BABYLON.Color3(1, 0, 0);

  Zwall.actionManager = new BABYLON.ActionManager(scene);
  Zwall.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOutTrigger, Zwall.material, "emissiveColor", Zwall.material.emissiveColor));
  Zwall.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOverTrigger, Zwall.material, "emissiveColor", BABYLON.Color3.White()));
  Zwall.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOutTrigger, Zwall, "scaling", new BABYLON.Vector3(Zwall.scaling.x, Zwall.scaling.y, Zwall.scaling.z), 150));
  Zwall.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOverTrigger, Zwall, "scaling", new BABYLON.Vector3(Zwall.scaling.x+Zwall.scaling.x*0.1, Zwall.scaling.y+Zwall.scaling.y*0.1, Zwall.scaling.z+Zwall.scaling.z*0.1), 150));


  Zwall.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPickTrigger, light, "diffuse", BABYLON.Color3.White(), 1))
  .then(new BABYLON.CombineAction(BABYLON.ActionManager.NothingTrigger, [ // Then is used to add a child action used alternatively with the root action.
    new BABYLON.SetValueAction(BABYLON.ActionManager.NothingTrigger, Zwall.material, "wireframe", false)
  ]));
  Zwall.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPickTrigger, Zwall.material, "wireframe", true)).then(new BABYLON.DoNothingAction());

}



function addSphere() {
  var sphere = BABYLON.Mesh.CreateSphere('sphere', 16, 6, scene);
  sphere.position = new BABYLON.Vector3(
    Math.random() * 100 * -1,
    5,
    Math.random() * 100,
  );

  sphere.material = new BABYLON.StandardMaterial("mat", scene);
  sphere.material.emissiveColor = new BABYLON.Color3(0, 0, 1);

  sphere.actionManager = new BABYLON.ActionManager(scene);
  sphere.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOutTrigger, sphere.material, "emissiveColor", sphere.material.emissiveColor));
  sphere.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOverTrigger, sphere.material, "emissiveColor", BABYLON.Color3.White()));
  sphere.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOutTrigger, sphere, "scaling", new BABYLON.Vector3(sphere.scaling.x, sphere.scaling.y, sphere.scaling.z), 150));
  sphere.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOverTrigger, sphere, "scaling", new BABYLON.Vector3(sphere.scaling.x+sphere.scaling.x*0.1, sphere.scaling.y+sphere.scaling.y*0.1, sphere.scaling.z+sphere.scaling.z*0.1), 150));

  sphere.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPickTrigger, light, "diffuse", BABYLON.Color3.White(), 1))
  .then(new BABYLON.CombineAction(BABYLON.ActionManager.NothingTrigger, [ // Then is used to add a child action used alternatively with the root action.
    new BABYLON.SetValueAction(BABYLON.ActionManager.NothingTrigger, sphere.material, "wireframe", false)
  ]));
  sphere.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPickTrigger, sphere.material, "wireframe", true)).then(new BABYLON.DoNothingAction());

}


function addObj() {
  var mesh;
  // The first parameter can be used to specify which mesh to import. Here we import all meshes
  BABYLON.SceneLoader.ImportMesh("", "/usine3d/FromScratch/objets/", "skull.babylon", scene, function(newMeshes) { //import de l'objt 3D .babylon , appel de fonction callBakc OnSuccess
  mesh = newMeshes[0];
  mesh.position = new BABYLON.Vector3(
    Math.random() * 100 * -1,
    30,
    Math.random() * 100 * -1,
  );
  scene.registerBeforeRender(objProperty()); //applique les propritétés de la fonction objProperty avant chaque render de frame
});

function objProperty() {

  var material = new BABYLON.StandardMaterial("material01", scene);
  mesh.material = material;
  mesh.actionManager = new BABYLON.ActionManager(scene);
  mesh.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOutTrigger, mesh.material, "emissiveColor", mesh.material.emissiveColor));
  mesh.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOverTrigger, mesh.material, "emissiveColor", BABYLON.Color3.White()));

  mesh.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOutTrigger, mesh, "scaling", new BABYLON.Vector3(mesh.scaling.x, mesh.scaling.y, mesh.scaling.z), 150));
  mesh.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOverTrigger, mesh, "scaling", new BABYLON.Vector3(mesh.scaling.x+mesh.scaling.x*0.1, mesh.scaling.y+mesh.scaling.y*0.1, mesh.scaling.z+mesh.scaling.z*0.1), 150));

  mesh.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPickTrigger, light, "diffuse", BABYLON.Color3.White(), 1))
  .then(new BABYLON.CombineAction(BABYLON.ActionManager.NothingTrigger, [ // Then is used to add a child action used alternatively with the root action.
    new BABYLON.SetValueAction(BABYLON.ActionManager.NothingTrigger, mesh.material, "wireframe", false)
  ]));
  mesh.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPickTrigger, mesh.material, "wireframe", true)).then(new BABYLON.DoNothingAction());




}
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  Gestion du clic sur le boutton de creation de mesh    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//ADDBOX

if ($('#clickbox').length) {
  $('#clicbox').remove();
}

$(aside).append('<button id="clickbox" class="btn"  > Ajouter un cube </button>');
$('#clickbox').click(function() { //code Jquery,  ajoute un bouton après le canvas, et attribue à ce bouton la fonction addBox.
  addBox();
});

//ADDXWALL    Horizontal Wall

if ($('#clickXWall').length) {
  $('#clickXWall').remove();
}

$(aside).append('<button id="clickXWall" class="btn"  > Ajouter un Mur Horizontal </button>');
$('#clickXWall').click(function() { //code Jquery,  ajoute un bouton après le canvas, et attribue à ce bouton la fonction addBox.
  addXWall();
});

//ADDYWALL    Vertical Wall

if ($('#clickZWall').length) {
  $('#clickZWall').remove();
}

$(aside).append('<button id="clickZWall" class="btn"  > Ajouter un Mur Vertical </button>');
$('#clickZWall').click(function() { //code Jquery,  ajoute un bouton après le canvas, et attribue à ce bouton la fonction addBox.
  addZWall();
});



//ADDSPHERE

if ($('#clicksphere').length) {
  $('#clicksphere').remove();
}

$(aside).append('<button id="clicksphere" class="btn"  > Ajouter une sphère </button>');
$('#clicksphere').click(function() {
  addSphere();
});



//ADDOBJECT

if ($('#clickobj').length) {
  $('#clickobj').remove();
}

$(aside).append('<button id="clickobj" class="btn"  > Ajouter un objet </button>');
$('#clickobj').click(function() {
  addObj();
});






$(aside).append('<button id="deleteM" class="btn"> Delete Mesh</button>');
$('#deleteM').click(function (){
  if(selectedMesh.id != ground.id) {
    deleteMesh();
  }

});




$(aside).append('<button id="joinM" class="btn"> Assembler des Mesh </button>');
$('#joinM').click(function (){
  if(selectedMesh.id != ground.id) {
    joinNow.style.visibility = "visible";
    joining = true;
    joinMeshes();
  }
})



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////      Gestion du sol           /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
var ground = BABYLON.Mesh.CreateGround("ground1", 300, 300, 2, scene);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//         Drag'n'drop                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var startingPoint;
var currentMesh;

var getGroundPosition = function() {
  // Use a predicate to get position on the ground
  var pickinfo = scene.pick(scene.pointerX, scene.pointerY, function(mesh) {
    return mesh == ground;
  });
  if (pickinfo.hit) {
    return pickinfo.pickedPoint;
  }

  return null;
}

var onPointerDown = function(evt) {
  if (evt.button !== 0) {
    return;
  }

  // check if we are under a mesh
  var pickInfo = scene.pick(scene.pointerX, scene.pointerY, function(mesh) {
    return mesh !== ground;
  });
  if (pickInfo.hit) {
    currentMesh = pickInfo.pickedMesh;
    startingPoint = getGroundPosition(evt);

    if (startingPoint) { // we need to disconnect camera from canvas
      setTimeout(function() {
        camera.detachControl(canvas);
      }, 0);
    }
  }
}

var onPointerUp = function() {
  if (startingPoint) {
    camera.attachControl(canvas, true);
    startingPoint = null;
    return;
  }
}

var onPointerMove = function(evt) {
  if (!startingPoint) {
    return;
  }

  var current = getGroundPosition(evt);

  if (!current) {
    return;
  }
  if (currentMesh.parent) currentMesh = currentMesh.parent;
  var diff = current.subtract(startingPoint);
  currentMesh.position.addInPlace(diff);

  startingPoint = current;

}

canvas.addEventListener("pointerdown", onPointerDown, false);
canvas.addEventListener("pointerup", onPointerUp, false);
canvas.addEventListener("pointermove", onPointerMove, false);

scene.onDispose = function() {
  canvas.removeEventListener("pointerdown", onPointerDown);
  canvas.removeEventListener("pointerup", onPointerUp);
  canvas.removeEventListener("pointermove", onPointerMove);
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///   suppression de tous les objets: nettoyage du canvas   ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$(aside).append('<button id="clear" class="btn"  > Clear </button>');
$('#clear').click(function() {
  for (var i = 0; i < scene.meshes.length; i++) {
    if (scene.meshes[i] != ground) {
      scene.meshes[i].dispose(); // If the mesh is not a ground, delete
      i--;
    }

  }
});




// RETOUR DE LA SCENE -  FIN DE LA FONCTION CREATESCENE

return scene;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//   actualisation constante de la scène   ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var scene1 = createScene();
engine.runRenderLoop(function() {
  scene1.render(); // refresh de la scene a chaque frame
});



canvas.addEventListener("mouseover", function(){
  var body = document.getElementById('body');
  body.style.overflow = "hidden";
});

canvas.addEventListener("mouseout", function(){
  var body = document.getElementById ('body');
  body.style.overflow = "visible";
})
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//     redimension des objets en fonction de la fenetre   ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
window.addEventListener('resize', function() {
  engine.resize(); //écouteur d'évènement lié à la fenêtre, lorsqu'on réduit celle-ci le canvas et les objets réduisent aussi pour s'adapter (s'aggrandissent)
});

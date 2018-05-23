/***************************************

  Script principal, majoritairement composé de fonctions BabylonJS.
  Permet la création de la scène 3D et la gestion de tout ce qu'il s'y passe.


  ***********************************************************/

var canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas, true);
var selectedMesh;
var bounce = true;
var masquer = false;
engine.enableOfflineSupport =false;




// Fonction principale du programme, retourne une scène possédant tous les paramètres et les attributs déclarés dans le corps de la fonction
var createScene = function() {

    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);


    // DIFFERENTES COULEURS D'environnement

    //  scene.clearColor = new BABYLON.Color4(0,0,0,0.0000000000000001); //rend l'environnement exterieur transparent ( de base c'est bleu foncé)
    scene.clearColor = new BABYLON.Color3(0.7, 0.7, 1);


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //   Creation et gestion des cameras      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


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


    var light = new BABYLON.PointLight("pointlight", new BABYLON.Vector3(-350,500,250), scene);
    light.specular = new BABYLON.Color3(0,0,0);
    light.intensity = 0,4;

    var light2 = new BABYLON.PointLight("pointlight2", new BABYLON.Vector3(350,500,-250),scene);
    light2.specular = new BABYLON.Color3(0,0,0);
    light2.intensity = 0.4;

    var light3 = new BABYLON.PointLight("pointlight3", new BABYLON.Vector3(350,500,250),scene);
    light3.specular = new BABYLON.Color3(0,0,0);
    light3.intensity = 0.4;

    var light4 = new BABYLON.PointLight("pointlight4", new BABYLON.Vector3(-350,500,-250),scene);
    light4.specular = new BABYLON.Color3(0,0,0);
    light4.intensity = 0.4;

    // var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:10000.0}, scene);
    // var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    // skyboxMaterial.backFaceCulling = false;
    // skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("sky/skybox", scene);
    // skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    // skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    // skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    // skyboxMaterial.disableLighting = true;
    // skybox.material = skyboxMaterial;



    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////    Création des ombres //////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    var shadowGenerator = new BABYLON.ShadowGenerator(512, light);
    shadowGenerator.usePoissonSampling = true;
    shadowGenerator.useBlurExponentialShadowMap = true;
    shadowGenerator.useContactHardeningShadow = true;
    shadowGenerator.filteringQuality = BABYLON.ShadowGenerator.QUALITY_LOW;

    var shadowGenerator2 = new BABYLON.ShadowGenerator(512, light2);
    shadowGenerator.usePoissonSampling = true;
    shadowGenerator.useBlurExponentialShadowMap = true;
    shadowGenerator.useContactHardeningShadow = true;
    shadowGenerator.filteringQuality = BABYLON.ShadowGenerator.QUALITY_LOW;

    var shadowGenerator3 = new BABYLON.ShadowGenerator(512, light3);
    shadowGenerator.usePoissonSampling = true;
    shadowGenerator.useBlurExponentialShadowMap = true;
    shadowGenerator.useContactHardeningShadow = true;
    shadowGenerator.filteringQuality = BABYLON.ShadowGenerator.QUALITY_LOW;

    var shadowGenerator4 = new BABYLON.ShadowGenerator(512, light4);
    shadowGenerator.usePoissonSampling = true;
    shadowGenerator.useBlurExponentialShadowMap = true;
    shadowGenerator.useContactHardeningShadow = true;
    shadowGenerator.filteringQuality = BABYLON.ShadowGenerator.QUALITY_LOW;


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////  Gestion de l'objet selectionné     ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var scaleX,scaleY,scaleZ;
    window.addEventListener("click", function() {
        var pickResult = scene.pick(scene.pointerX, scene.pointerY);
        if (pickResult.hit && pickResult.pickedMesh.name != ground.name) {
            selectedMesh = pickResult.pickedMesh; //SelectedMesh prend la valeur de l'objet sur lequel on a cliqué (l'objet sélectionné)
            scaleX = selectedMesh.scaling.x;
            scaleZ = selectedMesh.scaling.z;
            scaleY = selectedMesh.scaling.y;
            $("#scalingX").val(scaleX);
            $("#scalingY").val(scaleY);
            $("#scalingZ").val(scaleZ);
        }
    });


// Fonction qui fait "rebondir" l'objet sélectionné via une animation BabylonJS
    function setBounce(a) {
        const mesh = a;
        scene.stopAnimation(mesh);
        mesh.animations = [];
        if (bounce) {
            const animation = new BABYLON.Animation('bouncing', 'position.y', 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
            const initialPosition = mesh.position.y;
            const keys = [{
                    frame: 0,
                    value: initialPosition,
                },
                {
                    frame: 10,
                    value: initialPosition + 5,
                },
                {
                    frame: 30,
                    value: initialPosition,
                },
            ];
            animation.setKeys(keys);
            mesh.animations.push(animation);
            scene.beginAnimation(mesh, 0, 30, true);
        } else {
            scene.stopAnimation(mesh);
        }
    }



    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //    Creation des objets             ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



// POSITIONNEMENT DES 4 MURS D'ENCEINTE

mur1 = new BABYLON.Mesh.CreateBox('mur1',10, scene);
mur1.position = new BABYLON.Vector3(
  150,
  5,
  0
)
mur1.scaling.z = 30;
mur1.scaling.x = 0.3;
mur1.material = new BABYLON.StandardMaterial('matmur1', scene);
mur1.material.emissiveColor = new BABYLON.Color3(115/255,115/255,115/255);
// shadowGenerator.getShadowMap().renderList.push(mur1);
// shadowGenerator2.getShadowMap().renderList.push(mur1);
// shadowGenerator3.getShadowMap().renderList.push(mur1);
// shadowGenerator4.getShadowMap().renderList.push(mur1);

mur2 = new BABYLON.Mesh.CreateBox('mur2',10, scene);
mur2.position = new BABYLON.Vector3(
  0,
  5,
  150
);
mur2.scaling.x = 30;
mur2.scaling.z = 0.3;
mur2.material = new BABYLON.StandardMaterial('matmur2', scene);
mur2.material.emissiveColor = new BABYLON.Color3(115/255,115/255,115/255);
// shadowGenerator.getShadowMap().renderList.push(mur2);
// shadowGenerator2.getShadowMap().renderList.push(mur2);
// shadowGenerator3.getShadowMap().renderList.push(mur2);
// shadowGenerator4.getShadowMap().renderList.push(mur2);

mur3 = new BABYLON.Mesh.CreateBox('mur3',10,scene);
mur3.position = new BABYLON.Vector3(
  -150,
  5,
  0
);
mur3.scaling.z = 30;
mur3.scaling.x = 0.3;
mur3.material = new BABYLON.StandardMaterial('matmur3',scene);
mur3.material.emissiveColor = new BABYLON.Color3(115/255,115/255,115/255);
// shadowGenerator.getShadowMap().renderList.push(mur3);
// shadowGenerator2.getShadowMap().renderList.push(mur3);
// shadowGenerator3.getShadowMap().renderList.push(mur3);
// shadowGenerator4.getShadowMap().renderList.push(mur3);

mur4 = new BABYLON.Mesh.CreateBox('mur4',10, scene);
mur4.position = new BABYLON.Vector3(
  0,
  5,
  -150
);
mur4.scaling.x = 30;
mur4.scaling.z = 0.3;
mur4.material = new BABYLON.StandardMaterial('matmur4',scene);
mur4.material.emissiveColor = new BABYLON.Color3(115/255,115/255,115/255);
// shadowGenerator.getShadowMap().renderList.push(mur4);
// shadowGenerator2.getShadowMap().renderList.push(mur4);
// shadowGenerator3.getShadowMap().renderList.push(mur4);
// shadowGenerator4.getShadowMap().renderList.push(mur4);


// MURS INT2RIEURS

var mur5 = new BABYLON.Mesh.CreateBox('mur5',10,scene);
mur5.position = new BABYLON.Vector3(
  -50,
  5,
  -101
);
mur5.scaling.z = 9.5;
mur5.scaling.x =  0.3;
mur5.material = new BABYLON.StandardMaterial('matmur5',scene);
mur5.material.emissiveColor = new BABYLON.Color3(115/255,115/255,115/255);
// shadowGenerator.getShadowMap().renderList.push(mur5);
// shadowGenerator2.getShadowMap().renderList.push(mur5);
// shadowGenerator3.getShadowMap().renderList.push(mur5);
// shadowGenerator4.getShadowMap().renderList.push(mur5);

var mur6 = new BABYLON.Mesh.CreateBox('mur6',10,scene);
mur6.position = new BABYLON.Vector3(
  -101,
  5,
  -55
);
mur6.scaling.x = 10;
mur6.scaling.z = 0.3;
mur6.material = new BABYLON.StandardMaterial('matmur6', scene);
mur6.material.emissiveColor = new BABYLON.Color3(115/255,115/255,115/255);
// shadowGenerator.getShadowMap().renderList.push(mur6);
// shadowGenerator2.getShadowMap().renderList.push(mur6);
// shadowGenerator3.getShadowMap().renderList.push(mur6);
// shadowGenerator4.getShadowMap().renderList.push(mur6);


var mur7 = new BABYLON.Mesh.CreateBox('mur7',10, scene);
mur7.position = new BABYLON.Vector3(
  4.5,
  5,
  103
);
mur7.scaling.z = 9.6;
mur7.scaling.x = 0.3;
mur7.material = new BABYLON.StandardMaterial('matmur7',scene);
mur7.material.emissiveColor = new BABYLON.Color3(115/255,115/255,115/255);
// shadowGenerator.getShadowMap().renderList.push(mur7);
// shadowGenerator2.getShadowMap().renderList.push(mur7);
// shadowGenerator3.getShadowMap().renderList.push(mur7);
// shadowGenerator4.getShadowMap().renderList.push(mur7);

var mur8 = new BABYLON.Mesh.CreateBox('mur8',10,scene);
mur8.position = new BABYLON.Vector3(
  -72,
  5,
  54
);
mur8.scaling.x = 15.6;
mur8.scaling.z = 0.3; //largeur
mur8.material = new BABYLON.StandardMaterial('matmur8', scene);
mur8.material.emissiveColor = new BABYLON.Color3(115/255,115/255,115/255);
// shadowGenerator.getShadowMap().renderList.push(mur8);
// shadowGenerator2.getShadowMap().renderList.push(mur8);
// shadowGenerator3.getShadowMap().renderList.push(mur8);
// shadowGenerator4.getShadowMap().renderList.push(mur8);


var mur9 = new BABYLON.Mesh.CreateBox('mur9',10,scene);
mur9.position = new BABYLON.Vector3(
  53,
  5,
  105
);
mur9.scaling.x = 9.5;
mur9.scaling.z = 0.3; //largeur
mur9.material = new BABYLON.StandardMaterial('matmur9',scene);
mur9.material.emissiveColor = new BABYLON.Color3(115/255,115/255,115/255);
// shadowGenerator.getShadowMap().renderList.push(mur9);
// shadowGenerator2.getShadowMap().renderList.push(mur9);
// shadowGenerator3.getShadowMap().renderList.push(mur9);
// shadowGenerator4.getShadowMap().renderList.push(mur9);


var mur10 = new BABYLON.Mesh.CreateBox('mur10',10,scene);
mur10.position = new BABYLON.Vector3(
  100,
  5,
  -21
);
mur10.scaling.z = 25.5;
mur10.scaling.x = 0.3; //largeur
mur10.material = new BABYLON.StandardMaterial('matmur10',scene);
mur10.material.emissiveColor = new BABYLON.Color3(115/255,115/255,115/255);
// shadowGenerator.getShadowMap().renderList.push(mur10);
// shadowGenerator2.getShadowMap().renderList.push(mur10);
// shadowGenerator3.getShadowMap().renderList.push(mur10);
// shadowGenerator4.getShadowMap().renderList.push(mur10);




//POSITIONNEMENT DES MACHINES
var cubeligneprod1;
var cubeligneprod2;
var cubeligneprod3;
var cubeligneprod4;
var cubeligneprod5;
var cubeligneprod6;
var cubeligneprod7;
var cubeligneprod8;

  //Les import des lignes de prod sont imbriquées, chaque ligne de prod est appelée dans la fonction callbakc de la précédente :
  // permet de garantir l'ordre de chargement des objets et donc de régulariser l'apparition des flux

    var ligneprod1 = BABYLON.SceneLoader.ImportMesh("", "/usine3d/FromScratch/objlouis/", "ligneprod.obj", scene, function(newMeshes) { //import de l'objt 3D .babylon , appel de fonction callBack OnSuccess
          var mesh = newMeshes[0];
          var mate = new BABYLON.StandardMaterial("mat",scene);
          mesh.material = mate;
          mate.diffuseColor = new BABYLON.Color3(0.7,1,1);
          mesh.position.x = 70;
          mesh.position.y = 0;
          mesh.position.z = -75;
          mesh.scaling.x = 4;
          mesh.scaling.y = 4;
          mesh.scaling.z = 4;
          mesh.type = "Ligne de Production";
          mesh.name = "mesh n° : " + Math.random();
          mesh.info = "je suis une ligne de production";
          mesh.informations = "<div style='overflow-x:auto;' id='infotemp'><p id='titleinfo'>"+mesh.type+"</p><p id='texteinfo'> <span> Nom </span>"+mesh.name+"<br> <span> Id </span>"+mesh.id+"<br> <span> Infos générales </span>"+mesh.info+"</p></div>";
          cubeligneprod1 = new BABYLON.Mesh.CreateBox("cubeligneprod1",5,scene);
          cubeligneprod1.position =new BABYLON.Vector3(mesh.position.x+3,8,mesh.position.z -30);
          cubeligneprod1.isVisible = false;
          // shadowGenerator.getShadowMap().renderList.push(mesh);
          // shadowGenerator2.getShadowMap().renderList.push(mesh);
          // shadowGenerator3.getShadowMap().renderList.push(mesh);
          // shadowGenerator4.getShadowMap().renderList.push(mesh);

          var ligneprod2 = BABYLON.SceneLoader.ImportMesh("", "/usine3d/FromScratch/objets/scenes/obj/", "ligneProd.obj", scene, function(newMeshes) { //import de l'objt 3D .babylon , appel de fonction callBack OnSuccess
                var mesh = newMeshes[0];
                var mate = new BABYLON.StandardMaterial("mat",scene);
                mesh.material = mate;
                mate.diffuseColor = new BABYLON.Color3(0.7,1,1);
                mesh.position.x = 77.5;
                mesh.position.y = 0;
                mesh.position.z = 5;
                mesh.scaling.x = 4;
                mesh.scaling.y = 4;
                mesh.scaling.z = 4;
                mesh.rotate(BABYLON.Axis.Y, Math.PI, BABYLON.Space.WORLD);
                mesh.type = "Ligne de Production";
                mesh.name = "mesh n° : " + Math.random();
                mesh.info = "je suis une ligne de production";
                mesh.informations = "<div style='overflow-x:auto;' id='infotemp'><p id='titleinfo'>"+mesh.type+"</p><p id='texteinfo'> <span> Nom </span>"+mesh.name+"<br> <span> Id </span>"+mesh.id+"<br> <span> Infos générales </span>"+mesh.info+"</p></div>";
                cubeligneprod2 = new BABYLON.Mesh.CreateBox("cubeligneprod2",5,scene);
                cubeligneprod2.position = new BABYLON.Vector3(mesh.position.x-3.5,9,mesh.position.z +28);
                cubeligneprod2.isVisible = false;





                // shadowGenerator.getShadowMap().renderList.push(mesh);
                // shadowGenerator2.getShadowMap().renderList.push(mesh);
                // shadowGenerator3.getShadowMap().renderList.push(mesh);
                // shadowGenerator4.getShadowMap().renderList.push(mesh);

                  createFlux(new BABYLON.Vector3(cubeligneprod1.position.x,cubeligneprod1.position.y, cubeligneprod1.position.z), new BABYLON.Vector3(cubeligneprod2.position.x,cubeligneprod2.position.y, cubeligneprod2.position.z));

                      var ligneprod3 = BABYLON.SceneLoader.ImportMesh("", "/usine3d/FromScratch/objets/scenes/obj/", "ligneProd.obj", scene, function(newMeshes) { //import de l'objt 3D .babylon , appel de fonction callBack OnSuccess
                          var mesh = newMeshes[0];
                          var mate = new BABYLON.StandardMaterial("mat",scene);
                          mesh.material = mate;
                          mate.diffuseColor = new BABYLON.Color3(0.7,1,1);
                          mesh.position.x = 55;
                          mesh.position.y = 0;
                          mesh.position.z = -75;
                          mesh.scaling.x = 4;
                          mesh.scaling.y = 4;
                          mesh.scaling.z = 4;
                          mesh.type = "Ligne de Production";
                          mesh.name = "mesh n° : " + Math.random();
                          mesh.info = "je suis une ligne de production";
                          mesh.informations = "<div style='overflow-x:auto;' id='infotemp'><p id='titleinfo'>"+mesh.type+"</p><p id='texteinfo'> <span> Nom </span>"+mesh.name+"<br> <span> Id </span>"+mesh.id+"<br> <span> Infos générales </span>"+mesh.info+"</p></div>";
                          cubeligneprod3 = new BABYLON.Mesh.CreateBox("cubeligneprod3",5,scene);
                          cubeligneprod3.position =new BABYLON.Vector3(mesh.position.x+3,8,mesh.position.z -30);
                          cubeligneprod3.isVisible = false;
                          shadowGenerator.getShadowMap().renderList.push(mesh);
                          shadowGenerator2.getShadowMap().renderList.push(mesh);
                          shadowGenerator3.getShadowMap().renderList.push(mesh);
                          shadowGenerator4.getShadowMap().renderList.push(mesh);


                            var ligneprod4 = BABYLON.SceneLoader.ImportMesh("", "/usine3d/FromScratch/objets/scenes/obj/", "ligneProd.obj", scene, function(newMeshes) { //import de l'objt 3D .babylon , appel de fonction callBack OnSuccess
                                  var mesh = newMeshes[0];
                                  var mate = new BABYLON.StandardMaterial("mat",scene);
                                  mesh.material = mate;
                                  mate.diffuseColor = new BABYLON.Color3(0.7,1,1);
                                  mesh.position.x = 62.5;
                                  mesh.position.y = 0;
                                  mesh.position.z = 5;
                                  mesh.scaling.x = 4;
                                  mesh.scaling.y = 4;
                                  mesh.scaling.z = 4;
                                  mesh.rotate(BABYLON.Axis.Y, Math.PI, BABYLON.Space.WORLD);
                                  mesh.type = "Ligne de Production";
                                  mesh.name = "mesh n° : " + Math.random();
                                  mesh.info = "je suis une ligne de production";
                                  mesh.informations = "<div style='overflow-x:auto;' id='infotemp'><p id='titleinfo'>"+mesh.type+"</p><p id='texteinfo'> <span> Nom </span>"+mesh.name+"<br> <span> Id </span>"+mesh.id+"<br> <span> Infos générales </span>"+mesh.info+"</p></div>";
                                  cubeligneprod4 = new BABYLON.Mesh.CreateBox("cubeligneprod4",5,scene);
                                  cubeligneprod4.position = new BABYLON.Vector3(mesh.position.x-3.5,9,mesh.position.z +28);
                                  cubeligneprod4.isVisible = false;

                                  // shadowGenerator.getShadowMap().renderList.push(mesh);
                                  // shadowGenerator2.getShadowMap().renderList.push(mesh);
                                  // shadowGenerator3.getShadowMap().renderList.push(mesh);
                                  // shadowGenerator4.getShadowMap().renderList.push(mesh);
                                  createFlux(new BABYLON.Vector3(cubeligneprod3.position.x,cubeligneprod3.position.y, cubeligneprod3.position.z), new BABYLON.Vector3(cubeligneprod4.position.x,cubeligneprod4.position.y, cubeligneprod4.position.z));


                                    var ligneprod5 = BABYLON.SceneLoader.ImportMesh("", "/usine3d/FromScratch/objets/scenes/obj/", "ligneProd.obj", scene, function(newMeshes) { //import de l'objt 3D .babylon , appel de fonction callBack OnSuccess
                                          var mesh = newMeshes[0];
                                          var mate = new BABYLON.StandardMaterial("mat",scene);
                                          mesh.material = mate;
                                          mate.diffuseColor = new BABYLON.Color3(0.7,1,1);
                                          mesh.position.x = 40;
                                          mesh.position.y = 0;
                                          mesh.position.z = -75;
                                          mesh.scaling.x = 4;
                                          mesh.scaling.y = 4;
                                          mesh.scaling.z = 4;
                                          mesh.type = "Ligne de Production";
                                          mesh.name = "mesh n° : " + Math.random();
                                          mesh.info = "je suis une ligne de production";
                                          mesh.informations = "<div style='overflow-x:auto;' id='infotemp'><p id='titleinfo'>"+mesh.type+"</p><p id='texteinfo'> <span> Nom </span>"+mesh.name+"<br> <span> Id </span>"+mesh.id+"<br> <span> Infos générales </span>"+mesh.info+"</p></div>";
                                          cubeligneprod5 = new BABYLON.Mesh.CreateBox("cubeligneprod5",5,scene);
                                          cubeligneprod5.position =new BABYLON.Vector3(mesh.position.x+3,8,mesh.position.z -30);
                                          cubeligneprod5.isVisible = false;

                                          // shadowGenerator.getShadowMap().renderList.push(mesh);
                                          // shadowGenerator2.getShadowMap().renderList.push(mesh);
                                          // shadowGenerator3.getShadowMap().renderList.push(mesh);
                                          // shadowGenerator4.getShadowMap().renderList.push(mesh);

                                              var ligneprod6 = BABYLON.SceneLoader.ImportMesh("", "/usine3d/FromScratch/objets/scenes/obj/", "ligneProd.obj", scene, function(newMeshes) { //import de l'objt 3D .babylon , appel de fonction callBack OnSuccess
                                                    var mesh = newMeshes[0];
                                                    var mate = new BABYLON.StandardMaterial("mat",scene);
                                                    mesh.material = mate;
                                                    mate.diffuseColor = new BABYLON.Color3(0.7,1,1);
                                                    mesh.position.x = 47.5;
                                                    mesh.position.y = 0;
                                                    mesh.position.z = 5;
                                                    mesh.scaling.x = 4;
                                                    mesh.scaling.y = 4;
                                                    mesh.scaling.z = 4;
                                                    mesh.rotate(BABYLON.Axis.Y, Math.PI, BABYLON.Space.WORLD);
                                                    mesh.type = "Ligne de Production";
                                                    mesh.name = "mesh n° : " + Math.random();
                                                    mesh.info = "je suis une ligne de production";
                                                    mesh.informations = "<div style='overflow-x:auto;' id='infotemp'><p id='titleinfo'>"+mesh.type+"</p><p id='texteinfo'> <span> Nom </span>"+mesh.name+"<br> <span> Id </span>"+mesh.id+"<br> <span> Infos générales </span>"+mesh.info+"</p></div>";
                                                    cubeligneprod6 = new BABYLON.Mesh.CreateBox("cubeligneprod6",5,scene);
                                                    cubeligneprod6.position = new BABYLON.Vector3(mesh.position.x-3.5,9,mesh.position.z +28);
                                                    cubeligneprod6.isVisible = false;
                                                    // shadowGenerator.getShadowMap().renderList.push(mesh);
                                                    // shadowGenerator2.getShadowMap().renderList.push(mesh);
                                                    // shadowGenerator3.getShadowMap().renderList.push(mesh);
                                                    // shadowGenerator4.getShadowMap().renderList.push(mesh);
                                                    createFlux(new BABYLON.Vector3(cubeligneprod6.position.x,cubeligneprod6.position.y, cubeligneprod6.position.z), new BABYLON.Vector3(cubeligneprod5.position.x,cubeligneprod5.position.y, cubeligneprod5.position.z));

                                                    var ligneprod7 = BABYLON.SceneLoader.ImportMesh("", "/usine3d/FromScratch/objets/scenes/obj/", "ligneProd.obj", scene, function(newMeshes) { //import de l'objt 3D .babylon , appel de fonction callBack OnSuccess
                                                          var mesh = newMeshes[0];
                                                          var mate = new BABYLON.StandardMaterial("mat",scene);
                                                          mesh.material = mate;
                                                          mate.diffuseColor = new BABYLON.Color3(0.7,1,1);
                                                          mesh.position.x = 25;
                                                          mesh.position.y = 0;
                                                          mesh.position.z = -75;
                                                          mesh.scaling.x = 4;
                                                          mesh.scaling.y = 4;
                                                          mesh.scaling.z = 4;
                                                          cubeligneprod7 = new BABYLON.Mesh.CreateBox("cubeligneprod7",5,scene);
                                                          cubeligneprod7.position =new BABYLON.Vector3(mesh.position.x+3,8,mesh.position.z -30);
                                                          cubeligneprod7.isVisible = false;
                                                          mesh.type = "Ligne de Production";
                                                          mesh.name = "mesh n° : " + Math.random();
                                                          mesh.info = "je suis une ligne de production";
                                                          mesh.informations = "<div style='overflow-x:auto;' id='infotemp'><p id='titleinfo'>"+mesh.type+"</p><p id='texteinfo'> <span> Nom </span>"+mesh.name+"<br> <span> Id </span>"+mesh.id+"<br> <span> Infos générales </span>"+mesh.info+"</p></div>";

                                                          // shadowGenerator.getShadowMap().renderList.push(mesh);
                                                          // shadowGenerator2.getShadowMap().renderList.push(mesh);
                                                          // shadowGenerator3.getShadowMap().renderList.push(mesh);
                                                          // shadowGenerator4.getShadowMap().renderList.push(mesh);


                                                          var ligneprod8 = BABYLON.SceneLoader.ImportMesh("", "/usine3d/FromScratch/objets/scenes/obj/", "ligneProd.obj", scene, function(newMeshes) { //import de l'objt 3D .babylon , appel de fonction callBack OnSuccess
                                                                var mesh = newMeshes[0];
                                                                var mate = new BABYLON.StandardMaterial("mat",scene);
                                                                mesh.material = mate;
                                                                mate.diffuseColor = new BABYLON.Color3(0.7,1,1);
                                                                mesh.position.x = 32.5;
                                                                mesh.position.y = 0;
                                                                mesh.position.z = 5;
                                                                mesh.scaling.x = 4;
                                                                mesh.scaling.y = 4;
                                                                mesh.scaling.z = 4;
                                                                mesh.rotate(BABYLON.Axis.Y, Math.PI, BABYLON.Space.WORLD);
                                                                mesh.type = "Ligne de Production";
                                                                mesh.name = "mesh n° : " + Math.random();
                                                                mesh.info = "je suis une ligne de production";
                                                                mesh.informations = "<div style='overflow-x:auto;' id='infotemp'><p id='titleinfo'>"+mesh.type+"</p><p id='texteinfo'> <span> Nom </span>"+mesh.name+"<br> <span> Id </span>"+mesh.id+"<br> <span> Infos générales </span>"+mesh.info+"</p></div>";

                                                                cubeligneprod8 = new BABYLON.Mesh.CreateBox("cubeligneprod8",5,scene);
                                                                cubeligneprod8.position = new BABYLON.Vector3(mesh.position.x-3.5,9,mesh.position.z +28);
                                                                cubeligneprod8.isVisible = false;
                                                                // shadowGenerator.getShadowMap().renderList.push(mesh);
                                                                // shadowGenerator2.getShadowMap().renderList.push(mesh);
                                                                // shadowGenerator3.getShadowMap().renderList.push(mesh);
                                                                // shadowGenerator4.getShadowMap().renderList.push(mesh);

                                                                createFlux(new BABYLON.Vector3(cubeligneprod8.position.x, cubeligneprod8.position.y, cubeligneprod8.position.z), new BABYLON.Vector3(cubeligneprod7.position.x, cubeligneprod7.position.y, cubeligneprod7.position.z));


                                                            });
                                                        });

                                              });
                                  });
                            });
                      });

              });
        });




var stockage1 = BABYLON.SceneLoader.ImportMesh("", "/usine3d/FromScratch/objets/scenes/obj/", "stockage.obj", scene, function(newMeshes) { //import de l'objt 3D .babylon , appel de fonction callBack OnSuccess
      var mesh = newMeshes[0];
      mesh.material = new BABYLON.StandardMaterial("mat",scene);
      mesh.material.diffuseColor = new BABYLON.Color3(1,1,0.7);
      mesh.position.x = -120;
      mesh.position.y = 0;
      mesh.position.z = -75;
      mesh.scaling.x = 5;
      mesh.scaling.y = 5;
      mesh.scaling.z = 5;
      mesh.type = "Stockage";
      mesh.name = "mesh n° : " + Math.random();
      mesh.info = "je suis une étagère de stockage de la zone de stock";
      mesh.informations = "<div style='overflow-x:auto;' id='infotemp'><p id='titleinfo'>"+mesh.type+"</p><p id='texteinfo'> <span> Nom </span>"+mesh.name+"<br> <span> Id </span>"+mesh.id+"<br> <span> Infos générales </span>"+mesh.info+"</p></div>";
      //
      // shadowGenerator.getShadowMap().renderList.push(mesh);
      // shadowGenerator2.getShadowMap().renderList.push(mesh);
      // shadowGenerator3.getShadowMap().renderList.push(mesh);
      // shadowGenerator4.getShadowMap().renderList.push(mesh);

    });
    var stockage2 = BABYLON.SceneLoader.ImportMesh("", "/usine3d/FromScratch/objets/scenes/obj/", "stockage.obj", scene, function(newMeshes) { //import de l'objt 3D .babylon , appel de fonction callBack OnSuccess
          var mesh = newMeshes[0];
          mesh.material = new BABYLON.StandardMaterial("mat",scene);
          mesh.material.diffuseColor = new BABYLON.Color3(1,1,0.7);
          mesh.position.x = -75;
          mesh.position.y = 0
          mesh.position.z = -75;
          mesh.scaling.x = 5;
          mesh.scaling.y = 5;
          mesh.scaling.z = 5;
          mesh.type = "Stockage";
          mesh.name = "mesh n° : " + Math.random();
          mesh.info = "je suis une étagère de stockage de la zone de stock";
          mesh.informations = "<div style='overflow-x:auto;' id='infotemp'><p id='titleinfo'>"+mesh.type+"</p><p id='texteinfo'> <span> Nom </span>"+mesh.name+"<br> <span> Id </span>"+mesh.id+"<br> <span> Infos générales </span>"+mesh.info+"</p></div>";

          // shadowGenerator.getShadowMap().renderList.push(mesh);
          // shadowGenerator2.getShadowMap().renderList.push(mesh);
          // shadowGenerator3.getShadowMap().renderList.push(mesh);
          // shadowGenerator4.getShadowMap().renderList.push(mesh);

        });

        var stockage3 = BABYLON.SceneLoader.ImportMesh("", "/usine3d/FromScratch/objets/scenes/obj/", "stockage.obj", scene, function(newMeshes) { //import de l'objt 3D .babylon , appel de fonction callBack OnSuccess
              var mesh = newMeshes[0];
              mesh.material = new BABYLON.StandardMaterial("mat",scene);
              mesh.material.diffuseColor = new BABYLON.Color3(1,1,0.7);
              mesh.position.x = -120;
              mesh.position.y = 0
              mesh.position.z = -95;
              mesh.scaling.x = 5;
              mesh.scaling.y = 5;
              mesh.scaling.z = 5;
              mesh.type = "Stockage";
              mesh.name = "mesh n° : " + Math.random();
              mesh.info = "je suis une étagère de stockage de la zone de stock";
              mesh.informations = "<div style='overflow-x:auto;' id='infotemp'><p id='titleinfo'>"+mesh.type+"</p><p id='texteinfo'> <span> Nom </span>"+mesh.name+"<br> <span> Id </span>"+mesh.id+"<br> <span> Infos générales </span>"+mesh.info+"</p></div>";

              // shadowGenerator.getShadowMap().renderList.push(mesh);
              // shadowGenerator2.getShadowMap().renderList.push(mesh);
              // shadowGenerator3.getShadowMap().renderList.push(mesh);
              // shadowGenerator4.getShadowMap().renderList.push(mesh);

            });
            var stockage4 = BABYLON.SceneLoader.ImportMesh("", "/usine3d/FromScratch/objets/scenes/obj/", "stockage.obj", scene, function(newMeshes) { //import de l'objt 3D .babylon , appel de fonction callBack OnSuccess
                  var mesh = newMeshes[0];
                  mesh.material = new BABYLON.StandardMaterial("mat",scene);
                  mesh.material.diffuseColor = new BABYLON.Color3(1,1,0.7);
                  mesh.position.x = -75;
                  mesh.position.y = 0
                  mesh.position.z = -95;
                  mesh.scaling.x = 5;
                  mesh.scaling.y = 5;
                  mesh.scaling.z = 5;
                  mesh.type = "Stockage";
                  mesh.name = "mesh n° : " + Math.random();
                  mesh.info = "je suis une étagère de stockage de la zone de stock";
                  mesh.informations = "<div style='overflow-x:auto;' id='infotemp'><p id='titleinfo'>"+mesh.type+"</p><p id='texteinfo'> <span> Nom </span>"+mesh.name+"<br> <span> Id </span>"+mesh.id+"<br> <span> Infos générales </span>"+mesh.info+"</p></div>";

                  // shadowGenerator.getShadowMap().renderList.push(mesh);
                  // shadowGenerator2.getShadowMap().renderList.push(mesh);
                  // shadowGenerator3.getShadowMap().renderList.push(mesh);
                  // shadowGenerator4.getShadowMap().renderList.push(mesh);

                });

      var stockage5 = BABYLON.SceneLoader.ImportMesh("", "/usine3d/FromScratch/objets/scenes/obj/", "stockage.obj", scene, function(newMeshes) { //import de l'objt 3D .babylon , appel de fonction callBack OnSuccess
            var mesh = newMeshes[0];
            mesh.material = new BABYLON.StandardMaterial("mat",scene);
            mesh.material.diffuseColor = new BABYLON.Color3(1,1,0.7);
            mesh.position.x = -120;
            mesh.position.y = 0
            mesh.position.z = -115;
            mesh.scaling.x = 5;
            mesh.scaling.y = 5;
            mesh.scaling.z = 5;
            mesh.type = "Stockage";
            mesh.name = "mesh n° : " + Math.random();
            mesh.info = "je suis une étagère de stockage de la zone de stock";
            mesh.informations = "<div style='overflow-x:auto;' id='infotemp'><p id='titleinfo'>"+mesh.type+"</p><p id='texteinfo'> <span> Nom </span>"+mesh.name+"<br> <span> Id </span>"+mesh.id+"<br> <span> Infos générales </span>"+mesh.info+"</p></div>";
            //
            // shadowGenerator.getShadowMap().renderList.push(mesh);
            // shadowGenerator2.getShadowMap().renderList.push(mesh);
            // shadowGenerator3.getShadowMap().renderList.push(mesh);
            // shadowGenerator4.getShadowMap().renderList.push(mesh);

          });
          var stockage6 = BABYLON.SceneLoader.ImportMesh("", "/usine3d/FromScratch/objets/scenes/obj/", "stockage.obj", scene, function(newMeshes) { //import de l'objt 3D .babylon , appel de fonction callBack OnSuccess
                var mesh = newMeshes[0];
                mesh.material = new BABYLON.StandardMaterial("mat",scene);
                mesh.material.diffuseColor = new BABYLON.Color3(1,1,0.7);
                mesh.position.x = -75;
                mesh.position.y = 0
                mesh.position.z = -115;
                mesh.scaling.x = 5;
                mesh.scaling.y = 5;
                mesh.scaling.z = 5;
                mesh.type = "Stockage";
                mesh.name = "mesh n° : " + Math.random();
                mesh.info = "je suis une étagère de stockage de la zone de stock";
                mesh.informations = "<div style='overflow-x:auto;' id='infotemp'><p id='titleinfo'>"+mesh.type+"</p><p id='texteinfo'> <span> Nom </span>"+mesh.name+"<br> <span> Id </span>"+mesh.id+"<br> <span> Infos générales </span>"+mesh.info+"</p></div>";
                // shadowGenerator.getShadowMap().renderList.push(mesh);
                // shadowGenerator2.getShadowMap().renderList.push(mesh);
                // shadowGenerator3.getShadowMap().renderList.push(mesh);
                // shadowGenerator4.getShadowMap().renderList.push(mesh);

              });

      var stockage7 = BABYLON.SceneLoader.ImportMesh("", "/usine3d/FromScratch/objets/scenes/obj/", "stockage.obj", scene, function(newMeshes) { //import de l'objt 3D .babylon , appel de fonction callBack OnSuccess
            var mesh = newMeshes[0];
            mesh.material = new BABYLON.StandardMaterial("mat",scene);
            mesh.material.diffuseColor = new BABYLON.Color3(1,1,0.7);
            mesh.position.x = -120;
            mesh.position.y = 0
            mesh.position.z = -135;
            mesh.scaling.x = 5;
            mesh.scaling.y = 5;
            mesh.scaling.z = 5;
            mesh.type = "Stockage";
            mesh.name = "mesh n° : " + Math.random();
            mesh.info = "je suis une étagère de stockage de la zone de stock";
            mesh.informations = "<div style='overflow-x:auto;' id='infotemp'><p id='titleinfo'>"+mesh.type+"</p><p id='texteinfo'> <span> Nom </span>"+mesh.name+"<br> <span> Id </span>"+mesh.id+"<br> <span> Infos générales </span>"+mesh.info+"</p></div>";

            // shadowGenerator.getShadowMap().renderList.push(mesh);
            // shadowGenerator2.getShadowMap().renderList.push(mesh);
            // shadowGenerator3.getShadowMap().renderList.push(mesh);
            // shadowGenerator4.getShadowMap().renderList.push(mesh);

          });

      var stockage8 = BABYLON.SceneLoader.ImportMesh("", "/usine3d/FromScratch/objets/scenes/obj/", "stockage.obj", scene, function(newMeshes) { //import de l'objt 3D .babylon , appel de fonction callBack OnSuccess
            var mesh = newMeshes[0];
            mesh.material = new BABYLON.StandardMaterial("mat",scene);
            mesh.material.diffuseColor = new BABYLON.Color3(1,1,0.7);
            mesh.position.x = -75;
            mesh.position.y = 0
            mesh.position.z = -135;
            mesh.scaling.x = 5;
            mesh.scaling.y = 5;
            mesh.scaling.z = 5;
            mesh.type = "Stockage";
            mesh.name = "mesh n° : " + Math.random();
            mesh.info = "je suis une étagère de stockage de la zone de stock";
            mesh.informations = "<div style='overflow-x:auto;' id='infotemp'><p id='titleinfo'>"+mesh.type+"</p><p id='texteinfo'> <span> Nom </span>"+mesh.name+"<br> <span> Id </span>"+mesh.id+"<br> <span> Infos générales </span>"+mesh.info+"</p></div>";


            // shadowGenerator.getShadowMap().renderList.push(mesh);
            // shadowGenerator2.getShadowMap().renderList.push(mesh);
            // shadowGenerator3.getShadowMap().renderList.push(mesh);
            // shadowGenerator4.getShadowMap().renderList.push(mesh);
          });




    var chariot1 = BABYLON.SceneLoader.ImportMesh("", "/usine3d/FromScratch/objets/", "camion.obj", scene, function(newMeshes) { //import de l'objt 3D .babylon , appel de fonction callBack OnSuccess
          var mesh = newMeshes[0];
          mesh.material = new BABYLON.StandardMaterial("mat",scene);
          mesh.material.diffuseColor = new BABYLON.Color3(1,1,0);
          mesh.position.x = -95;
          mesh.position.y = 0
          mesh.position.z = -105;
          mesh.scaling.x = 8;
          mesh.scaling.y = 8;
          mesh.scaling.z = 8;
          mesh.type = "Chariot Elevateur";
          mesh.name = "mesh n° : " + Math.random();
          mesh.info = "je suis le premir chariot élévateur situé dans la zone de stock";
          mesh.informations = "<div style='overflow-x:auto;' id='infotemp'><p id='titleinfo'>"+mesh.type+"</p><p id='texteinfo'> <span> Nom </span>"+mesh.name+"<br> <span> Id </span>"+mesh.id+"<br> <span> Infos générales </span>"+mesh.info+"</p></div>";
          // shadowGenerator.getShadowMap().renderList.push(mesh);
          // shadowGenerator2.getShadowMap().renderList.push(mesh);
          // shadowGenerator3.getShadowMap().renderList.push(mesh);
          // shadowGenerator4.getShadowMap().renderList.push(mesh);
          setBounce(mesh);

        });


    var chariot2 = BABYLON.SceneLoader.ImportMesh("", "/usine3d/FromScratch/objets/", "camion.obj", scene, function(newMeshes) { //import de l'objt 3D .babylon , appel de fonction callBack OnSuccess
          var mesh = newMeshes[0];
          mesh.material = new BABYLON.StandardMaterial("mat",scene);
          mesh.material.diffuseColor = new BABYLON.Color3(1,1,0);
          mesh.position.x = -135;
          mesh.position.y = 0
          mesh.position.z = -85;
          mesh.scaling.x = 8;
          mesh.scaling.y = 8;
          mesh.scaling.z = 8;
          mesh.type = "Chariot Elevateur";
          mesh.name = "mesh n° : " + Math.random();
          mesh.info = "je suis le deuxième chariot élévateur situé dans la zone de stock";
          mesh.informations = "<div style='overflow-x:auto;' id='infotemp'><p id='titleinfo'>"+mesh.type+"</p><p id='texteinfo'> <span> Nom </span>"+mesh.name+"<br> <span> Id </span>"+mesh.id+"<br> <span> Infos générales </span>"+mesh.info+"</p></div>";

          // shadowGenerator.getShadowMap().renderList.push(mesh);
          // shadowGenerator2.getShadowMap().renderList.push(mesh);
          // shadowGenerator3.getShadowMap().renderList.push(mesh);
          // shadowGenerator4.getShadowMap().renderList.push(mesh);

        });
      var chariot3 = BABYLON.SceneLoader.ImportMesh("", "/usine3d/FromScratch/objets/", "camion.obj", scene, function(newMeshes) { //import de l'objt 3D .babylon , appel de fonction callBack OnSuccess
            var mesh = newMeshes[0];
            mesh.material = new BABYLON.StandardMaterial("mat",scene);
            mesh.material.diffuseColor = new BABYLON.Color3(1,1,0);
            mesh.position.x = 80;
            mesh.position.y = 0
            mesh.position.z = 115;
            mesh.scaling.x = 8;
            mesh.scaling.y = 8;
            mesh.scaling.z = 8;
            mesh.type = "Chariot Elevateur";
            mesh.name = "mesh n° : " + Math.random();
            mesh.info = "je suis le deuxième chariot élévateur situé dans la zone de stock";
            mesh.informations = "<div style='overflow-x:auto;' id='infotemp'><p id='titleinfo'>"+mesh.type+"</p><p id='texteinfo'> <span> Nom </span>"+mesh.name+"<br> <span> Id </span>"+mesh.id+"<br> <span> Infos générales </span>"+mesh.info+"</p></div>";

            // shadowGenerator.getShadowMap().renderList.push(mesh);
            // shadowGenerator2.getShadowMap().renderList.push(mesh);
            // shadowGenerator3.getShadowMap().renderList.push(mesh);
            // shadowGenerator4.getShadowMap().renderList.push(mesh);
            mesh.rotate(BABYLON.Axis.Y,245/57,BABYLON.Space.WORLD);
          });
      var chariot4 = BABYLON.SceneLoader.ImportMesh("", "/usine3d/FromScratch/objets/", "camion.obj", scene, function(newMeshes) { //import de l'objt 3D .babylon , appel de fonction callBack OnSuccess
            var mesh = newMeshes[0];
            mesh.material = new BABYLON.StandardMaterial("mat",scene);
            mesh.material.diffuseColor = new BABYLON.Color3(1,1,0);
            mesh.position.x = 65;
            mesh.position.y = 0
            mesh.position.z = 115;
            mesh.scaling.x = 8;
            mesh.scaling.y = 8;
            mesh.scaling.z = 8;
            mesh.type = "Chariot Elevateur";
            mesh.name = "mesh n° : " + Math.random();
            mesh.info = "je suis le deuxième chariot élévateur situé dans la zone de stock";
            mesh.informations = "<div style='overflow-x:auto;' id='infotemp'><p id='titleinfo'>"+mesh.type+"</p><p id='texteinfo'> <span> Nom </span>"+mesh.name+"<br> <span> Id </span>"+mesh.id+"<br> <span> Infos générales </span>"+mesh.info+"</p></div>";

            // shadowGenerator.getShadowMap().renderList.push(mesh);
            // shadowGenerator2.getShadowMap().renderList.push(mesh);
            // shadowGenerator3.getShadowMap().renderList.push(mesh);
            // shadowGenerator4.getShadowMap().renderList.push(mesh);
            mesh.rotate(BABYLON.Axis.Y,245/57,BABYLON.Space.WORLD);
          });
      var chariot5 = BABYLON.SceneLoader.ImportMesh("", "/usine3d/FromScratch/objets/", "camion.obj", scene, function(newMeshes) { //import de l'objt 3D .babylon , appel de fonction callBack OnSuccess
            var mesh = newMeshes[0];
            mesh.material = new BABYLON.StandardMaterial("mat",scene);
            mesh.material.diffuseColor = new BABYLON.Color3(1,1,0);
            mesh.position.x = 50;
            mesh.position.y = 0
            mesh.position.z = 115;
            mesh.scaling.x = 8;
            mesh.scaling.y = 8;
            mesh.scaling.z = 8;
            mesh.type = "Chariot Elevateur";
            mesh.name = "mesh n° : " + Math.random();
            mesh.info = "je suis le deuxième chariot élévateur situé dans la zone de stock";
            mesh.informations = "<div style='overflow-x:auto;' id='infotemp'><p id='titleinfo'>"+mesh.type+"</p><p id='texteinfo'> <span> Nom </span>"+mesh.name+"<br> <span> Id </span>"+mesh.id+"<br> <span> Infos générales </span>"+mesh.info+"</p></div>";

            // shadowGenerator.getShadowMap().renderList.push(mesh);
            // shadowGenerator2.getShadowMap().renderList.push(mesh);
            // shadowGenerator3.getShadowMap().renderList.push(mesh);
            // shadowGenerator4.getShadowMap().renderList.push(mesh);
            mesh.rotate(BABYLON.Axis.Y,245/57,BABYLON.Space.WORLD);
          });
      var chariot6 = BABYLON.SceneLoader.ImportMesh("", "/usine3d/FromScratch/objets/", "camion.obj", scene, function(newMeshes) { //import de l'objt 3D .babylon , appel de fonction callBack OnSuccess
            var mesh = newMeshes[0];
            mesh.material = new BABYLON.StandardMaterial("mat",scene);
            mesh.material.diffuseColor = new BABYLON.Color3(1,1,0);
            mesh.position.x = 105;
            mesh.position.y = 0
            mesh.position.z = 110;
            mesh.scaling.x = 8;
            mesh.scaling.y = 8;
            mesh.scaling.z = 8;
            mesh.type = "Chariot Elevateur";
            mesh.name = "mesh n° : " + Math.random();
            mesh.info = "je suis le deuxième chariot élévateur situé dans la zone de stock";
            mesh.informations = "<div style='overflow-x:auto;' id='infotemp'><p id='titleinfo'>"+mesh.type+"</p><p id='texteinfo'> <span> Nom </span>"+mesh.name+"<br> <span> Id </span>"+mesh.id+"<br> <span> Infos générales </span>"+mesh.info+"</p></div>";

            // shadowGenerator.getShadowMap().renderList.push(mesh);
            // shadowGenerator2.getShadowMap().renderList.push(mesh);
            // shadowGenerator3.getShadowMap().renderList.push(mesh);
            // shadowGenerator4.getShadowMap().renderList.push(mesh);
          });

        var chariot7 = BABYLON.SceneLoader.ImportMesh("", "/usine3d/FromScratch/objets/", "camion.obj", scene, function(newMeshes) { //import de l'objt 3D .babylon , appel de fonction callBack OnSuccess
              var mesh = newMeshes[0];
              mesh.material = new BABYLON.StandardMaterial("mat",scene);
              mesh.material.diffuseColor = new BABYLON.Color3(1,1,0);
              mesh.position.x = 115;
              mesh.position.y = 0
              mesh.position.z = 110;
              mesh.scaling.x = 8;
              mesh.scaling.y = 8;
              mesh.scaling.z = 8;
              mesh.type = "Chariot Elevateur";
              mesh.name = "mesh n° : " + Math.random();
              mesh.info = "je suis le deuxième chariot élévateur situé dans la zone de stock";
              mesh.informations = "<div style='overflow-x:auto;' id='infotemp'><p id='titleinfo'>"+mesh.type+"</p><p id='texteinfo'> <span> Nom </span>"+mesh.name+"<br> <span> Id </span>"+mesh.id+"<br> <span> Infos générales </span>"+mesh.info+"</p></div>";

              // shadowGenerator.getShadowMap().renderList.push(mesh);
              // shadowGenerator2.getShadowMap().renderList.push(mesh);
              // shadowGenerator3.getShadowMap().renderList.push(mesh);
              // shadowGenerator4.getShadowMap().renderList.push(mesh);
            });
        var chariot8 = BABYLON.SceneLoader.ImportMesh("", "/usine3d/FromScratch/objets/", "camion.obj", scene, function(newMeshes) { //import de l'objt 3D .babylon , appel de fonction callBack OnSuccess
              var mesh = newMeshes[0];
              mesh.material = new BABYLON.StandardMaterial("mat",scene);
              mesh.material.diffuseColor = new BABYLON.Color3(1,1,0);
              mesh.position.x = 110;
              mesh.position.y = 0
              mesh.position.z = 120;
              mesh.scaling.x = 8;
              mesh.scaling.y = 8;
              mesh.scaling.z = 8;
              mesh.type = "Chariot Elevateur";
              mesh.name = "mesh n° : " + Math.random();
              mesh.info = "je suis le deuxième chariot élévateur situé dans la zone de stock";
              mesh.informations = "<div style='overflow-x:auto;' id='infotemp'><p id='titleinfo'>"+mesh.type+"</p><p id='texteinfo'> <span> Nom </span>"+mesh.name+"<br> <span> Id </span>"+mesh.id+"<br> <span> Infos générales </span>"+mesh.info+"</p></div>";

              // shadowGenerator.getShadowMap().renderList.push(mesh);
              // shadowGenerator2.getShadowMap().renderList.push(mesh);
              // shadowGenerator3.getShadowMap().renderList.push(mesh);
              // shadowGenerator4.getShadowMap().renderList.push(mesh);

            });
          var chariot9 = BABYLON.SceneLoader.ImportMesh("", "/usine3d/FromScratch/objets/", "camion.obj", scene, function(newMeshes) { //import de l'objt 3D .babylon , appel de fonction callBack OnSuccess
                var mesh = newMeshes[0];
                mesh.material = new BABYLON.StandardMaterial("mat",scene);
                mesh.material.diffuseColor = new BABYLON.Color3(1,1,0);
                mesh.position.x = 118;
                mesh.position.y = 0
                mesh.position.z = 120;
                mesh.scaling.x = 8;
                mesh.scaling.y = 8;
                mesh.scaling.z = 8;
                mesh.type = "Chariot Elevateur";
                mesh.name = "mesh n° : " + Math.random();
                mesh.info = "je suis le deuxième chariot élévateur situé dans la zone de stock";
                mesh.informations = "<div style='overflow-x:auto;' id='infotemp'><p id='titleinfo'>"+mesh.type+"</p><p id='texteinfo'> <span> Nom </span>"+mesh.name+"<br> <span> Id </span>"+mesh.id+"<br> <span> Infos générales </span>"+mesh.info+"</p></div>";

                // shadowGenerator.getShadowMap().renderList.push(mesh);
                // shadowGenerator2.getShadowMap().renderList.push(mesh);
                // shadowGenerator3.getShadowMap().renderList.push(mesh);
                // shadowGenerator4.getShadowMap().renderList.push(mesh);

              });
  var camera1 = BABYLON.SceneLoader.ImportMesh("", "/usine3d/FromScratch/objets/scenes/obj/", "capteurCamera.obj", scene, function(newMeshes) { //import de l'objt 3D .babylon , appel de fonction callBack OnSuccess
             var mesh = newMeshes[0];
             mesh.material = new BABYLON.StandardMaterial("mat",scene);
             mesh.material.diffuseColor = new BABYLON.Color3(0.2,0.2,0.8);
             mesh.position.x = 38;
             mesh.position.y = 0
             mesh.position.z = -85;
             mesh.scaling.x = 8;
             mesh.scaling.y = 8;
             mesh.scaling.z = 8;
             mesh.type = "caméra";
             mesh.name = "mesh n° : " + Math.random();
             mesh.info = "je suis une caméra employée à surveiller les lignes de production";
             mesh.informations = "<div style='overflow-x:auto;' id='infotemp'><p id='titleinfo'>"+mesh.type+"</p><p id='texteinfo'> <span> Nom </span>"+mesh.name+"<br> <span> Id </span>"+mesh.id+"<br> <span> Infos générales </span>"+mesh.info+"</p></div>";

             // shadowGenerator.getShadowMap().renderList.push(mesh);
             // shadowGenerator2.getShadowMap().renderList.push(mesh);
             // shadowGenerator3.getShadowMap().renderList.push(mesh);
             // shadowGenerator4.getShadowMap().renderList.push(mesh);
             setBounce(mesh);

           });


 BABYLON.SceneLoader.ImportMesh("", "/usine3d/FromScratch/objets/test_export/", "remesh.obj", scene, function(newMeshes){
   var mesh = newMeshes[0];
   mesh.material = new BABYLON.StandardMaterial("mat",scene);
   mesh.scaling.x = 8;
   mesh.scaling.z = 8;
   mesh.scaling.y = 12;
   mesh.type = "Stockage";
   mesh.name = "mesh n° : " + Math.random();
   mesh.info = "je suis une étagère de stockage située en plein milieu de l'usine";
   mesh.informations = "<div style='overflow-x:auto;' id='infotemp'><p id='titleinfo'>"+mesh.type+"</p><p id='texteinfo'> <span> Nom </span>"+mesh.name+"<br> <span> Id </span>"+mesh.id+"<br> <span> Infos générales </span>"+mesh.info+"</p></div>";
   mesh.material.diffuseColor = new BABYLON.Color3(1,1,0.5);
   // "<div style = 'overflox-x:auto;' id='infotemp'><table><tr><th>"+mesh.type+"</th></tr> <tr> <td> <b>Nom de l'objet :</b> "+mesh.name+"</td></tr><tr><td> <b>id :</b>"+mesh.id+"</td></tr><tr><td><b>Autres infos:</b>"+mesh.info+"</td></tr></table></div>";
   // "<div style='overflow-x:auto;' id='infotemp'><p id='titleinfo'>"+mesh.type+"</p><p id='texteinfo'> <span> Nom </span>"+mesh.name+"<br> <span> Id </span>"+mesh.id+"<br> <span> Infos générales </span>"+mesh.info+"</p></div>";


   // shadowGenerator.getShadowMap().renderList.push(mesh);
   // shadowGenerator2.getShadowMap().renderList.push(mesh);
   // shadowGenerator3.getShadowMap().renderList.push(mesh);
   // shadowGenerator4.getShadowMap().renderList.push(mesh);
   setBounce(mesh);

 });


// PIECE EN BAS A DROITE

var stockage21  = BABYLON.SceneLoader.ImportMesh("", "/usine3d/FromScratch/objlouis/", "stockage2test.obj", scene, function(newMeshes){
  var mesh = newMeshes[0];
   mesh.material = new BABYLON.StandardMaterial("mat",scene);
   mesh.material.diffuseColor = new BABYLON.Color3(1,1,1);

  mesh.scaling.x = 6;
  mesh.scaling.z = 6;
  mesh.scaling.y = 6;
  mesh.position.x = -10;
  mesh.position.y = 1;
  mesh.position.z = 75;
  mesh.type = "Stockage";
  mesh.name = "mesh n° : " + Math.random();
  mesh.info = "je suis une étagère de stockage située en plein milieu de l'usine";
  mesh.informations ="<div style='overflow-x:auto;' id='infotemp'><p id='titleinfo'>"+mesh.type+"</p><p id='texteinfo'> <span> Nom </span>"+mesh.name+"<br> <span> Id </span>"+mesh.id+"<br> <span> Infos générales </span>"+mesh.info+"</p></div>";
  setBounce(mesh);

});

var stockage22 = BABYLON.SceneLoader.ImportMesh("", "/usine3d/FromScratch/objets/test_export/", "remesh.obj",scene, function(newMeshes){
  var mesh = newMeshes[0];
  mesh.material = new BABYLON.StandardMaterial("mat",scene);
  mesh.material.diffuseColor = new BABYLON.Color3(1,1,0.5);
  mesh.scaling.x = 5;
  mesh.scaling.z = 5;
  mesh.scaling.y = 5;
  mesh.position.x = -35;
  mesh.position.y = 0;
  mesh.position.z = 75;
  mesh.type = "Stockage";
  mesh.name = "mesh n° : " + Math.random();
  mesh.info = "je suis une étagère de stockage située à la place des cuves";
  mesh.informations = "<div style='overflow-x:auto;' id='infotemp'><p id='titleinfo'>"+mesh.type+"</p><p id='texteinfo'> <span> Nom </span>"+mesh.name+"<br> <span> Id </span>"+mesh.id+"<br> <span> Infos générales </span>"+mesh.info+"</p></div>";
});


var stockage23 = BABYLON.SceneLoader.ImportMesh("", "/usine3d/FromScratch/objets/test_export/", "remesh.obj",scene, function(newMeshes){
  var mesh = newMeshes[0];
  mesh.material = new BABYLON.StandardMaterial("mat",scene);
  mesh.material.diffuseColor = new BABYLON.Color3(1,1,0.5);
  mesh.scaling.x = 5;
  mesh.scaling.z = 5;
  mesh.scaling.y = 5;
  mesh.position.x = -55;
  mesh.position.y = 0;
  mesh.position.z = 75;
  mesh.type = "Stockage";
  mesh.name = "mesh n° : " + Math.random();
  mesh.info = "je suis une étagère de stockage située à la place des cuves";
  mesh.informations = "<div style='overflow-x:auto;' id='infotemp'><p id='titleinfo'>"+mesh.type+"</p><p id='texteinfo'> <span> Nom </span>"+mesh.name+"<br> <span> Id </span>"+mesh.id+"<br> <span> Infos générales </span>"+mesh.info+"</p></div>";
});


var stockage24 = BABYLON.SceneLoader.ImportMesh("", "/usine3d/FromScratch/objets/test_export/", "remesh.obj",scene, function(newMeshes){
  var mesh = newMeshes[0];
  mesh.material = new BABYLON.StandardMaterial("mat",scene);
  mesh.material.diffuseColor = new BABYLON.Color3(1,1,0.5);
  mesh.scaling.x = 5;
  mesh.scaling.z = 5;
  mesh.scaling.y = 5;
  mesh.position.x = -75;
  mesh.position.y = 0;
  mesh.position.z = 75;
  mesh.type = "Stockage";
  mesh.name = "mesh n° : " + Math.random();
  mesh.info = "je suis une étagère de stockage située à la place des cuves";
  mesh.informations = "<div style='overflow-x:auto;' id='infotemp'><p id='titleinfo'>"+mesh.type+"</p><p id='texteinfo'> <span> Nom </span>"+mesh.name+"<br> <span> Id </span>"+mesh.id+"<br> <span> Infos générales </span>"+mesh.info+"</p></div>";
});

var stockage25 = BABYLON.SceneLoader.ImportMesh("", "/usine3d/FromScratch/objets/test_export/", "remesh.obj",scene, function(newMeshes){
  var mesh = newMeshes[0];
  mesh.material = new BABYLON.StandardMaterial("mat",scene);
  mesh.material.diffuseColor = new BABYLON.Color3(1,1,0.5);
  mesh.scaling.x = 5;
  mesh.scaling.z = 5;
  mesh.scaling.y = 5;
  mesh.position.x = -95;
  mesh.position.y = 0;
  mesh.position.z = 75;
  mesh.type = "Stockage";
  mesh.name = "mesh n° : " + Math.random();
  mesh.info = "je suis une étagère de stockage située à la place des cuves";
  mesh.informations = "<div style='overflow-x:auto;' id='infotemp'><p id='titleinfo'>"+mesh.type+"</p><p id='texteinfo'> <span> Nom </span>"+mesh.name+"<br> <span> Id </span>"+mesh.id+"<br> <span> Infos générales </span>"+mesh.info+"</p></div>";
});




var stockage31 = BABYLON.SceneLoader.ImportMesh("","/usine3d/FromScratch/objlouis/", "stockage2test.obj", scene, function(newMeshes){
  var mesh = newMeshes[0];
  mesh.scaling.x = 5;
  mesh.scaling.y = 5;
  mesh.scaling.z = 5;
  mesh.position.x = 105;
  mesh.position.y = 0;
  mesh.position.z = -145;
  mesh.type = "stockage";
  mesh.name = "stockage  3.1";
  mesh.info = "je suis un beau bureau";
  mesh.informations = "<div style='overflow-x:auto;' id='infotemp'><p id='titleinfo'>"+mesh.type+"</p><p id='texteinfo'> <span> Nom </span>"+mesh.name+"<br> <span> Id </span>"+mesh.id+"<br> <span> Infos générales </span>"+mesh.info+"</p></div>";
});
var stockage32 = BABYLON.SceneLoader.ImportMesh("","/usine3d/FromScratch/objlouis/", "stockage2test.obj", scene, function(newMeshes){
  var mesh = newMeshes[0];
  mesh.scaling.x = 5;
  mesh.scaling.y = 5;
  mesh.scaling.z = 5;
  mesh.position.x = 135;
  mesh.position.y = 0;
  mesh.position.z = -145;
  mesh.type = "stockage";
  mesh.name = "stockage  3.1";
  mesh.info = "je suis un beau bureau";
  mesh.informations = "<div style='overflow-x:auto;' id='infotemp'><p id='titleinfo'>"+mesh.type+"</p><p id='texteinfo'> <span> Nom </span>"+mesh.name+"<br> <span> Id </span>"+mesh.id+"<br> <span> Infos générales </span>"+mesh.info+"</p></div>";
});
var stockage33 = BABYLON.SceneLoader.ImportMesh("","/usine3d/FromScratch/objlouis/", "stockage2test.obj", scene, function(newMeshes){
  var mesh = newMeshes[0];
  mesh.scaling.x = 5;
  mesh.scaling.y = 5;
  mesh.scaling.z = 5;
  mesh.position.x = 105;
  mesh.position.y = 0;
  mesh.position.z = -125;
  mesh.type = "stockage";
  mesh.name = "stockage  3.1";
  mesh.info = "je suis un beau bureau";
  mesh.informations = "<div style='overflow-x:auto;' id='infotemp'><p id='titleinfo'>"+mesh.type+"</p><p id='texteinfo'> <span> Nom </span>"+mesh.name+"<br> <span> Id </span>"+mesh.id+"<br> <span> Infos générales </span>"+mesh.info+"</p></div>";
});
var stockage34 = BABYLON.SceneLoader.ImportMesh("","/usine3d/FromScratch/objlouis/", "stockage2test.obj", scene, function(newMeshes){
  var mesh = newMeshes[0];
  mesh.scaling.x = 5;
  mesh.scaling.y = 5;
  mesh.scaling.z = 5;
  mesh.position.x = 135;
  mesh.position.y = 0;
  mesh.position.z = -125;
  mesh.type = "stockage";
  mesh.name = "stockage  3.1";
  mesh.info = "je suis un beau bureau";
  mesh.informations = "<div style='overflow-x:auto;' id='infotemp'><p id='titleinfo'>"+mesh.type+"</p><p id='texteinfo'> <span> Nom </span>"+mesh.name+"<br> <span> Id </span>"+mesh.id+"<br> <span> Infos générales </span>"+mesh.info+"</p></div>";
});
var stockage35 = BABYLON.SceneLoader.ImportMesh("","/usine3d/FromScratch/objlouis/", "stockage2.obj", scene, function(newMeshes){
  var mesh = newMeshes[0];
  mesh.scaling.x = 5;
  mesh.scaling.y = 5;
  mesh.scaling.z = 5;
  mesh.position.x = 120;
  mesh.position.y = 0;
  mesh.position.z = -145;
  mesh.type = "stockage";
  mesh.name = "stockage  3.1";
  mesh.info = "je suis un beau bureau";
  mesh.informations = "<div style='overflow-x:auto;' id='infotemp'><p id='titleinfo'>"+mesh.type+"</p><p id='texteinfo'> <span> Nom </span>"+mesh.name+"<br> <span> Id </span>"+mesh.id+"<br> <span> Infos générales </span>"+mesh.info+"</p></div>";
});
var stockage36 = BABYLON.SceneLoader.ImportMesh("","/usine3d/FromScratch/objlouis/", "stockage2test.obj", scene, function(newMeshes){
  var mesh = newMeshes[0];
  mesh.scaling.x = 5;
  mesh.scaling.y = 5;
  mesh.scaling.z = 5;
  mesh.position.x = 120;
  mesh.position.y = 0;
  mesh.position.z = -125;
  mesh.type = "stockage";
  mesh.name = "stockage  3.1";
  mesh.info = "je suis un beau bureau";
  mesh.informations = "<div style='overflow-x:auto;' id='infotemp'><p id='titleinfo'>"+mesh.type+"</p><p id='texteinfo'> <span> Nom </span>"+mesh.name+"<br> <span> Id </span>"+mesh.id+"<br> <span> Infos générales </span>"+mesh.info+"</p></div>";
});
var stockage37 = BABYLON.SceneLoader.ImportMesh("","/usine3d/FromScratch/objlouis/", "stockage2test.obj", scene, function(newMeshes){
  var mesh = newMeshes[0];
  mesh.scaling.x = 5;
  mesh.scaling.y = 5;
  mesh.scaling.z = 5;
  mesh.position.x = 105;
  mesh.position.y = 0;
  mesh.position.z = -105;
  mesh.type = "stockage";
  mesh.name = "stockage  3.1";
  mesh.info = "je suis un beau bureau";
  mesh.informations = "<div style='overflow-x:auto;' id='infotemp'><p id='titleinfo'>"+mesh.type+"</p><p id='texteinfo'> <span> Nom </span>"+mesh.name+"<br> <span> Id </span>"+mesh.id+"<br> <span> Infos générales </span>"+mesh.info+"</p></div>";
});
var stockage38 = BABYLON.SceneLoader.ImportMesh("","/usine3d/FromScratch/objlouis/", "stockage2test.obj", scene, function(newMeshes){
  var mesh = newMeshes[0];
  mesh.scaling.x = 5;
  mesh.scaling.y = 5;
  mesh.scaling.z = 5;
  mesh.position.x = 135;
  mesh.position.y = 0;
  mesh.position.z = -105;
  mesh.type = "stockage";
  mesh.name = "stockage  3.1";
  mesh.info = "je suis un beau bureau";
  mesh.informations = "<div style='overflow-x:auto;' id='infotemp'><p id='titleinfo'>"+mesh.type+"</p><p id='texteinfo'> <span> Nom </span>"+mesh.name+"<br> <span> Id </span>"+mesh.id+"<br> <span> Infos générales </span>"+mesh.info+"</p></div>";
});


var stockage41 = BABYLON.SceneLoader.ImportMesh("", "/usine3d/FromScratch/objlouis/", "stockage3.obj",scene, function(newMeshes){
  var mesh = newMeshes[0];
  mesh.material = new BABYLON.StandardMaterial("mat",scene);
  mesh.material.diffuseColor = new BABYLON.Color3(1,1,0.5);
  mesh.scaling.x = 6;
  mesh.scaling.z = 6;
  mesh.scaling.y = 6;
  mesh.position.x = -10;
  mesh.position.y = 1;
  mesh.position.z = 105;
  mesh.type = "Stockage";
  mesh.name = "mesh n° : " + Math.random();
  mesh.info = "je suis une étagère de stockage siuée en bas à droite de l'usine";
  mesh.informations = "<div style='overflow-x:auto;' id='infotemp'><p id='titleinfo'>"+mesh.type+"</p><p id='texteinfo'> <span> Nom </span>"+mesh.name+"<br> <span> Id </span>"+mesh.id+"<br> <span> Infos générales </span>"+mesh.info+"</p></div>";

});
var stockage42 = BABYLON.SceneLoader.ImportMesh("", "/usine3d/FromScratch/objlouis/", "stockage3.obj",scene, function(newMeshes){
  var mesh = newMeshes[0];
  mesh.scaling.x = 6;
  mesh.scaling.z = 6;
  mesh.scaling.y = 6;
  mesh.position.x = -10;
  mesh.position.y = 1;
  mesh.position.z = 130;
  mesh.type = "Stockage";
  mesh.name = "mesh n° : " + Math.random();
  mesh.info = "je suis une étagère de stockage siuée en bas à droite de l'usine";
  mesh.informations = "<div style='overflow-x:auto;' id='infotemp'><p id='titleinfo'>"+mesh.type+"</p><p id='texteinfo'> <span> Nom </span>"+mesh.name+"<br> <span> Id </span>"+mesh.id+"<br> <span> Infos générales </span>"+mesh.info+"</p></div>";

});
var stockage43 = BABYLON.SceneLoader.ImportMesh("", "/usine3d/FromScratch/objlouis/", "stockage3.obj",scene, function(newMeshes){
  var mesh = newMeshes[0];
  mesh.scaling.x = 6;
  mesh.scaling.z = 6;
  mesh.scaling.y = 6;
  mesh.position.x = -110;
  mesh.position.y = 1;
  mesh.position.z = 105;
  mesh.type = "Stockage";
  mesh.name = "mesh n° : " + Math.random();
  mesh.info = "je suis une étagère de stockage siuée en bas à droite de l'usine";
  mesh.informations = "<div style='overflow-x:auto;' id='infotemp'><p id='titleinfo'>"+mesh.type+"</p><p id='texteinfo'> <span> Nom </span>"+mesh.name+"<br> <span> Id </span>"+mesh.id+"<br> <span> Infos générales </span>"+mesh.info+"</p></div>";

});
var stockage44 = BABYLON.SceneLoader.ImportMesh("", "/usine3d/FromScratch/objlouis/", "stockage3.obj",scene, function(newMeshes){
  var mesh = newMeshes[0];
  mesh.scaling.x = 6;
  mesh.scaling.z = 6;
  mesh.scaling.y = 6;
  mesh.position.x = -60;
  mesh.position.y = 1;
  mesh.position.z = 105;
  mesh.type = "Stockage";
  mesh.name = "mesh n° : " + Math.random();
  mesh.info = "je suis une étagère de stockage siuée en bas à droite de l'usine";
  mesh.informations = "<div style='overflow-x:auto;' id='infotemp'><p id='titleinfo'>"+mesh.type+"</p><p id='texteinfo'> <span> Nom </span>"+mesh.name+"<br> <span> Id </span>"+mesh.id+"<br> <span> Infos générales </span>"+mesh.info+"</p></div>";

});
var stockage45 = BABYLON.SceneLoader.ImportMesh("", "/usine3d/FromScratch/objlouis/", "stockage3.obj",scene, function(newMeshes){
  var mesh = newMeshes[0];
  mesh.scaling.x = 6;
  mesh.scaling.z = 6;
  mesh.scaling.y = 6;
  mesh.position.x = -60;
  mesh.position.y = 1;
  mesh.position.z = 130;
  mesh.type = "Stockage";
  mesh.name = "mesh n° : " + Math.random();
  mesh.info = "je suis une étagère de stockage siuée en bas à droite de l'usine";
  mesh.informations = "<div style='overflow-x:auto;' id='infotemp'><p id='titleinfo'>"+mesh.type+"</p><p id='texteinfo'> <span> Nom </span>"+mesh.name+"<br> <span> Id </span>"+mesh.id+"<br> <span> Infos générales </span>"+mesh.info+"</p></div>";

});
var stockage46 = BABYLON.SceneLoader.ImportMesh("", "/usine3d/FromScratch/objlouis/", "stockage3.obj",scene, function(newMeshes){
  var mesh = newMeshes[0];
  mesh.scaling.x = 6;
  mesh.scaling.z = 6;
  mesh.scaling.y = 6;
  mesh.position.x = -110;
  mesh.position.y = 1;
  mesh.position.z = 130;
  mesh.type = "Stockage";
  mesh.name = "mesh n° : " + Math.random();
  mesh.info = "je suis une étagère de stockage siuée en bas à droite de l'usine";
  mesh.informations = "<div style='overflow-x:auto;' id='infotemp'><p id='titleinfo'>"+mesh.type+"</p><p id='texteinfo'> <span> Nom </span>"+mesh.name+"<br> <span> Id </span>"+mesh.id+"<br> <span> Infos générales </span>"+mesh.info+"</p></div>";

});
//ANIMATION DES MACHINES
// createFlux(cube3.position,cube4.position);

//createFlux(ligneprod1.position,cube4.position);


    //////////////////////////////////////////////////////////////////////:
    // GESTION DES PARTICULES   ////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////





    /******************************************************************
     * Creation de flux, méthode de la sphère animée entre deux points *
     ******************************************************************/



    function selectionFlux() { // fonction de sélection, on ajoute les éléments dans la liste s'ils n'y sont pas déjà présents
        if (meshesFlux.length < 2) {
            for (var i = 0; i < meshesFlux.length; i++) {
                if (meshesFlux[i].name == selectedMesh.name) {
                    there = true;
                }
            }
            if (there == false) {
                meshesFlux.push(selectedMesh); //si l'élément sélectionné n'est pas déjà présent dans la liste alors on l'ajoute à la liste
                if (meshesFlux.length == 2) { //lorsque les 2 objets sont sélectionnés on lance la fonction qui va réellement créer le flux
                    createFlux();
                }
            }
        }
    }


    function createFlux(a,b) { // fonction de création de flux, définit l'animation et la lance.

        const pSource = a; // le point A est le premier objet de la liste
        const pDestination = b; // le point B est le deuxième objet de la liste
        const sphere = BABYLON.Mesh.CreateSphere("fluxhandler", 20, 4.0, scene); // crée une sphère, qui sera la source des particules

        /* PARTICULES ASSOCIEES A LA SPHERE */
        var ps = new BABYLON.ParticleSystem("stream", 2000, scene);
        ps.particleTexture = new BABYLON.Texture("/usine3D/FromScratch/textures/flares.png", scene);


        // Colors of all particles
        ps.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
        ps.color2 = new BABYLON.Color4(0.5, 0.7, 1.0, 1.0);
        ps.colorDead = new BABYLON.Color4(0.1, 0.2, 0.2, 0.3);

        // Size of each particle (random between...
        ps.minSize = 2;
        ps.maxSize = 2;

        // Life time of each particle (random between...
        ps.minLifeTime = 2.7;
        ps.maxLifeTime = 2.7;

        // Emission rate
        ps.emitRate = 8;

        // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
        ps.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

        // Set the gravity of all particles


        // Angular speed, in radians
        ps.minAngularSpeed = 0;
        ps.maxAngularSpeed = Math.PI;

        // Speed
        ps.minEmitPower = 25;
        ps.maxEmitPower = 25;
        ps.updateSpeed = 0.05;

        // Where the particles come from
        ps.minEmitBox = new BABYLON.Vector3(0, 0, 1); // Starting all from          //
        ps.maxEmitBox = new BABYLON.Vector3(0, 0, 1); // To...                      //
        //
        // Direction of each particle after it has been emitted                    //
        ps.direction1 = new BABYLON.Vector3(0, 0, 0); // ----------------- Valeurs par tatonnement, semble fonctionner mais pas d'explication
        ps.direction2 = new BABYLON.Vector3(0, 0, 0); //

        ps.emitter = sphere;

        ps.start();
        /**************************************************************/

        const material = new BABYLON.StandardMaterial('texture', scene);
        material.diffuseColor = new BABYLON.Color3(0, 1, 0);
        sphere.material = material;
        sphere.visibility = 0; //rend la sphère invisible, pour voir seulement les particules
        const animation = new BABYLON.Animation('flux', 'position', 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

        const keys = [{
                frame: 0,
                value: pSource,
            },
            {
                frame: 30,
                value: pDestination,
            },
        ];
        animation.setKeys(keys);
        sphere.animations.push(animation);
        scene.beginAnimation(sphere, 0, 30, true);
    }


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //  Gestion des boutons    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /****** RÉCUPÉRATION DES ÉLÉMENTS INSÉRÉS DANS CONSTRUCTION.JS ***********************/
    /** On récupère les éléments qui ont été créés dynamiquement grâce à jquery, dès que le document est chargé. On utilise jquery car
    les éléments ont été insérés via jquery */
    $(document).ready(function() {
    $(document).on("click","#checkground",function(){ // choix du plan 2d au sol ou non
      checkGround();
    });

    $("#deleteM").click(function(){
      var pickResult = scene.pick(scene.pointerX,scene.pointerY);
      if(pickResult.hit && pickResult.pickedMesh != ground){
        selectedMesh.dispose();
      }
    });

    $(document).on("click","#infos",function(evt) { //on écoute l'évènement de clic droit.
        // evt.preventDefault(); // empêche d'afficher l'action par défaut de l'évènement rightclick, cad aficher le menu contextuel.
        var pickResult2 = scene.pick(scene.pointerX, scene.pointerY);
        if (pickResult2.hit) {
            $("#infotemp").remove();
            $("#infosmesh").append(pickResult2.pickedMesh.informations);
            $("#infotemp").css("visibility","visible");
            $("#infotemp").css({
                'left': evt.pageX-45,
                'top': evt.pageY-95
            });
            $("#infotemp").click(function(){
              $("#infotemp").css("display","none");
            })
        }
    });

  });

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////      Gestion du sol           /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
    var ground = BABYLON.Mesh.CreateGround("ground1", 300, 300, 2, scene);
    var groundMat = new BABYLON.StandardMaterial("groundMat", scene);
    //INSERTION DU PLAN
    groundMat.ambientTexture = new BABYLON.Texture("/usine3D/FromScratch/plan.png", scene);

    ground.material = groundMat;
    ground.receiveShadows = false; //affiche les ombres sur le sol




//Affichage du plan ou non
    function checkGround() {
      // SI ON SE SERT DU CHECKBOX POUR AFFICHER LE PLAN
        // if ($("#checkground")[0].checked != false) {
        //     ground.material = new BABYLON.StandardMaterial("material", scene);
        // }
        // if ($("#checkground")[0].checked == false) {
        //     ground.material = groundMat;
        // }


        // SI ON SE SERT DE L'ONGLET DANS LE MENU EN HAUT
        if(masquer == false){
          ground.material = new BABYLON.StandardMaterial("material",scene);
        }
        if(masquer == true){
          ground.material = groundMat;
        }
        masquer = !masquer; //inverse la valeur du booléen
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //         Drag'n'drop                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

   //  var startingPoint;
   // var currentMesh;
   //
   // var getGroundPosition = function () {
   //     // Use a predicate to get position on the ground
   //     var pickinfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) {
   //        return mesh == ground;
   //       });
   //     if (pickinfo.hit) {
   //         return pickinfo.pickedPoint;
   //     }
   //
   //     return null;
   // }
   //
   // var onPointerDown = function (evt) {
   //     if (evt.button !== 0) {
   //         return;
   //     }
   //
   //     // check if we are under a mesh
   //     var pickInfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) {
   //       return mesh !== ground;
   //     });
   //     if (pickInfo.hit) {
   //         currentMesh = pickInfo.pickedMesh;
   //         startingPoint = getGroundPosition(evt);
   //
   //         if (startingPoint) { // we need to disconnect camera from canvas
   //             setTimeout(function () {
   //                 camera.detachControl(canvas);
   //             }, 0);
   //         }
   //     }
   // }
   //
   // var onPointerUp = function () {
   //     if (startingPoint) {
   //         camera.attachControl(canvas, true);
   //         startingPoint = null;
   //         return;
   //     }
   // }
   //
   // var onPointerMove = function(evt) {
   //     if (!startingPoint) {
   //         return;
   //     }
   //
   //     var current = getGroundPosition(evt);
   //
   //     if (!current) {
   //         return;
   //     }
   //     if (currentMesh.parent) currentMesh = currentMesh.parent; //LINE AJOUTEE PIUR TESTER
   //     var diff = current.subtract(startingPoint);
   //     currentMesh.position.addInPlace(diff);
   //
   //     startingPoint = current;
   //
   // }
   //
   // canvas.addEventListener("pointerdown", onPointerDown, false);
   // canvas.addEventListener("pointerup", onPointerUp, false);
   // canvas.addEventListener("pointermove", onPointerMove, false);
   //
   // scene.onDispose = function () {
   //     canvas.removeEventListener("pointerdown", onPointerDown);
   //     canvas.removeEventListener("pointerup", onPointerUp);
   //     canvas.removeEventListener("pointermove", onPointerMove);
   // }


    // RETOUR DE LA SCENE -  FIN DE LA FONCTION CREATESCENE
    return scene;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//   actualisation constante de la scène   ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var scene1 = createScene(); // on crée une scène
engine.runRenderLoop(function() {
    scene1.render(); // refresh de la scene a chaque frame
});



canvas.addEventListener("mouseover", function() {
    var body = document.getElementById('body');
    body.style.overflow = "hidden";
}); ///// GESTION DE LA SCROLLBAR - quand on est sur le canvas on la cache,sinon on l'affiche

canvas.addEventListener("mouseout", function() {
    var body = document.getElementById('body');
    body.style.overflow = "visible";
})



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//     redimension des objets en fonction de la fenetre   ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// window.addEventListener('resize', function() {
//     engine.resize(); //écouteur d'évènement lié à la fenêtre, lorsqu'on réduit celle-ci le canvas et les objets réduisent aussi pour s'adapter (s'aggrandissent)
// });
$(window).resize(function(){
  engine.resize();
});

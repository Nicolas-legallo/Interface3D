var canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas, true);
engine.enableOfflineSupport =false;



// On attribue des propriétés graphiques à l'objet créé
function objProperty() {
    var material = new BABYLON.StandardMaterial("material01", scene);
    mesh.material = material;
    mesh.actionManager = new BABYLON.ActionManager(scene);

    mesh.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOutTrigger, mesh, "scaling", new BABYLON.Vector3(mesh.scaling.x, mesh.scaling.y, mesh.scaling.z), 150));
    mesh.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOverTrigger, mesh, "scaling", new BABYLON.Vector3(mesh.scaling.x + mesh.scaling.x * 0.1, mesh.scaling.y + mesh.scaling.y * 0.1, mesh.scaling.z + mesh.scaling.z * 0.1), 150));

    shadowGenerator.getShadowMap().renderList.push(mesh); //ajoute l'objet à la liste des objets produisant des ombresss
    shadowGenerator2.getShadowMap().renderList.push(mesh);
    shadowGenerator3.getShadowMap().renderList.push(mesh);
    shadowGenerator4.getShadowMap().renderList.push(mesh);

}
// FONCTIONS D'IMPORT D'OBJETS //////

    function addligneprod(scene) {
        var mesh;
        // The first parameter can be used to specify which mesh to import. Here we import all meshes
        BABYLON.SceneLoader.ImportMesh("", "/usine3d/FromScratch/objets/scenes/obj/", "ligneProd.obj", scene, function(newMeshes) { //import de l'objt 3D .babylon , appel de fonction callBack OnSuccess
            mesh = newMeshes[0];
            mesh.type = "mesh";
            mesh.name = "mesh n° : " + Math.random();
            mesh.info = "je suis un mesh importé";
            mesh.informations = "<div style='overflow-x:auto;' id='infotemp'><p id='titleinfo'>"+mesh.type+"</p><p id='texteinfo'> <span> Nom </span>"+mesh.name+"<br> <span> Id </span>"+mesh.id+"<br> <span> Infos générales </span>"+mesh.info+"</p></div>";
            mesh.position = new BABYLON.Vector3(
                Math.random() * 100 * -1,
                0,
                Math.random() * 100 * -1,
            );
            mesh.scaling.x = 8;
            mesh.scaling.y = 8;
            mesh.scaling.z = 8;
            //scene.registerBeforeRender(objProperty()); //applique les propritétés de la fonction objProperty avant chaque render de frame
          });


    }


    function addchariot(scene){
      var mesh;
      // The first parameter can be used to specify which mesh to import. Here we import all meshes
      BABYLON.SceneLoader.ImportMesh("", "/usine3d/FromScratch/objets/", "camion.obj", scene, function(newMeshes) { //import de l'objt 3D .babylon , appel de fonction callBack OnSuccess
          mesh = newMeshes[0];
          mesh.type = "mesh";
          mesh.name = "mesh n° : " + Math.random();
          mesh.info = "je suis un mesh importé";
          mesh.informations = "<div style='overflow-x:auto;' id='infotemp'><p id='titleinfo'>"+mesh.type+"</p><p id='texteinfo'> <span> Nom </span>"+mesh.name+"<br> <span> Id </span>"+mesh.id+"<br> <span> Infos générales </span>"+mesh.info+"</p></div>";
          mesh.position = new BABYLON.Vector3(
              Math.random() * 100 * -1,
              0,
              Math.random() * 100 * -1,
          );
          mesh.scaling.x = 8;
          mesh.scaling.y = 8;
          mesh.scaling.z = 8;
          //scene.registerBeforeRender(objProperty()); //applique les propritétés de la fonction objProperty avant chaque render de frame
        });
  }

  function addstock1(scene){
    var mesh;
    BABYLON.SceneLoader.ImportMesh("", "/usine3d/FromScratch/objlouis/", "stockage.obj", scene, function(newMeshes) { //import de l'objt 3D .babylon , appel de fonction callBack OnSuccess
        mesh = newMeshes[0];
        mesh.type = "mesh";
        mesh.name = "mesh n° : " + Math.random();
        mesh.info = "je suis un mesh importé";
        mesh.informations = "<div style='overflow-x:auto;' id='infotemp'><p id='titleinfo'>"+mesh.type+"</p><p id='texteinfo'> <span> Nom </span>"+mesh.name+"<br> <span> Id </span>"+mesh.id+"<br> <span> Infos générales </span>"+mesh.info+"</p></div>";
        mesh.position = new BABYLON.Vector3(
            Math.random() * 100 * -1,
            0,
            Math.random() * 100 * -1,
        );
        mesh.scaling.x = 5;
        mesh.scaling.y = 5;
        mesh.scaling.z = 5;
        //scene.registerBeforeRender(objProperty()); //applique les propritétés de la fonction objProperty avant chaque render de frame
      });
    }

    function addstock2(scene){
      var mesh;
      BABYLON.SceneLoader.ImportMesh("", "/usine3d/FromScratch/objlouis/", "stockage2.obj", scene, function(newMeshes) { //import de l'objt 3D .babylon , appel de fonction callBack OnSuccess
          mesh = newMeshes[0];
          mesh.type = "mesh";
          mesh.name = "mesh n° : " + Math.random();
          mesh.info = "je suis un mesh importé";
          mesh.informations = "<div style='overflow-x:auto;' id='infotemp'><p id='titleinfo'>"+mesh.type+"</p><p id='texteinfo'> <span> Nom </span>"+mesh.name+"<br> <span> Id </span>"+mesh.id+"<br> <span> Infos générales </span>"+mesh.info+"</p></div>";
          mesh.position = new BABYLON.Vector3(
              Math.random() * 100 * -1,
              0,
              Math.random() * 100 * -1,
          );
          mesh.scaling.x = 5;
          mesh.scaling.y = 5;
          mesh.scaling.z = 5;
          //scene.registerBeforeRender(objProperty()); //applique les propritétés de la fonction objProperty avant chaque render de frame
        });
      }


      function addstock3(scene){
        var mesh;
        BABYLON.SceneLoader.ImportMesh("", "/usine3d/FromScratch/objlouis/", "stockage3.obj", scene, function(newMeshes) { //import de l'objt 3D .babylon , appel de fonction callBack OnSuccess
            mesh = newMeshes[0];
            mesh.type = "mesh";
            mesh.name = "mesh n° : " + Math.random();
            mesh.info = "je suis un mesh importé";
            mesh.informations = "<div style='overflow-x:auto;' id='infotemp'><p id='titleinfo'>"+mesh.type+"</p><p id='texteinfo'> <span> Nom </span>"+mesh.name+"<br> <span> Id </span>"+mesh.id+"<br> <span> Infos générales </span>"+mesh.info+"</p></div>";
            mesh.position = new BABYLON.Vector3(
                Math.random() * 100 * -1,
                0,
                Math.random() * 100 * -1,
            );
            mesh.scaling.x = 6;
            mesh.scaling.y = 6;
            mesh.scaling.z = 6;
            //scene.registerBeforeRender(objProperty()); //applique les propritétés de la fonction objProperty avant chaque render de frame
          });
        }


        function addcamera(scene){
          var mesh;
          BABYLON.SceneLoader.ImportMesh("", "/usine3d/FromScratch/objlouis/", "capteurCamera.obj", scene, function(newMeshes) { //import de l'objt 3D .babylon , appel de fonction callBack OnSuccess
              mesh = newMeshes[0];
              mesh.type = "mesh";
              mesh.name = "mesh n° : " + Math.random();
              mesh.info = "je suis un mesh importé";
              mesh.informations = "<div style='overflow-x:auto;' id='infotemp'><p id='titleinfo'>"+mesh.type+"</p><p id='texteinfo'> <span> Nom </span>"+mesh.name+"<br> <span> Id </span>"+mesh.id+"<br> <span> Infos générales </span>"+mesh.info+"</p></div>";
              mesh.position = new BABYLON.Vector3(
                  Math.random() * 100 * -1,
                  0,
                  Math.random() * 100 * -1,
              );
              mesh.scaling.x = 8;
              mesh.scaling.y = 8;
              mesh.scaling.z = 8;
              //scene.registerBeforeRender(objProperty()); //applique les propritétés de la fonction objProperty avant chaque render de frame
            });
          }


          function addcopilote(scene){
            var mesh;
            BABYLON.SceneLoader.ImportMesh("", "/usine3d/FromScratch/objlouis/", "bureauCopilote.obj", scene, function(newMeshes) { //import de l'objt 3D .babylon , appel de fonction callBack OnSuccess
                mesh = newMeshes[0];
                mesh.type = "mesh";
                mesh.name = "mesh n° : " + Math.random();
                mesh.info = "je suis un mesh importé";
                mesh.informations = "<div style='overflow-x:auto;' id='infotemp'><p id='titleinfo'>"+mesh.type+"</p><p id='texteinfo'> <span> Nom </span>"+mesh.name+"<br> <span> Id </span>"+mesh.id+"<br> <span> Infos générales </span>"+mesh.info+"</p></div>";
                mesh.position = new BABYLON.Vector3(
                    Math.random() * 100 * -1,
                    0,
                    Math.random() * 100 * -1,
                );
                mesh.scaling.x = 8;
                mesh.scaling.y = 8;
                mesh.scaling.z = 8;
                //scene.registerBeforeRender(objProperty()); //applique les propritétés de la fonction objProperty avant chaque render de frame
              });
            }


          function addrail(scene){
            var mesh;
            BABYLON.SceneLoader.ImportMesh("", "/usine3d/FromScratch/objlouis/", "railConditionnement.obj", scene, function(newMeshes) { //import de l'objt 3D .babylon , appel de fonction callBack OnSuccess
                mesh = newMeshes[0];
                mesh.type = "mesh";
                mesh.name = "mesh n° : " + Math.random();
                mesh.info = "je suis un mesh importé";
                mesh.informations = "<div style='overflow-x:auto;' id='infotemp'><p id='titleinfo'>"+mesh.type+"</p><p id='texteinfo'> <span> Nom </span>"+mesh.name+"<br> <span> Id </span>"+mesh.id+"<br> <span> Infos générales </span>"+mesh.info+"</p></div>";
                mesh.position = new BABYLON.Vector3(
                    Math.random() * 100 * -1,
                    0,
                    Math.random() * 100 * -1,
                );
                mesh.scaling.x = 8;
                mesh.scaling.y = 8;
                mesh.scaling.z = 8;
                //scene.registerBeforeRender(objProperty()); //applique les propritétés de la fonction objProperty avant chaque render de frame
              });
            }

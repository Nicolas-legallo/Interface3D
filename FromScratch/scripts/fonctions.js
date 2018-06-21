var canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas, true);
engine.enableOfflineSupport =false;


// MARCHE PAS
this.etatAlerte = function(newEtat){
    this.etat = newEtat;
    this.material.diffuseColor = new BABYLON.Color3(1,0,0);
   this.informations = "<div style='overflow-x:auto;' id='infotemp'><p id='titleinfo'>"+this.type+"</p><p id='texteinfo'> <span> Nom </span>"+this.name+"<br> <span> Id </span>"+this.id+"<br><img src='/usine3D/FromScratch/img/logo/Cloche_rouge16x16.png'> <span> Etat </span>"+this.etat+"<br> <span> Infos générales </span>"+this.info+"</p></div>";
   setBounce(this);

}

// FONCTIONS D'IMPORT D'OBJETS //////

    function addligneprod(scene) {
        var mesh;
        // The first parameter can be used to specify which mesh to import. Here we import all meshes
        BABYLON.SceneLoader.ImportMesh("", "/usine3d/FromScratch/objets/scenes/obj/", "ligneProd.obj", scene, function(newMeshes) { //import de l'objt 3D .babylon , appel de fonction callBack OnSuccess
            mesh = newMeshes[0];
            var mate = new BABYLON.StandardMaterial("mate",scene);
            mesh.material = mate;
            mate.diffuseColor = new BABYLON.Color3(0.7,1,1);
            mesh.type = "mesh";
            mesh.name = "mesh n° : " + Math.random();
            mesh.id = Math.random();
            mesh.info = "je suis un mesh importé";
            mesh.informations = "<div style='overflow-x:auto;' id='infotemp'><p id='titleinfo'>"+mesh.type+"</p><p id='texteinfo'> <span> Nom </span>"+mesh.name+"<br> <span> Id </span>"+mesh.id+"<br> <span> Infos générales </span>"+mesh.info+"</p></div>";
            mesh.position = new BABYLON.Vector3(
                Math.random() * 100 * -1,
                0,
                Math.random() * 100 * -1,
            );
            mesh.scaling.x = 4;
            mesh.scaling.y = 4;
            mesh.scaling.z = 4;
            mesh.pointflux = new BABYLON.Vector3(
              3,
              8,
              -30
            )
          });


    }


    function addchariot(scene){
      var mesh;
      BABYLON.SceneLoader.ImportMesh("", "/usine3d/FromScratch/objets/", "camion.obj", scene, function(newMeshes) { //import de l'objt 3D .babylon , appel de fonction callBack OnSuccess
          mesh = newMeshes[0];
          mesh.material = new BABYLON.StandardMaterial("mat",scene);
          mesh.material.diffuseColor = new BABYLON.Color3(1,1,0);
          mesh.type = "mesh";
          mesh.name = "mesh n° : " + Math.random();
          mesh.id=Math.random();
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
          mesh.pointflux = new BABYLON.Vector3(
            0,
            3,
            0
          );
        });
  }

  function addstock1(scene){
    var mesh;
    BABYLON.SceneLoader.ImportMesh("", "/usine3d/FromScratch/objlouis/", "stockage.obj", scene, function(newMeshes) { //import de l'objt 3D .babylon , appel de fonction callBack OnSuccess
        mesh = BABYLON.Mesh.MergeMeshes(newMeshes);
        mesh.material = new BABYLON.StandardMaterial("mat",scene);
        mesh.material.diffuseColor = new BABYLON.Color3(1,1,0.7);
        mesh.type = "mesh";
        mesh.name = "mesh n° : " + Math.random();
        mesh.id = Math.random();
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
        mesh.pointflux = new BABYLON.Vector3(
          0,
          5,
          0
        );
      });
    }

    function addstock2(scene){
      var mesh;
      BABYLON.SceneLoader.ImportMesh("", "/usine3d/FromScratch/objets/test_export/", "remesh.obj", scene, function(newMeshes) { //import de l'objt 3D .babylon , appel de fonction callBack OnSuccess
          mesh = newMeshes[0];
          mesh.material = new BABYLON.StandardMaterial("mate",scene);
          mesh.material.diffuseColor = new BABYLON.Color3(0,1,0);
          mesh.type = "mesh";
          mesh.name = "mesh n° : " + Math.random();
          mesh.id = Math.random();
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
          mesh.pointflux = new BABYLON.Vector3(
            0,
            5,
            0
          )
        });
      }


      function addstock3(scene){
        var mesh;
        BABYLON.SceneLoader.ImportMesh("", "/usine3d/FromScratch/objlouis/", "stockage3.obj", scene, function(newMeshes) { //import de l'objt 3D .babylon , appel de fonction callBack OnSuccess
            mesh = BABYLON.Mesh.MergeMeshes(newMeshes);
            mesh.material = new BABYLON.StandardMaterial("mat",scene);
            mesh.material.diffuseColor = new BABYLON.Color3(0.8,0.8,0.5);
            mesh.type = "mesh";
            mesh.name = "mesh n° : " + Math.random();
            mesh.id = Math.random();
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
            mesh.pointflux = new BABYLON.Vector3(
              0,
              5,
              0
            )
          });
        }


        function addcamera(scene){
          var mesh;
          BABYLON.SceneLoader.ImportMesh("", "/usine3d/FromScratch/objlouis/", "capteurCamera.obj", scene, function(newMeshes) { //import de l'objt 3D .babylon , appel de fonction callBack OnSuccess
              mesh = newMeshes[0];
              mesh.material = new BABYLON.StandardMaterial("mat",scene);
              mesh.material.diffuseColor = new BABYLON.Color3(0.5,0.5,0.8);
              mesh.type = "mesh";
              mesh.name = "mesh n° : " + Math.random();
              mesh.id = Math.random();
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
              mesh.pointflux = new BABYLON.Vector3(
                0,
                3,
                0
              )
            });
          }


          function addcopilote(scene){
            var mesh;
            BABYLON.SceneLoader.ImportMesh("", "/usine3d/FromScratch/objlouis/", "bureauCopilote.obj", scene, function(newMeshes) { //import de l'objt 3D .babylon , appel de fonction callBack OnSuccess
                mesh = BABYLON.Mesh.MergeMeshes(newMeshes);
                mesh.type = "mesh";
                mesh.name = "mesh n° : " + Math.random();
                mesh.id= Math.random();
                mesh.info = "je suis un mesh importé";
                mesh.informations = "<div style='overflow-x:auto;' id='infotemp'><p id='titleinfo'>"+mesh.type+"</p><p id='texteinfo'> <span> Nom </span>"+mesh.name+"<br> <span> Id </span>"+mesh.id+"<br> <span> Infos générales </span>"+mesh.info+"</p></div>";
                mesh.position = new BABYLON.Vector3(
                    Math.random() * 100 * -1,
                    0,
                    Math.random() * 100 * -1,
                );
                mesh.scaling.x = 3;
                mesh.scaling.y = 3;
                mesh.scaling.z = 3;
                mesh.pointflux = new BABYLON.Vector3(
                  0,
                  4,
                  0
                )
              });
            }


          function addrail(scene){
            var mesh;
            BABYLON.SceneLoader.ImportMesh("", "/usine3d/FromScratch/objlouis/", "railConditionnement.obj", scene, function(newMeshes) { //import de l'objt 3D .babylon , appel de fonction callBack OnSuccess
                mesh =BABYLON.Mesh.MergeMeshes(newMeshes);
                mesh.material =new BABYLON.StandardMaterial("mate",scene);
                mesh.material.diffuseColor = new BABYLON.Color3.Black();
                mesh.type = "mesh";
                mesh.name = "mesh n° : " + Math.random();
                mesh.id = Math.random();
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
                mesh.pointflux = new BABYLON.Vector3(
                  0,
                  0.5,
                  0
                )
              });
            }


            function addcuisine(scene){
              var mesh;
              BABYLON.SceneLoader.ImportMesh("", "/usine3d/FromScratch/objlouis/", "cuisiniere.obj", scene, function(newMeshes) { //import de l'objt 3D .babylon , appel de fonction callBack OnSuccess
                  mesh =BABYLON.Mesh.MergeMeshes(newMeshes);
                  mesh.material =new BABYLON.StandardMaterial("mate",scene);
                  // mesh.material.diffuseColor = new BABYLON.Color3.Black();
                  mesh.type = "mesh";
                  mesh.name = "mesh n° : " + Math.random();
                  mesh.id = Math.random();
                  mesh.info = "je suis un mesh importé";
                  mesh.informations = "<div style='overflow-x:auto;' id='infotemp'><p id='titleinfo'>"+mesh.type+"</p><p id='texteinfo'> <span> Nom </span>"+mesh.name+"<br> <span> Id </span>"+mesh.id+"<br> <span> Infos générales </span>"+mesh.info+"</p></div>";
                  mesh.position = new BABYLON.Vector3(
                      Math.random() * 100 * -1,
                      0,
                      Math.random() * 100 * -1,
                  );
                  mesh.scaling.x = 3;
                  mesh.scaling.y = 3;
                  mesh.scaling.z = 3;
                  mesh.pointflux = new BABYLON.Vector3(
                    0,
                    0.5,
                    0
                  )
                });
              }
              function addpalette(scene){
                var mesh;
                BABYLON.SceneLoader.ImportMesh("", "/usine3d/FromScratch/objlouis/", "palette.obj", scene, function(newMeshes) { //import de l'objt 3D .babylon , appel de fonction callBack OnSuccess
                    mesh =BABYLON.Mesh.MergeMeshes(newMeshes);
                    mesh.material =new BABYLON.StandardMaterial("mate",scene);
                    // mesh.material.diffuseColor = new BABYLON.Color3.Black();
                    mesh.type = "mesh";
                    mesh.name = "mesh n° : " + Math.random();
                    mesh.id = Math.random();
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
                    mesh.pointflux = new BABYLON.Vector3(
                      0,
                      0.5,
                      0
                    )
                  });
                }


                function addcuve(scene){
                  var mesh;
                  BABYLON.SceneLoader.ImportMesh("", "/usine3d/FromScratch/", "cuve.obj", scene, function(newMeshes) { //import de l'objt 3D .babylon , appel de fonction callBack OnSuccess
                      mesh =BABYLON.Mesh.MergeMeshes(newMeshes);
                      mesh.material =new BABYLON.StandardMaterial("mate",scene);
                      // mesh.material.diffuseColor = new BABYLON.Color3.Black();
                      mesh.type = "mesh";
                      mesh.name = "mesh n° : " + Math.random();
                      mesh.id = Math.random();
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
                      mesh.pointflux = new BABYLON.Vector3(
                        0,
                        0.5,
                        0
                      )
                    });
                  }

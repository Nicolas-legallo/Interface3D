/***************************************

  Script principal, majoritairement composé de fonctions BabylonJS.
  Permet la création de la scène 3D et la gestion de tout ce qu'il s'y passe.


  ***********************************************************/

  //window.addEventListener("load", CreationPage); // dès le chargement de la page on appelle la fonction de construction.js pour construire le html autour du canvas



var canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas, true);
var selectedMesh;
var bounce = false;




// Fonction principale du programme, retourne une scène possédant tous les paramètres et les attributs déclarés dans le corps de la fonction
var createScene = function() {


    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);

    // DIFFERENTES COULEURS D'environnement

    //  scene.clearColor = new BABYLON.Color4(0,0,0,0.0000000000000001); //rend l'environnement exterieur transparent ( de base c'est bleu foncé)
    scene.clearColor = new BABYLON.Color3(0.8, 0.8, 0.8);


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


    var light = new BABYLON.DirectionalLight("light1", new BABYLON.Vector3(0, 1, 1), scene);
    light.direction = new BABYLON.Vector3(-1.0, -1.0, 1.0);
    light.intensity = 1;




    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////    Création des ombres //////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    var shadowGenerator = new BABYLON.ShadowGenerator(512, light);
    shadowGenerator.usePoissonSampling = true;
    shadowGenerator.useBlurExponentialShadowMap = true;
    shadowGenerator.useContactHardeningShadow = true;
    shadowGenerator.filteringQuality = BABYLON.ShadowGenerator.QUALITY_LOW;


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////  Gestion de l'objet selectionné     ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Fonction qui modifie la taille de l'ojet sélectionné
    function modifyScaling(xx, yy, zz) {
        selectedMesh.scaling.x = xx;
        selectedMesh.scaling.y = yy;
        selectedMesh.scaling.z = zz;


        for (var i = selectedMesh.actionManager.actions.length - 1; i > 0; i--) {
            selectedMesh.actionManager.actions.splice(i, 1); //on parcourt toutes les actions attribuées à l'objet et on les supprime toutes pour éviter des problèmes de concurrence et de redondance
        }
          //On réattribue  les propriétés graphiques (surtout celle d'agrandissement au survol qui subit une modification pour s'adapter à la nouvelle taille de l'objet)
        selectedMesh.actionManager.registerAction(new BABYLON.SetValueAction(
            BABYLON.ActionManager.OnPointerOutTrigger, selectedMesh.material, "emissiveColor", selectedMesh.material.emissiveColor)); //Attribut emissive color : valeur de bse lorsque la souris n'est pas sur le mesh
        selectedMesh.actionManager.registerAction(new BABYLON.SetValueAction(
            BABYLON.ActionManager.OnPointerOverTrigger, selectedMesh.material, "emissiveColor", BABYLON.Color3.White())); // Attribut emissive color :  blanche lorsque la souris est sur le mesh
        selectedMesh.actionManager.registerAction(new BABYLON.SetValueAction(
            BABYLON.ActionManager.OnPointerOutTrigger, selectedMesh, "scaling", new BABYLON.Vector3(selectedMesh.scaling.x, selectedMesh.scaling.y, selectedMesh.scaling.z))); //Scaling : scaling de base lorsque la souris n'est pas sur le mesh
        selectedMesh.actionManager.registerAction(new BABYLON.SetValueAction(
            BABYLON.ActionManager.OnPointerOverTrigger, selectedMesh, "scaling", new BABYLON.Vector3(selectedMesh.scaling.x * 1.1, selectedMesh.scaling.y * 1.1, selectedMesh.scaling.z * 1.1))); //Scaling : scaling de base légèrement augmenté lorsque la souris est sur le mesh

        selectedMesh.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPickTrigger, light, "diffuse", BABYLON.Color3.White(), 1)) // ne sert à priori à rien mais ça marche bien ^^
            .then(new BABYLON.CombineAction(BABYLON.ActionManager.NothingTrigger, [ // Then is used to add a child action used alternatively with the root action.
                new BABYLON.SetValueAction(BABYLON.ActionManager.NothingTrigger, selectedMesh.material, "wireframe", false)
            ]));
        selectedMesh.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPickTrigger, selectedMesh.material, "wireframe", true)).then(new BABYLON.DoNothingAction()); //lorsque on clique sur le mesh, affiche son """squelette""", puis revient à la normale lorsqu'on reclique

        shadowGenerator.getShadowMap().renderList.push(selectedMesh); //ajoute l'objet à la liste des objets produisant des ombresss

    }

// fonction qui modifie la rotation de l'objet sélectionné, on gère toutes les valeurs du formulaire possibles
    function modifyRotation(xx, yy, zz) {

      if (xx != 0 && yy == 0 && zz == 0){
        selectedMesh.rotate(BABYLON.Axis.X,xx/57,BABYLON.Space.WORLD); //Fonction de rotation de babylon, le premier paramètre est l'axe de roation,
                                                                        //le deuxième est l'angle en radian (donc on divise la valeur en paramètre par 57 car elle est rentrée en degrés)
                                                                        //et le troisième est le référentiel de rotation ( local ou global)
      }
      if( xx == 0 && yy != 0 && zz == 0){
        selectedMesh.rotate(BABYLON.Axis.Y,yy/57,BABYLON.Space.WORLD);
      }

      if (xx == 0 && yy == 0 && zz != 0) {
        selectedMesh.rotate(BABYLON.Axis.Z, zz/57, BABYLON.Space.WORLD);
      }

      if ( xx != 0 && yy != 0 && zz == 0){
        selectedMesh.rotate(BABYLON.Axis.X,xx/57,BABYLON.Space.WORLD);
        selectedMesh.rotate(BABYLON.Axis.Y,yy/57,BABYLON.Space.WORLD);
      }

      if ( xx != 0 && yy == 0 && zz != 0){
        selectedMesh.rotate(BABYLON.Axis.X,xx/57,BABYLON.Space.WORLD);
        selectedMesh.rotate(BABYLON.Axis.Z, zz/57, BABYLON.Space.WORLD);
      }

      if ( xx == 0 && yy != 0 && zz != 0){
        selectedMesh.rotate(BABYLON.Axis.Y,yy/57,BABYLON.Space.WORLD);
        selectedMesh.rotate(BABYLON.Axis.Z, zz/57, BABYLON.Space.WORLD);
      }

      if ( xx != 0 && yy != 0 && zz != 0) {
        selectedMesh.rotate(BABYLON.Axis.X,xx/57,BABYLON.Space.WORLD);
        selectedMesh.rotate(BABYLON.Axis.Y,yy/57,BABYLON.Space.WORLD);
        selectedMesh.rotate(BABYLON.Axis.Z, zz/57, BABYLON.Space.WORLD);
      }
    }

//fonction qui supprime l'objet sélectionné
    function deleteMesh() {
        selectedMesh.dispose();
    }


// Fonction qui fait "rebondir" l'objet sélectionné via une animation BabylonJS
    function setBounce() {
        const mesh = selectedMesh;
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
 var boxx = BABYLON.Mesh.CreateBox('box',10,scene);
 boxx.material = new BABYLON.StandardMaterial("mat", scene);
 boxx.material.emissiveColor = new BABYLON.Color3(1, 0, 0);

 boxx.actionManager = new BABYLON.ActionManager(scene);
 boxx.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOutTrigger, boxx.material, "emissiveColor", boxx.material.emissiveColor));
 boxx.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOverTrigger, boxx.material, "emissiveColor", BABYLON.Color3.White()));

//Fonction qui crée des cubes
    function addBox() {

        var box = BABYLON.Mesh.CreateBox('box', 10, scene);
        var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(box, 1024, 1024, false);
        box.type = "box";
        box.name = "box n° " + Math.random();
        box.info = "je suis un cube généré via babylon";
        box.informations = "<div style='overflow-x:auto;' id='infotemp'><table> <tr>  <th>Nom de l'objet</th> <th>id de l'objet</th> <th>Autre infos</th></tr><tr> <td>" + box.name + "</td><td>" + box.id + "</td><td>" + box.info + " </tr></table></div>";
        box.position = new BABYLON.Vector3( // positionne les objets de façon aléatoire pour éviter la superposition
            Math.random() * 100,
            5, //la position en Y doit être égale à la moitié de la taille de l'objet si on veut que celui-ci soit posé sur le sol
            Math.random() * 100,
        );

        // On attribue des propriétés graphiques à l'objet créé
        box.material = new BABYLON.StandardMaterial("mat", scene);
        box.material.emissiveColor = new BABYLON.Color3(1, 1, 0);

        box.actionManager = new BABYLON.ActionManager(scene);
        box.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOutTrigger, box.material, "emissiveColor", box.material.emissiveColor));
        box.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOverTrigger, box.material, "emissiveColor", BABYLON.Color3.White()));
        box.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOutTrigger, box, "scaling", new BABYLON.Vector3(box.scaling.x, box.scaling.y, box.scaling.z), 150));
        box.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOverTrigger, box, "scaling", new BABYLON.Vector3(box.scaling.x + box.scaling.x * 0.1, box.scaling.y + box.scaling.y * 0.1, box.scaling.z + box.scaling.z * 0.1), 150));


        box.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPickTrigger, light, "diffuse", BABYLON.Color3.White(), 1))
            .then(new BABYLON.CombineAction(BABYLON.ActionManager.NothingTrigger, [ // Then is used to add a child action used alternatively with the root action.
                new BABYLON.SetValueAction(BABYLON.ActionManager.NothingTrigger, box.material, "wireframe", false)
            ]));
        box.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPickTrigger, box.material, "wireframe", true)).then(new BABYLON.DoNothingAction());


        shadowGenerator.getShadowMap().renderList.push(box); //ajoute l'objet à la liste des objets produisant des ombres

    }

    var count;

    // Fonction qui crée un rectangle entre 2 points sélectionnés.
    function addWall(){
      count = 0;
      var box;
      var startPoint = new BABYLON.Vector3(0, 0, 0);
      canvas.addEventListener("click", wall);
      }

      function wall(){
        var pickResult = scene.pick(scene.pointerX, scene.pointerY);
        // if (!pickResult.hit) {
        //   return;
        // }
        if(count){
          // Atrribution des propriétés graphiques
            var material = new BABYLON.StandardMaterial("matbox",scene);
            box.material = material;
            box.material.emissiveColor = new BABYLON.Color3(1,.1,.1);
            box.actionManager = new BABYLON.ActionManager(scene);
            box.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOutTrigger, box.material, "emissiveColor", box.material.emissiveColor));
            box.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOverTrigger, box.material, "emissiveColor", BABYLON.Color3.Red()));


            box.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPickTrigger, light, "diffuse", BABYLON.Color3.White(), 1))
                .then(new BABYLON.CombineAction(BABYLON.ActionManager.NothingTrigger, [ // Then is used to add a child action used alternatively with the root action.
                    new BABYLON.SetValueAction(BABYLON.ActionManager.NothingTrigger, box.material, "wireframe", false)
                ]));
            box.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPickTrigger, box.material, "wireframe", true)).then(new BABYLON.DoNothingAction());
            shadowGenerator.getShadowMap().renderList.push(box); //ajoute l'objet à la liste des objets produisant des ombres

            //Orientation et redimension du mur
            console.log('second click!');
            var pos = pickResult.pickedPoint.clone();
            box.lookAt(pos, Math.PI*.5);
            var dist = BABYLON.Vector3.Distance(pos, box.position);
            box.setPivotPoint(new BABYLON.Vector3(-.5,0,0));
            box.computeWorldMatrix();
            box.position.y = 7.5;
            box.scaling.x = dist;
            box.scaling.y = 15;
            box.scaling.z = 5;
            count = 0;
            canvas.removeEventListener("click",wall);
        }else{
            // création du point de départ au premier clic
            console.log('first click!');
            box = BABYLON.Mesh.CreateBox("box", 1, scene);
            box.id = "mur";
            box.scaling.x = .1;
            box.position = pickResult.pickedPoint;
            count++;
        }
      }


// Fonction qui crée des sphères
    function addSphere() {
        var sphere = BABYLON.Mesh.CreateSphere('sphere', 16, 6, scene);
        sphere.type = "sphere";
        sphere.name = "sphere n° : " + Math.random();
        sphere.info = "je suis une sphère générée via babylon";
        sphere.informations = "<div style='overflow-x:auto;' id='infotemp'><table> <tr>  <th>Nom de l'objet</th> <th>id de l'objet</th> <th>Autre infos</th></tr><tr> <td>" + sphere.name + "</td><td>" + sphere.id + "</td><td>" + sphere.info + " </tr></table></div>";
        sphere.position = new BABYLON.Vector3(
            Math.random() * 100 * -1,
            3,
            Math.random() * 100,
        );

        // On attribue des propriétés graphiques à l'objet créé

        sphere.material = new BABYLON.StandardMaterial("mat", scene);
        sphere.material.emissiveColor = new BABYLON.Color3(0, 0, 1);

        sphere.actionManager = new BABYLON.ActionManager(scene);
        sphere.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOutTrigger, sphere.material, "emissiveColor", sphere.material.emissiveColor));
        sphere.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOverTrigger, sphere.material, "emissiveColor", BABYLON.Color3.White()));
        sphere.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOutTrigger, sphere, "scaling", new BABYLON.Vector3(sphere.scaling.x, sphere.scaling.y, sphere.scaling.z), 150));
        sphere.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOverTrigger, sphere, "scaling", new BABYLON.Vector3(sphere.scaling.x + sphere.scaling.x * 0.1, sphere.scaling.y + sphere.scaling.y * 0.1, sphere.scaling.z + sphere.scaling.z * 0.1), 150));

        sphere.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPickTrigger, light, "diffuse", BABYLON.Color3.White(), 1))
            .then(new BABYLON.CombineAction(BABYLON.ActionManager.NothingTrigger, [ // Then is used to add a child action used alternatively with the root action.
                new BABYLON.SetValueAction(BABYLON.ActionManager.NothingTrigger, sphere.material, "wireframe", false)
            ]));
        sphere.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPickTrigger, sphere.material, "wireframe", true)).then(new BABYLON.DoNothingAction());

        shadowGenerator.getShadowMap().renderList.push(sphere); //ajoute l'objet à la liste des objets qui produisent des ombres


    }

// Fonction qui importe des .obj ou des .babylon en tant que mesh
    function addObj() {
        var mesh;
        // The first parameter can be used to specify which mesh to import. Here we import all meshes
        BABYLON.SceneLoader.ImportMesh("", "/usine3d/FromScratch/objets/", "camion.obj", scene, function(newMeshes) { //import de l'objt 3D .babylon , appel de fonction callBack OnSuccess
            mesh = newMeshes[0];
            mesh.type = "mesh";
            mesh.name = "mesh n° : " + Math.random();
            mesh.info = "je suis un mesh importé";
            mesh.informations = "<div style='overflow-x:auto;' id='infotemp'><table> <tr>  <th>Nom de l'objet</th> <th>id de l'objet</th> <th>Autre infos</th></tr><tr> <td>" + mesh.name + "</td><td>" + mesh.id + "</td><td>" + mesh.info + " </tr></table></div>";
            mesh.position = new BABYLON.Vector3(
                Math.random() * 100 * -1,
                0,
                Math.random() * 100 * -1,
            );
            mesh.scaling.x = 15;
            mesh.scaling.y = 15;
            mesh.scaling.z = 15;
            scene.registerBeforeRender(objProperty()); //applique les propritétés de la fonction objProperty avant chaque render de frame
          });

        // On attribue des propriétés graphiques à l'objet créé
        function objProperty() {
            var material = new BABYLON.StandardMaterial("material01", scene);
            mesh.material = material;
            mesh.actionManager = new BABYLON.ActionManager(scene);
            mesh.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOutTrigger, mesh.material, "emissiveColor", mesh.material.emissiveColor));
            mesh.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOverTrigger, mesh.material, "emissiveColor", BABYLON.Color3.White()));

            mesh.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOutTrigger, mesh, "scaling", new BABYLON.Vector3(mesh.scaling.x, mesh.scaling.y, mesh.scaling.z), 150));
            mesh.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOverTrigger, mesh, "scaling", new BABYLON.Vector3(mesh.scaling.x + mesh.scaling.x * 0.1, mesh.scaling.y + mesh.scaling.y * 0.1, mesh.scaling.z + mesh.scaling.z * 0.1), 150));

            mesh.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPickTrigger, light, "diffuse", BABYLON.Color3.White(), 1))
                .then(new BABYLON.CombineAction(BABYLON.ActionManager.NothingTrigger, [ // Then is used to add a child action used alternatively with the root action.
                    new BABYLON.SetValueAction(BABYLON.ActionManager.NothingTrigger, mesh.material, "wireframe", false)
                ]));
            mesh.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPickTrigger, mesh.material, "wireframe", true)).then(new BABYLON.DoNothingAction());

            shadowGenerator.getShadowMap().renderList.push(mesh); //ajoute l'objet à la liste des objets qui produisent des ombres


        }
    }
    //////////////////////////////////////////////////////////////////////:
    // GESTION DES PARTICULES   ////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////

    // Create a particle system
    var particleSystem = new BABYLON.ParticleSystem("particles", 2000, scene);

    //Texture of each particle
    particleSystem.particleTexture = new BABYLON.Texture("/usine3D/FromScratch/textures/flares.png", scene);

    // Where the particles come from
    particleSystem.minEmitBox = new BABYLON.Vector3(1, 0, 0); // Starting all from
    particleSystem.maxEmitBox = new BABYLON.Vector3(1, 0, 0); // To...

    // Colors of all particles
    particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
    particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
    particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);

    // Size of each particle (random between...
    particleSystem.minSize = 0.3;
    particleSystem.maxSize = 0.8;

    // Life time of each particle (random between...
    particleSystem.minLifeTime = 0.2;
    particleSystem.maxLifeTime = 0.7;

    // Emission rate
    particleSystem.emitRate = 3000;

    // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
    particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

    // Set the gravity of all particles
    particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);

    // Direction of each particle after it has been emitted
    particleSystem.direction1 = new BABYLON.Vector3(0, 0, 0);
    particleSystem.direction2 = new BABYLON.Vector3(0, 0, 0);

    // Angular speed, in radians
    particleSystem.minAngularSpeed = 0;
    particleSystem.maxAngularSpeed = Math.PI;

    // Speed
    particleSystem.minEmitPower = 1;
    particleSystem.maxEmitPower = 3;
    particleSystem.updateSpeed = 0.005;




    /******************************************************************
     * Creation de flux, méthode de la sphère animée entre deux points *
     ******************************************************************/



    var meshesFlux = []; //tableau des objets sélectionnées (points A et B du flux)
    var there;

    function Flux() { // fonction principale qui lance la sélection puis appelle la fonction de création de flux

        meshesFlux.length = 0;
        there = false;
        canvas.addEventListener("dblclick", selectionFlux);
    }

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


    function createFlux() { // fonction de création de flux, définit l'animation et la lance.

        const pSource = meshesFlux[0].position; // le point A est le premier objet de la liste
        const pDestination = meshesFlux[1].position; // le point B est le deuxième objet de la liste
        const sphere = BABYLON.Mesh.CreateSphere("fluxhandler", 20, 4.0, scene); // crée une sphère, qui sera la source des particules

        /* PARTICULES ASSOCIEES A LA SPHERE */
        var ps = new BABYLON.ParticleSystem("stream", 2000, scene);
        ps.particleTexture = new BABYLON.Texture("/usine3D/FromScratch/textures/flares.png", scene);


        // Colors of all particles
        ps.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
        ps.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
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
  });




    $("#renderCanvas").contextmenu(function(evt) { //on écoute l'évènement de clic droit.
        evt.preventDefault(); // empêche d'afficher l'action par défaut de l'évènement rightclick, cad aficher le menu contextuel.
        var pickResult2 = scene.pick(scene.pointerX, scene.pointerY);
        if (pickResult2.hit) {
            $("#infotemp").remove();
            $("#infosmesh").append(pickResult2.pickedMesh.informations);
            $("#infotemp").css({
                'left': evt.pageX,
                'top': evt.pageY
            });
        }
    });



    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////      Gestion du sol           /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
    var ground = BABYLON.Mesh.CreateGround("ground1", 300, 300, 2, scene);
    var groundMat = new BABYLON.StandardMaterial("groundMat", scene);
    //INSERTION DU PLAN
    groundMat.ambientTexture = new BABYLON.Texture("/usine3D/FromScratch/plan.png", scene);

    ground.material = groundMat
    ground.receiveShadows = true; //affiche les ombres sur le sol




//Affichage du plan ou non

    function checkGround() {
        if ($("#checkground")[0].checked != false) {
            ground.material = new BABYLON.StandardMaterial("material", scene);
        }
        if ($("#checkground")[0].checked == false) {
            ground.material = groundMat;
        }
    }


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //         Drag'n'drop                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



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
});



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//     redimension des objets en fonction de la fenetre   ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$(window).resize(function(){
  engine.resize();
});

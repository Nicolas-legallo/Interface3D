/***************************************

  Script principal, majoritairement composé de fonctions BabylonJS.
  Permet la création de la scène 3D et la gestion de tout ce qu'il s'y passe.


  ***********************************************************/
var canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas, true);
var selectedMesh;
var bounce = false;
var masquer = false;
var imported = false; //permet de vérifier si on a déjà des objets importés du json sur la scène
engine.enableOfflineSupport = false;



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


    var light = new BABYLON.PointLight("pointlight", new BABYLON.Vector3(-350, 500, 250), scene);
    light.specular = new BABYLON.Color3(0, 0, 0);
    light.intensity = 0.6;

    var light2 = new BABYLON.PointLight("pointlight2", new BABYLON.Vector3(350, 500, -250), scene);
    light2.specular = new BABYLON.Color3(0, 0, 0);
    light2.intensity = 0.3;

    // var light3 = new BABYLON.PointLight("pointlight3", new BABYLON.Vector3(350, 500, 250), scene);
    // light3.specular = new BABYLON.Color3(0, 0, 0);
    // light3.intensity = 0.3;
    //
    // var light4 = new BABYLON.PointLight("pointlight4", new BABYLON.Vector3(-350, 500, -250), scene);
    // light4.specular = new BABYLON.Color3(0, 0, 0);
    // light4.intensity = 0.3;


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

    // Ecouteur d'évènement global (sur toute la fenêtre) qui va redéfinir SelectedMesh si la souris clique sur un mesh (hit)
    // Indispensable pour de très nombreuses fonctions du programme
    var scaleX, scaleY, scaleZ;
    window.addEventListener("click", function() {
        var pickResult = scene.pick(scene.pointerX, scene.pointerY);
        if (pickResult.hit && pickResult.pickedMesh.name != ground.name) {
            selectedMesh = pickResult.pickedMesh; //SelectedMesh prend la valeur de l'objet sur lequel on a cliqué (l'objet sélectionné)
            scaleX = selectedMesh.scaling.x;
            scaleZ = selectedMesh.scaling.z;
            scaleY = selectedMesh.scaling.y;
            $("#scalingX").val(scaleX); //on affiche la taille de l'objet sélectionné dans le formulaire de modification de taille
            $("#scalingY").val(scaleY);
            $("#scalingZ").val(scaleZ);
        }
    });



    //Fonction qui modifie la taille de l'ojet sélectionné
    function modifyScaling(xx, yy, zz) {
        selectedMesh.scaling.x = xx;
        selectedMesh.scaling.y = yy;
        selectedMesh.scaling.z = zz;

        shadowGenerator.getShadowMap().renderList.push(selectedMesh); //ajoute l'objet à la liste des objets produisant des ombresss
        // shadowGenerator2.getShadowMap().renderList.push(selectedMesh);
        // shadowGenerator3.getShadowMap().renderList.push(selectedMesh);
        // shadowGenerator4.getShadowMap().renderList.push(selectedMesh);

    }

    // fonction qui modifie la rotation de l'objet sélectionné, on gère toutes les valeurs du formulaire possibles
    function modifyRotation(xx, yy, zz) {

        if (xx != 0 && yy == 0 && zz == 0) { //si on fait rotate en X
            selectedMesh.rotate(BABYLON.Axis.X, xx / 57.29, BABYLON.Space.WORLD); //Fonction de rotation de babylon, le premier paramètre est l'axe de roation,
            //le deuxième est l'angle en radian (donc on divise la valeur en paramètre par 57 car elle est rentrée en degrés)
            //et le troisième est le référentiel de rotation ( local ou global)
        }
        if (xx == 0 && yy != 0 && zz == 0) { // rotate en Y
            selectedMesh.rotate(BABYLON.Axis.Y, yy / 57.29, BABYLON.Space.WORLD);
        }

        if (xx == 0 && yy == 0 && zz != 0) { //rotate en Z
            selectedMesh.rotate(BABYLON.Axis.Z, zz / 57.29, BABYLON.Space.WORLD);
        }

        if (xx != 0 && yy != 0 && zz == 0) { // rotate en X et en Y
            selectedMesh.rotate(BABYLON.Axis.X, xx / 57.29, BABYLON.Space.WORLD);
            selectedMesh.rotate(BABYLON.Axis.Y, yy / 57.29, BABYLON.Space.WORLD);
        }

        if (xx != 0 && yy == 0 && zz != 0) { //rotate en X et en Z
            selectedMesh.rotate(BABYLON.Axis.X, xx / 57.29, BABYLON.Space.WORLD);
            selectedMesh.rotate(BABYLON.Axis.Z, zz / 57.29, BABYLON.Space.WORLD);
        }

        if (xx == 0 && yy != 0 && zz != 0) { //rotate en Y et en Z
            selectedMesh.rotate(BABYLON.Axis.Y, yy / 57.29, BABYLON.Space.WORLD);
            selectedMesh.rotate(BABYLON.Axis.Z, zz / 57.29, BABYLON.Space.WORLD);
        }

        if (xx != 0 && yy != 0 && zz != 0) { //rotate en X Y et Z
            selectedMesh.rotate(BABYLON.Axis.X, xx / 57.29, BABYLON.Space.WORLD);
            selectedMesh.rotate(BABYLON.Axis.Y, yy / 57.29, BABYLON.Space.WORLD);
            selectedMesh.rotate(BABYLON.Axis.Z, zz / 57.29, BABYLON.Space.WORLD);
        }
    }

    //fonction qui supprime l'objet sélectionné
    function deleteMesh() {
        if (selectedMesh != ground) { // le sol est considéré comme un mesh par BABYLON, mais on ne veut pas qu'il puisse être supprimé.
            selectedMesh.dispose(); //fonction de suppression de mesh de BABYLON
        }
    }


    var here; //variable permettant d'indiquer si un objt est déjà dans la liste, ce qui évite la redondance et la double sélection d'un même objet
    var selectedmeshes = []; //liste vide, déstinée à accueillir les objets sélectionnés

    // Fonction principale de jointure de meshes, appelle d'abord la fonction de sélection qui remplit la liste puis appelle la fonction récursive qui va lier les éléments de la liste
    function joinMeshes() {
        selectedmeshes.length = 0; //réinitialise le tableau en le vidant.
        here = false; //on réinitialisé la valeur de here
        canvas.addEventListener("dblclick", selection); //chaque doubleclick lance la fontion selection()
    }

    //Fonction appelée à chaque dblclick qui ajoute le mesh selectionné à la liste des mesh s'il n'y est pas déjà présent
    function selection() {
        for (var i = 0; i < selectedmeshes.length; i++) { // on parcourt la liste
            if (selectedmeshes[i].name == selectedMesh.name) { // si l'objet sélectionné est déjà présent, here prend la valeur vrai
                here = true;
            }
        }
        if (here == false) {
            selectedmeshes.push(selectedMesh); //si l'élément sélectionné n'est pas déjà présent dans la liste alors on l'ajoute à la liste
            console.log("ajouté " + selectedMesh.name);
        }
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


    /************************* IMPORT DU JSON  ***********************************************************************************************************************************/
    function LoadJson(){
      var objet;

      var requete = new XMLHttpRequest(); //on adresse une requete XML Http pour récuperer le json
      requete.open("GET","scripts/objets.json"); /* cette requete utilisera la méthode GET, et devra aller à l'adresse scripts/objets.json
                                                (ici on est dans des fichiers, mais ça aurait pu être un url) */

      requete.responseType ='json'; //on indique que le type de la réponse qui sera faite à la requête est JSON
      requete.send(); //envoie de la requête

      requete.onload = function(){ // tous les éléments liés à la requête ou sa réponse doivent se situer dans cette fonction, qui se déclenche quand la requête est envoyée

        objet = requete.response; // la variable objet contient toute la structure de notre fichier JSON
        var i;

        function addMeshJson(o) { /*Fonction qui permet d'appeler la fonction d'import, en lui fournissant un paramètre supplémentaire :
                                Un objet duquel on va récupérer tous les attributs à appliquer au nouvel objet sur la scène */
          BABYLON.SceneLoader.ImportMesh("", o.chemin, o.nomrelatif, scene, function(newMeshes) { //import de l'objet 3D , appel de fonction callBack OnSuccess

            var mesh = newMeshes[0]; //mesh prend la valeur du nouvel objet qu'on vient d'importer sur la scène
            mesh.material = new BABYLON.StandardMaterial("mate",scene); //on attribue un Material à cet objet
            mesh.material.diffuseColor = new BABYLON.Color3(Number(o.couleur.r),Number(o.couleur.g),Number(o.couleur.b)); // ce qui nous permet de lui ajouter une couleur, ici bleue
            mesh.type = o.type; // le type du nouvel objet devient le type de l'objet Json correspondant
            mesh.name = o.nom; // pareil pour son nom
            mesh.id = o.nom;
            mesh.etat = o.etat; // et son état
            mesh.position.x = Number(o.position.x); //ici on caste la position en tant que nombre, sinon il l'inteprète en tant que string
            mesh.position.y = Number(o.position.y);
            mesh.position.z = Number(o.position.z);
            mesh.scaling.x = Number(o.scaling.x);
            mesh.scaling.y = Number(o.scaling.y);
            mesh.scaling.z = Number(o.scaling.z);
            // mesh.rotate(o.rotation.axis,eval(o.rotation.value),BABYLON.Space.WORLD);
             console.log(o.rotation.axis);
             console.log(eval(o.rotation.value));
            mesh.info = o.info;
            //mesh.informations est le paneau d'informations lié à chaque objet s'affichant via le clic droit.
            mesh.informations = "<div style='overflow-x:auto;' id='infotemp'><p id='titleinfo'>"+mesh.type+"</p><p id='texteinfo'> <span> Nom </span>"+mesh.name+"<br> <span> Id </span>"+mesh.id+"<br> <span> Infos générales </span>"+mesh.info+"</p></div>";
            mesh.pointflux = new BABYLON.Vector3(); // le point de flux de l'objet correspond au point idéal pour faire partir ou arriver un flux ( d'un pdv logique et esthétique)
            mesh.pointflux.x = Number(o.pointflux.x);
            mesh.pointflux.y = Number(o.pointflux.y);
            mesh.pointflux.z = Number(o.pointflux.z);
            mesh.cube = "";
        });
      } // Fin de la fonction d'ajout de nouvel objet

        for(i = 0; i<objet.length; i++){ //Ici, on parcourt le fichier JSON dans son intégralité
           addMeshJson(objet[i]); // et pour chaque objet du JSON on crée un nouvel objet sur la scène ayant les même attributs
      }
    }
    }


    //Fonction qui crée des cubes
    function addBox() {

        var box = BABYLON.Mesh.CreateBox('box', 10, scene);
        box.type = "box";
        box.name = "box n° " + Math.random();
        box.info = "je suis un cube généré via babylon";
        box.informations = "<div style='overflow-x:auto;' id='infotemp'><p id='titleinfo'>" + box.type + "</p><p id='texteinfo'> <span> Nom </span>" + box.name + "<br> <span> Id </span>" + box.id + "<br> <span> Infos générales </span>" + box.info + "</p></div>";
        box.position = new BABYLON.Vector3( // positionne les objets de façon aléatoire pour éviter la superposition
            Math.random() * 100,
            5, //la position en Y doit être égale à la moitié de la taille de l'objet si on veut que celui-ci soit posé sur le sol
            Math.random() * 100,
        );
        box.pointflux = new BABYLON.Vector3(
          box.position.x,
          box.position.y,
          box.position.Z
        )

        // On attribue des propriétés graphiques à l'objet créé
        box.material = new BABYLON.StandardMaterial("mat", scene);
        box.material.emissiveColor = new BABYLON.Color3(1, 1, 0);

        box.actionManager = new BABYLON.ActionManager(scene);
        box.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOutTrigger, box.material, "emissiveColor", box.material.emissiveColor));
        box.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOverTrigger, box.material, "emissiveColor", BABYLON.Color3.White()));
        shadowGenerator.getShadowMap().renderList.push(box); //ajoute l'objet à la liste des objets produisant des ombresss
    }



    var count;

    // Fonction qui crée un rectangle entre 2 points sélectionnés (un mur).
    function addWall() {
        count = 0;
        var box;
        var startPoint = new BABYLON.Vector3(0, 0, 0);
        canvas.addEventListener("click", wall);
    }

    function wall() {
        var pickResult = scene.pick(scene.pointerX, scene.pointerY);
        if (!pickResult.hit) {
          return;
        }
        if (count) { //si on a déjà cliqué une fois alors on va étendre le mur vers le deuxième clic et lui attribuer des propriétés
            // Atrribution des propriétés graphiques
            var material = new BABYLON.StandardMaterial("matbox", scene);
            box.material = material;
            box.material.emissiveColor = new BABYLON.Color3(1, .1, .1);
            box.actionManager = new BABYLON.ActionManager(scene);
            box.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOutTrigger, box.material, "emissiveColor", box.material.emissiveColor));
            box.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOverTrigger, box.material, "emissiveColor", BABYLON.Color3.Red()));
            box.pointflux =  new BABYLON.Vector3(
              box.position.x,
              box.position.y,
              box.position.z
            );
            shadowGenerator.getShadowMap().renderList.push(box); //ajoute l'objet à la liste des objets produisant des ombresss
            //Orientation et redimension du mur
            console.log('second click!');
            var pos = pickResult.pickedPoint.clone();
            box.lookAt(pos, Math.PI * .5);
            var dist = BABYLON.Vector3.Distance(pos, box.position);
            box.setPivotPoint(new BABYLON.Vector3(-.5, 0, 0));
            box.computeWorldMatrix();
            box.position.y = 7.5;
            box.scaling.x = dist;
            box.scaling.y = 15;
            box.scaling.z = 5;
            count = 0;
            canvas.removeEventListener("click", wall);
        } else { // si c'est le premier clic alos on crée seulement un cube minuscule en attente d'être étiré vers le deuxième point.
            // création du point de départ au premier clic
            console.log('first click!');
            box = BABYLON.Mesh.CreateBox("box", 1, scene);
            box.id = "mur";
            box.scaling.x = .1;
            box.position = pickResult.pickedPoint;
            count++;
        }
    }


    //////////////////////////////////////////////////////////////////////:
    // GESTION DES PARTICULES   ////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////



    /******************************************************************
     * Creation de flux, méthode de la sphère animée entre deux points *
     ******************************************************************/

     /* Point de flux idéal des lignes de prod : mesh.position.x + 3,  8 , mesh.position.z-30 */
     /* Point de flux idéal des stocks1 : mesh.position.x, mesh.position.y+2, mesh.position.z; */
     /* Point de flux idéal des chariots : mesh.position.x, mesh.position.y + 0,5, mesh.position.z; */
     /* Point de flux idéal des caméras : mesh.position.x, mesh.position.y + 1,5, mesh.position.z; */
     /* Point de flux idéal */

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

var meshsource;
var meshdestination;

    function createFlux() { // fonction de création de flux, définit l'animation et la lance.

        var cubesource,cubedestination;
        if(scene.getMeshByID(meshesFlux[0].id+"_cube")){
          cubesource = scene.getMeshByID(meshesFlux[0].id+"_cube");
        }
        else {
          cubesource =  new BABYLON.Mesh.CreateBox("cubesource", 1, scene); //on crée un cube qui servira d'émetteur du flux et sera situé au niveau du premier objet de la liste
          cubesource.id = meshesFlux[0].id+"_cube";
          // cubesource.parent = meshesFlux[0];
          cubesource.position.x = meshesFlux[0].position.x + meshesFlux[0].pointflux.x; // la position du cube emetteur est celle du point de flux de l'objet
          cubesource.position.y = meshesFlux[0].position.y + meshesFlux[0].pointflux.y;
          cubesource.position.z = meshesFlux[0].position.z + meshesFlux[0].pointflux.z;
          cubesource.isVisible = true;
        }



        if(scene.getMeshByID(meshesFlux[1].id+"_cube")){
          cubedestination = scene.getMeshByID(meshesFlux[1].id+"_cube");
        } else {
        cubedestination =  new BABYLON.Mesh.CreateBox("cubedestination", 1, scene); // on reproduit la même chose avec le cube recepteur
        cubedestination.id = meshesFlux[1].id+"_cube";
        // cubedestination.parent = meshesFlux[1];
        cubedestination.position.x = meshesFlux[1].position.x + meshesFlux[1].pointflux.x;
        cubedestination.position.y = meshesFlux[1].position.y + meshesFlux[1].pointflux.y;
        cubedestination.position.z = meshesFlux[1].position.z + meshesFlux[1].pointflux.z;
        cubedestination.isVisible = true;
      }



        const pSource = cubesource.getAbsolutePosition(); // la source de l'animation est le cube emetteur
        const pDestination = cubedestination.getAbsolutePosition(); // la destination de l'animation est le cube recpteur
        const sphere = BABYLON.Mesh.CreateSphere("fluxhandler", 20, 4.0, scene); // crée une sphère, qui sera la source des particules


        /* PARTICULES ASSOCIEES A LA SPHERE */
        var ps = new BABYLON.ParticleSystem("stream", 2000, scene);
        ps.particleTexture = new BABYLON.Texture("/usine3D/FromScratch/textures/flares.png", scene);


        // Colors of all particles
        ps.color1 = new BABYLON.Color3(0, 0, 1.0);
        ps.color2 = new BABYLON.Color3(1, 0, 0);
        ps.colorDead = new BABYLON.Color3(0, 1, 0);

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
        ps.minEmitPower = 20;
        ps.maxEmitPower = 20;
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
        material.diffuseColor = new BABYLON.Color3(0, 1, 0); // on donne une couleur à la sphère, mais on va la rendre invisible par la suite
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

        $(document).on("click", "#toggler", function() {
            $("#biblio").toggle(400);
            $("#flechebibli").toggleClass("toggledown"); //l'icone de flèche change sa classe de toggleup vers toggledown, et obtient donc de nouvelles propriétés css ( se retourne)
            return false;
        });
        $(document).on("click", "#toggler2", function() {
            $("#formrotation").toggle(400);
            $("#flecherot").toggleClass("toggledown");//l'icone de flèche change sa classe de toggleup vers toggledown, et obtient donc de nouvelles propriétés css ( se retourne)
            return false;
        });
        $(document).on("click","#joinNow", function(){
          canvas.removeEventListener("dblclick", selection); // - on enlève l'écouteur de doubleclick
          joinNow.style.display = "none"; // - on fait disparaître le bouton "join"
          // joinM(selectedmeshes[0], 1, selectedmeshes); // - puis on appelle la fonction récursive
          BABYLON.Mesh.MergeMeshes(selectedmeshes);
        });

        $(document).on("click", "#clickbox", function() { //ajout d'un cube
            addBox();
        });
        $(document).on("click", "#clicksphere", function() { //ajout d'une sphere
            addSphere();
        });
        $(document).on("click", "#clickligneprod", function() { //ajout d'un obj importé
            addligneprod(scene);
        });
        $(document).on("click", "#clickchariot", function() {
            addchariot(scene);
        })
        $(document).on("click", "#clickstock1", function() {
            addstock1(scene);
        })
        $(document).on("click", "#clickstock2", function() {
            addstock2(scene);
        })
        $(document).on("click", "#clickstock3", function() {
            addstock3(scene);
        })
        $(document).on("click", "#clickcamera", function() {
            addcamera(scene);
        })
        $(document).on("click", "#clickcopilote", function() {
            addcopilote(scene);
        })
        $(document).on("click", "#clickrail", function() {
            addrail(scene);
        })
        $(document).on("click","#cuisiniere", function(){
          addcuisine(scene);
        })
        $(document).on("click","#clickpalette", function(){
          addpalette(scene);
        })
        $(document).on("click", "#clickcuve", function(){
          addcuve(scene);
        })
        $(document).on("click", "#deleteM", function() { //suppression de l'objet selectionné
            deleteMesh();
        });
        $(document).on("click", "#joinM", function() { //join de plusieurs objets
            if (selectedMesh.id != ground.id) {
                $("#joinNow").css("display", "block");
                joinMeshes();
            }
        });
        $(document).on("click", "#bounce", function() { //fait rebondir l'ojet selectionné via une animation
            if (selectedMesh) {
                if (selectedMesh.id != ground.id) { //lorsqu'on clic sur bounce, si unobjet est sélectionné t que ce n'est pas le sol,alors on lance l'animation
                    bounce = true;
                    setBounce();
                    $("#stopbounce").css("display", "block"); //le bouton "stop bounce" ne s'affiche que quand on clic sur bounce
                    $("#stopbounce").click(function() {
                        bounce = false;
                        setBounce(); //on rappelle la fonction setBounce avec le paramètre bounce à FAUX, ce qui va arrêter l'animation.
                        $("#stopbounce").css("display", "none"); //une fois qu'on a appuyé sur stop bounce,le boutton disparaît.

                    });
                }
            }
        });

        $(document).on("click", "#createStream", function() { //crée un flux entre les 2 objets sélectionnés après le clic
            Flux();
        });

        $(document).on("click", "#clear", function() { // nettoie la scène : supprime tous les objets
            for (var i = 0; i < scene.meshes.length; i++) {
                if (scene.meshes[i] != ground) {
                    scene.meshes[i].dispose(); // If the mesh is not a ground, delete
                    i--;
                }
            }
            imported = false;
        });

        $(document).on("click","#importjson",function(){
          if(imported === false){
              LoadJson();
              imported = true;
          }
        });
        $(document).on("click", "#checkground", function() { // choix du plan 2d au sol ou non
            checkGround();
        });

        // Ecouteur d'évènements Jquery sur le bouton valider de la modification de scaling, lance la fonction de modification lorsqu'il est cliqué
        $(document).on("click", "#validscaling", function() {
            if (selectedMesh != undefined && selectedMesh.id != ground.id) {
                modifyScaling($("#scalingX").val(), $("#scalingY").val(), $("#scalingZ").val()); // on appelle la fonction avec les valeurs qu'on récupère dans le formulaire html
            }
        });

        //Ecouteur d'évènements Jquery sur le bouton valider de la modification de rotation, lance la fonction de rotation lorsqu'il est cliqué
        $(document).on("click", "#validrot", function() {
            if (selectedMesh != undefined && selectedMesh.id != ground.id) {
                modifyRotation($("#rotationX").val(), $("#rotationY").val(), $("#rotationZ").val()); // on appelle la fonction avec les valeurs qu'on récupère dans le formulaire html
            }
        });

        $(document).on("click", "#addWall", function() {
            addWall();
        });

        $(document).on("click", "#infos", function(evt) { //on écoute l'évènement de clic droit.
            // evt.preventDefault(); // empêche d'afficher l'action par défaut de l'évènement rightclick, cad aficher le menu contextuel.
            var pickResult2 = scene.pick(scene.pointerX, scene.pointerY);
            if (pickResult2.hit) {
                $("#infotemp").remove();
                $("#infosmesh").append(pickResult2.pickedMesh.informations);
                $("#infotemp").css("visibility", "visible");
                $("#infotemp").css({
                    'left': evt.pageX - 45,
                    'top': evt.pageY - 95
                });
                $("#infotemp").click(function() {
                    $("#infotemp").css("display", "none");
                })
            }
        });

        $(document).on("click","#tab1", function(evt){
          openContent(evt, "content1");
        })
        $(document).on("click","#tab2", function(evt){
          openContent(evt, "content2");
        })
        $(document).on("click","#tab3", function(evt){
          openContent(evt,"content3");
        })
        $(document).on("click", "#toggler",function(evt){
          $(".selectedcontent").click(); //sélectionne le premier onglet en tant que défaut à chaque fois qu'on déroule la bibliothèque
        })

    });
    /**************************************************************************************/

    // Fonction qui gère la éléction des onglets dans la bibliothèque d'import d'objets
    function openContent(evt, contentName) {
        // Declare all variables
        var i, tabcontent, tablinks;

        // Get all elements with class="tabcontent" and hide them
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }

        // Get all elements with class="tablinks" and remove the class "active"
        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }

        // Show the current tab, and add an "active" class to the button that opened the tab
        document.getElementById(contentName).style.display = "flex";
        evt.currentTarget.className += " active";
}


    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////      Gestion du sol           /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
    var ground = BABYLON.Mesh.CreateGround("ground1", 300, 300, 2, scene);
    var groundMat = new BABYLON.StandardMaterial("groundMat", scene);
    //INSERTION DU PLAN
    groundMat.ambientTexture = new BABYLON.Texture("/usine3D/FromScratch/plan.png", scene);

    ground.material = groundMat;
    ground.receiveShadows = true; //affiche les ombres sur le sol


    //Affichage du plan ou non

    function checkGround() {
        if (masquer == false) {
            ground.material = new BABYLON.StandardMaterial("material", scene);
        }
        if (masquer == true) {
            ground.material = groundMat;
        }
        masquer = !masquer; //inverse la valeur du booléen
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //         Drag'n'drop                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Ensemble de fonctions fournies par BabylonJS pour mettre en place le drag'n'drop

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
            if (selectedMesh && selectedMesh.id != "mur") {
            //    particleSystem.stop(); // on arrête l'émission de particules lorsque l'objet n'est plus en mouvement
            }
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
        if (selectedMesh && selectedMesh.id != "mur") {
        //    particleSystem.start(); //lorsque l'objet est déplacé on émet des particules
        }

        var diff = current.subtract(startingPoint);
        currentMesh.position.addInPlace(diff);
        var cube = scene.getMeshByID(currentMesh.id+"_cube");
        if(cube){
          cube.position.addInPlace(diff);
        }


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


    // RETOUR DE LA SCENE -  FIN DE LA FONCTION CREATESCENE
    return scene;
}



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//   actualisation constante de la scène   ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var scene1 = createScene(); // on crée une scène
engine.runRenderLoop(function() {
    scene1.render(); // refresh de la scene a chaque frame
    engine.resize();
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

$(window).resize(function() {
    engine.resize();
});

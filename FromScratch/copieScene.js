var canvas = document.getElementById('renderCanvas');
var engine = new BABYLON.Engine(canvas, true);
var selectedMesh;
var initialMesh;
var joining = false;
var bounce = false;
var dragging;

var createScene = function() {

    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);

    // DIFFERENTES COULEURS D'environnement

    //  scene.clearColor = new BABYLON.Color4(0,0,0,0.0000000000000001); //rend l'environnement exterieur transparent ( de base c'est bleu foncé)
    scene.clearColor = new BABYLON.Color3(0.8, 0.8, 0.8);
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


    var light = new BABYLON.DirectionalLight("light1", new BABYLON.Vector3(0, 1, 1), scene);
    light.direction = new BABYLON.Vector3(-1.0, -1.0, 1.0);
    light.intensity = 1;



    //Svar light2 = new BABYLON.SpotLight("spotLight2", new BABYLON.Vector3(10, 1, 0),new BABYLON.Vector3(-1,0,0), scene);

    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////    Création des ombres //////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    var shadowGenerator = new BABYLON.ShadowGenerator(512, light);
    shadowGenerator.usePoissonSampling = true;
    shadowGenerator.useBlurExponentialShadowMap = true;
    shadowGenerator.useContactHardeningShadow = true;
    shadowGenerator.filteringQuality = BABYLON.ShadowGenerator.QUALITY_LOW;


    //var shadowGenerator2 = new BABYLON.ShadowGenerator(512, light2);

    //shadowGenerator.useExponentialShadowMap = true;
    //shadowGenerator2.useExponentialShadowMap = true;


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////  Gestion de l'objet selectionné     ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    window.addEventListener("click", function() {

        var pickResult = scene.pick(scene.pointerX, scene.pointerY);
        if (pickResult.hit) {
            selectedMesh = pickResult.pickedMesh;
            initialMesh = selectedMesh;
            if (selectedMesh.name != ground.name) particleSystem.emitter = selectedMesh; // the starting object, the emitter (ref GESTION DES PARTICULES)

        }
    });


    var validscale = document.getElementById('validscaling');
    var validrot = document.getElementById('validrot');
    var deleteM = document.getElementById('deleteM');

    // validscale.addEventListener('click', function() {
    //     var newscaleX = document.getElementById('scalingX');
    //     var newscaleY = document.getElementById('scalingY');
    //     var newscaleZ = document.getElementById('scalingZ');
    //     if (selectedMesh != undefined && selectedMesh.id != ground.id) {
    //         modifyScaling(newscaleX.value, newscaleY.value, newscaleZ.value);
    //     }
    // });

    // validrot.addEventListener('click', function() {
    //     var newrotX = document.getElementById('rotationX').value;
    //     var newrotY = document.getElementById('rotationY').value;
    //     var newrotZ = document.getElementById('rotationZ').value;
    //     console.log(newrotX);
    //     console.log(newrotY);
    //     console.log(newrotZ);
    //     if (selectedMesh != undefined && selectedMesh.id != ground.id) {
    //         modifyRotation(newrotX, newrotY, newrotZ);
    //     }
    // });


    function modifyScaling(xx, yy, zz) {
        selectedMesh.scaling.x = xx;
        selectedMesh.scaling.y = yy;
        selectedMesh.scaling.z = zz;

        //Réatribution des propriétés graphiques ( surtout celle d'agrandissement au survol)
        for (var i = selectedMesh.actionManager.actions.length - 1; i > 0; i--) {
            selectedMesh.actionManager.actions.splice(i, 1);
        }
        selectedMesh.actionManager.registerAction(new BABYLON.SetValueAction(
            BABYLON.ActionManager.OnPointerOutTrigger, selectedMesh.material, "emissiveColor", selectedMesh.material.emissiveColor));
        selectedMesh.actionManager.registerAction(new BABYLON.SetValueAction(
            BABYLON.ActionManager.OnPointerOverTrigger, selectedMesh.material, "emissiveColor", BABYLON.Color3.White()));
        selectedMesh.actionManager.registerAction(new BABYLON.SetValueAction(
            BABYLON.ActionManager.OnPointerOutTrigger, selectedMesh, "scaling", new BABYLON.Vector3(selectedMesh.scaling.x, selectedMesh.scaling.y, selectedMesh.scaling.z)));
        selectedMesh.actionManager.registerAction(new BABYLON.SetValueAction(
            BABYLON.ActionManager.OnPointerOverTrigger, selectedMesh, "scaling", new BABYLON.Vector3(selectedMesh.scaling.x * 1.1, selectedMesh.scaling.y * 1.1, selectedMesh.scaling.z * 1.1)));
        //selectedMesh.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOverTrigger, selectedMesh, "scaling", new BABYLON.Vector3(1.1,1.1,1.1), 150));

        selectedMesh.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPickTrigger, light, "diffuse", BABYLON.Color3.White(), 1))
            .then(new BABYLON.CombineAction(BABYLON.ActionManager.NothingTrigger, [ // Then is used to add a child action used alternatively with the root action.
                new BABYLON.SetValueAction(BABYLON.ActionManager.NothingTrigger, selectedMesh.material, "wireframe", false)
            ]));
        selectedMesh.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPickTrigger, selectedMesh.material, "wireframe", true)).then(new BABYLON.DoNothingAction());

        shadowGenerator.getShadowMap().renderList.push(selectedMesh);
        //shadowGenerator2.getShadowMap().renderList.push(selectedMesh);

    }

    function modifyRotation(x, y, z) {
        selectedMesh.rotation.x += x;
        selectedMesh.rotation.y += y;
        selectedMesh.rotation.z += z;
    }

    function deleteMesh() {

        selectedMesh.dispose();
    }

    var here;

    $("#titrboutons").append('<button id="joinNow" class="btn" style="display:none" > Join</button>'); //boutton de validation de l'assemblage des mesh
    var joinNow = document.getElementById('joinNow');

    var selectedmeshes = [];

    function joinMeshes() {
        selectedmeshes.length = 0; //réinitialise le tableau en le vidant.
        here = false;
        canvas.addEventListener("dblclick", selection);

        joinNow.addEventListener("click", function() {
            canvas.removeEventListener("dblclick", selection);
            joinNow.style.display = "none";
            const l = selectedmeshes.length;
            joinM(l);
        });


    }

    function selection() {
        for (var i = 0; i < selectedmeshes.length; i++) {
            if (selectedmeshes[i].name == selectedMesh.name) {
                here = true;
            }
        }
        if (here == false) {
            selectedmeshes.push(selectedMesh); //si l'élément sélectionné n'est pas déjà présent dans la liste alors on l'aoute à la liste
            console.log("ajouté " + selectedMesh.name);
            console.log("taille: " + selectedmeshes.length);
        }
    }



    //ESSAI DE FONCTION RECURSIVE QUI NE MARCHE PAS


    function joinM(m) { //fonction recursive qui parcourt le tableau des mesh selectionnés, et les lie entre-eux par fusion (merge);

        if (m <= 2) {
            //  var newObj = new BABYLON.Mesh.MergeMeshes([selectedmeshes[i],selectedmeshes[i-1]],true); // cas de base, on merge l'objet pointé avec celui qui le précède.

            var newObj = new BABYLON.Mesh.MergeMeshes([selectedmeshes[m - 1], selectedmeshes[m - 2]], true);
            newObj.name = " objet : " + selectedmeshes[m].name + "." + selectedmeshes[m - 1].name;
            console.log("name : " + newObj.name);
            //On réapplique des propriétés graphiques au nouvel objet créé.
            newObj.material.emissiveColor = new BABYLON.Color3(0, 1, 0); //la couleur "emissive" (pas influencée par l'éclairage) de l'objet est définie sur verte.
            newObj.actionManager = new BABYLON.ActionManager(scene);
            newObj.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOutTrigger, newObj.material, "emissiveColor", newObj.material.emissiveColor));
            newObj.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOverTrigger, newObj.material, "emissiveColor", BABYLON.Color3.White()));
            newObj.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOutTrigger, newObj, "scaling", new BABYLON.Vector3(newObj.scaling.x, newObj.scaling.y, newObj.scaling.z), 150));
            newObj.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOverTrigger, newObj, "scaling", new BABYLON.Vector3(newObj.scaling.x + newObj.scaling.x * 0.1, newObj.scaling.y + newObj.scaling.y * 0.1, newObj.scaling.z + newObj.scaling.z * 0.1), 150));

            newObj.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPickTrigger, light, "diffuse", BABYLON.Color3.White(), 1))
                .then(new BABYLON.CombineAction(BABYLON.ActionManager.NothingTrigger, [ // Then is used to add a child action used alternatively with the root action.
                    new BABYLON.SetValueAction(BABYLON.ActionManager.NothingTrigger, newObj.material, "wireframe", false)
                ]));
            newObj.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPickTrigger, newObj.material, "wireframe", true)).then(new BABYLON.DoNothingAction());


            shadowGenerator.getShadowMap().renderList.push(newObj);
            //shadowGenerator2.getShadowMap().renderList.push(newObj);


            return newObj;
        } else { //si on n'est pas dans le cas de base alors on appelle la fonction
            return new BABYLON.Mesh.MergeMeshes([selectedmeshes[m], joinM(m - 1), true]);
            console.log("tour de boucle -  m vaut : " + m);

        }
    }



    $("#titrboutons").append('<button id="bounce" class="btn"> Bounce</button>');
    $("#titrboutons").append('<button id="stopbounce" class="btn" style = "display:none"> Stop Bounce</button>');
    $("#bounce").click(function() {
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

    function setBounce() { //fait "rebondir" l'objet sélectionné via une animation babylonjs
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

    function addBox() {

        var box = BABYLON.Mesh.CreateBox('box', 10, scene);
        var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(box, 1024, 1024, false);
        box.type = "box";
        box.name = "box n° " + Math.random();
        box.info = "je suis un cube généré via babylon";
        box.informations = "<div style='overflow-x:auto;' id='infotemp'><table> <tr>  <th>Nom de l'objet</th> <th>id de l'objet</th> <th>Autre infos</th></tr><tr> <td>" + box.name + "</td><td>" + box.id + "</td><td>" + box.info + " </tr></table></div>";
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
        box.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOverTrigger, box, "scaling", new BABYLON.Vector3(box.scaling.x + box.scaling.x * 0.1, box.scaling.y + box.scaling.y * 0.1, box.scaling.z + box.scaling.z * 0.1), 150));


        box.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPickTrigger, light, "diffuse", BABYLON.Color3.White(), 1))
            .then(new BABYLON.CombineAction(BABYLON.ActionManager.NothingTrigger, [ // Then is used to add a child action used alternatively with the root action.
                new BABYLON.SetValueAction(BABYLON.ActionManager.NothingTrigger, box.material, "wireframe", false)
            ]));
        box.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPickTrigger, box.material, "wireframe", true)).then(new BABYLON.DoNothingAction());


        shadowGenerator.getShadowMap().renderList.push(box);
        //shadowGenerator2.getShadowMap().renderList.push(box);
        showAxis(3, box);
    }



    function addXWall() {
        var Xwall = BABYLON.Mesh.CreateBox('Xwall', 10, scene);
        Xwall.type = "Xwall";
        Xwall.name = "Xwall n° " + Math.random();
        Xwall.info = "je suis un mur  généré via babylon";
        Xwall.informations = "<div style='overflow-x:auto;' id='infotemp'><table> <tr>  <th>Nom de l'objet</th> <th>id de l'objet</th> <th>Autre infos</th></tr><tr> <td>" + Xwall.name + "</td><td>" + Xwall.id + "</td><td>" + Xwall.info + " </tr></table></div>";
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
        Xwall.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOverTrigger, Xwall, "scaling", new BABYLON.Vector3(Xwall.scaling.x + Xwall.scaling.x * 0.1, Xwall.scaling.y + Xwall.scaling.y * 0.1, Xwall.scaling.z + Xwall.scaling.z * 0.1), 150));


        Xwall.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPickTrigger, light, "diffuse", BABYLON.Color3.White(), 1))
            .then(new BABYLON.CombineAction(BABYLON.ActionManager.NothingTrigger, [ // Then is used to add a child action used alternatively with the root action.
                new BABYLON.SetValueAction(BABYLON.ActionManager.NothingTrigger, Xwall.material, "wireframe", false)
            ]));
        Xwall.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPickTrigger, Xwall.material, "wireframe", true)).then(new BABYLON.DoNothingAction());


        shadowGenerator.getShadowMap().renderList.push(Xwall);
        //shadowGenerator2.getShadowMap().renderList.push(Xwall);
        showAxis(3, Xwall);

    }

    function addZWall() {
        var Zwall = BABYLON.Mesh.CreateBox('Zwall', 10, scene);
        Zwall.type = "Zwall";
        Zwall.name = "Zwall n° " + Math.random();
        Zwall.info = "je suis un murr généré via babylon";
        Zwall.informations = "<div style='overflow-x:auto;' id='infotemp'><table> <tr>  <th>Nom de l'objet</th> <th>id de l'objet</th> <th>Autre infos</th></tr><tr> <td>" + Zwall.name + "</td><td>" + Zwall.id + "</td><td>" + Zwall.info + " </tr></table></div>";
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
        Zwall.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOverTrigger, Zwall, "scaling", new BABYLON.Vector3(Zwall.scaling.x + Zwall.scaling.x * 0.1, Zwall.scaling.y + Zwall.scaling.y * 0.1, Zwall.scaling.z + Zwall.scaling.z * 0.1), 150));


        Zwall.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPickTrigger, light, "diffuse", BABYLON.Color3.White(), 1))
            .then(new BABYLON.CombineAction(BABYLON.ActionManager.NothingTrigger, [ // Then is used to add a child action used alternatively with the root action.
                new BABYLON.SetValueAction(BABYLON.ActionManager.NothingTrigger, Zwall.material, "wireframe", false)
            ]));
        Zwall.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPickTrigger, Zwall.material, "wireframe", true)).then(new BABYLON.DoNothingAction());


        shadowGenerator.getShadowMap().renderList.push(Zwall);
        //shadowGenerator2.getShadowMap().renderList.push(Zwall);
        showAxis(3, Zwall);
    }



    function addSphere() {
        var sphere = BABYLON.Mesh.CreateSphere('sphere', 16, 6, scene);
        sphere.type = "sphere";
        sphere.name = "sphere n° : " + Math.random();
        sphere.info = "je suis une sphère générée via babylon";
        sphere.informations = "<div style='overflow-x:auto;' id='infotemp'><table> <tr>  <th>Nom de l'objet</th> <th>id de l'objet</th> <th>Autre infos</th></tr><tr> <td>" + sphere.name + "</td><td>" + sphere.id + "</td><td>" + sphere.info + " </tr></table></div>";
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
        sphere.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOverTrigger, sphere, "scaling", new BABYLON.Vector3(sphere.scaling.x + sphere.scaling.x * 0.1, sphere.scaling.y + sphere.scaling.y * 0.1, sphere.scaling.z + sphere.scaling.z * 0.1), 150));

        sphere.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPickTrigger, light, "diffuse", BABYLON.Color3.White(), 1))
            .then(new BABYLON.CombineAction(BABYLON.ActionManager.NothingTrigger, [ // Then is used to add a child action used alternatively with the root action.
                new BABYLON.SetValueAction(BABYLON.ActionManager.NothingTrigger, sphere.material, "wireframe", false)
            ]));
        sphere.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPickTrigger, sphere.material, "wireframe", true)).then(new BABYLON.DoNothingAction());

        shadowGenerator.getShadowMap().renderList.push(sphere);
        //shadowGenerator2.getShadowMap().renderList.push(sphere);

        showAxis(3, sphere);
    }


    function addObj() {
        var mesh;
        // The first parameter can be used to specify which mesh to import. Here we import all meshes
        BABYLON.SceneLoader.ImportMesh("", "/usine3d/FromScratch/objets/", "camion.obj", scene, function(newMeshes) { //import de l'objt 3D .babylon , appel de fonction callBakc OnSuccess
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
            scene.registerBeforeRender(objProperty()); //applique les propritétés de la fonction objProperty avant chaque render de frame
        });

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

            shadowGenerator.getShadowMap().renderList.push(mesh);
            //shadowGenerator2.getShadowMap().renderList.push(mesh);
            showAxis(3, mesh);


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


    $("#titrboutons").append('<button id="createStream" class="btn"> Créer un flux </button>');
    var stream = document.getElementById("createStream");
    stream.addEventListener("click", Flux);
    $("#titrboutons").append('<button id="validStream" class="btn" style = "display : none"> Valider le flux </button>');

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
                if (meshesFlux.length == 2) {
                    createFlux();
                }
            }
        }
    }


    function createFlux() { // fonction de création de flux, définit l'animation et la lance.
        const pSource = meshesFlux[0].position;
        const pDestination = meshesFlux[1].position;
        const sphere = BABYLON.Mesh.CreateSphere("fluxhandler", 20, 4.0, scene);
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
        sphere.visibility = 0;
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

    //ADDBOX

    if ($('#clickbox').length) {
        $('#clicbox').remove();
    }

    $("#titrboutons").append('<button id="clickbox" class="btn"  > Ajouter un cube </button>');
    $('#clickbox').click(function() { //code Jquery,  ajoute un bouton après le canvas, et attribue à ce bouton la fonction addBox.
        addBox();
    });

    //ADDXWALL    Horizontal Wall

    if ($('#clickXWall').length) {
        $('#clickXWall').remove();
    }

    $("#titrboutons").append('<button id="clickXWall" class="btn"  > Ajouter un Mur Horizontal </button>');
    $('#clickXWall').click(function() { //code Jquery,  ajoute un bouton après le canvas, et attribue à ce bouton la fonction addBox.
        addXWall();
    });

    //ADDYWALL    Vertical Wall

    if ($('#clickZWall').length) {
        $('#clickZWall').remove();
    }

    $("#titrboutons").append('<button id="clickZWall" class="btn"  > Ajouter un Mur Vertical </button>');
    $('#clickZWall').click(function() { //code Jquery,  ajoute un bouton après le canvas, et attribue à ce bouton la fonction addBox.
        addZWall();
    });



    //ADDSPHERE

    if ($('#clicksphere').length) {
        $('#clicksphere').remove();
    }

    $("#titrboutons").append('<button id="clicksphere" class="btn"  > Ajouter une sphère </button>');
    $('#clicksphere').click(function() {
        addSphere();
    });



    //ADDOBJECT

    if ($('#clickobj').length) {
        $('#clickobj').remove();
    }

    $("#titrboutons").append('<button id="clickobj" class="btn"  > Ajouter un objet </button>');
    $('#clickobj').click(function() {
        addObj();
    });




    $("#titrboutons").append('<button id="deleteM" class="btn"> Delete Mesh</button>');
    $('#deleteM').click(function() {
        if (selectedMesh.id != ground.id) {
            deleteMesh();
        }

    });




    $("#titrboutons").append('<button id="joinM" class="btn"> Assembler des Mesh </button>');
    $('#joinM').click(function() {
        if (selectedMesh.id != ground.id) {
            joinNow.style.display = "block";
            joinMeshes();
        }
    })



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


    // Affichage du plan ou non

    var check = document.getElementById("checkground");

    check.addEventListener("click", checkGround);

    function checkGround() {
        if (check.checked != false) {
            ground.material = new BABYLON.StandardMaterial("material", scene);
        }
        if (check.checked == false) {
            ground.material = groundMat;
        }
    }


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //         Drag'n'drop                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



    var showAxis = function(size, mesh) {

		// X AXIS
	    var axisX = BABYLON.Mesh.CreateLines("axisX", [BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0)], scene);
		axisX.isVisible = false;
		axisX.parent = mesh;
	    axisX.color = new BABYLON.Color3(1, 0, 0);

		var xBox = BABYLON.Mesh.CreateBox("X", 0.5, scene);
		xBox.parent = mesh;
		xBox.isVisible = false;
		xBox.position = new BABYLON.Vector3(size, 0, 0);
		var xBoxMaterial = new BABYLON.StandardMaterial("boxMaterial", scene);
		xBoxMaterial.diffuseColor = BABYLON.Color3.Red();
		xBox.material = xBoxMaterial;

		// Y AXIS
	    var axisY = BABYLON.Mesh.CreateLines("axisY", [BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0)], scene);
		axisY.isVisible = false;
		axisY.parent = mesh;
	    axisY.color = new BABYLON.Color3(0, 1, 0);

		var yBox = BABYLON.Mesh.CreateBox("Y", 0.5, scene);
		yBox.parent = mesh;
		yBox.isVisible = false;
		yBox.position = new BABYLON.Vector3(0, size, 0);
		var yBoxMaterial = new BABYLON.StandardMaterial("boxMaterial", scene);
		yBoxMaterial.diffuseColor = BABYLON.Color3.Green();
		yBox.material = yBoxMaterial;


		// Z AXIS
	    var axisZ = BABYLON.Mesh.CreateLines("axisZ", [BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size)], scene);
		axisZ.isVisible = false;
		axisZ.parent = mesh;
	    axisZ.color = new BABYLON.Color3(0, 0, 1);

		var zBox = BABYLON.Mesh.CreateBox("Z", 0.5, scene);
		zBox.parent = mesh;
		zBox.isVisible = false;
		zBox.position = new BABYLON.Vector3(0, 0, size);
		var zBoxMaterial = new BABYLON.StandardMaterial("boxMaterial", scene);
		zBoxMaterial.diffuseColor = BABYLON.Color3.Blue();
		zBox.material = zBoxMaterial;
	};

    var startingPoint;
    var currentMesh;
    var lastMesh;
    var pickedAxis = null;
    var pickedAxisMesh = null;
    var fakeGround = null;

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

    var getGroundPosition2D = function () {
    var pickinfo = scene.pick(scene.pointerX, scene.pointerY);
        return pickinfo.pickedPoint;
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
            // currentMesh = pickInfo.pickedMesh;
            // startingPoint = getGroundPosition(evt);
            //
            // if (startingPoint) { // we need to disconnect camera from canvas
            //     setTimeout(function() {
            //         camera.detachControl(canvas);
            //     }, 0);
            if(pickInfo.pickedMesh.name == "X" || pickInfo.pickedMesh.name == "Y" || pickInfo.pickedMesh.name == "Z")	{
                pickedAxisMesh = pickInfo.pickedMesh;
                pickedAxisMesh.scaling = new BABYLON.Vector3(3,3,3);
                pickedAxis = pickInfo.pickedMesh.name;
                currentMesh = pickInfo.pickedMesh.parent;
                if (pickInfo.pickedMesh.name == "Y")
                  startingPoint = getGroundPosition(evt);
                else
                  startingPoint = getGroundPosition2D(evt);


                // CREATE FAKE GROUND
                fakeGround = BABYLON.Mesh.CreateGround("fakeGround", 10, 10, 1, scene, false);
                fakeGround.rotation.x = Math.PI;
                fakeGround.parent = pickInfo.pickedMesh;
                  fakeGround.material = groundMaterial;

                if (startingPoint) { // we need to disconnect camera from canvas
                  setTimeout(function () {
                    camera.detachControl(canvas);
                  }, 0);
                }
              } else { // Show axis for the clicked mesh. I think the meshes with axis should have some flag that should be checked here
                currentMesh = pickInfo.pickedMesh;
                startingPoint = getGroundPosition2D(evt);

                if (startingPoint) { // we need to disconnect camera from canvas
                  setTimeout(function () {
                    camera.detachControl(canvas);
                  }, 0);
                }
                clickMesh(lastMesh, pickInfo.pickedMesh);
                lastMesh = pickInfo.pickedMesh;
              }
            }
                    }

    var onPointerUp = function() {
        if (startingPoint) {
            camera.attachControl(canvas, true);
            startingPoint = null;
            pickedAxis = null;
            pickedAxisMesh.scaling = new BABYLON.Vector3(1,1,1);
            if (fakeGround !=null) {
              fakeGround.dispose();
            }
            particleSystem.stop(); // on arrête l'émission de particules lorsque l'objet n'est plus en mouvement
            return;
        }
    }

    var onPointerMove = function(evt) {
        if (!startingPoint) {
            return;
        }

        if (pickedAxis == "Y")
        var current = getGroundPosition(evt);
      else
        var current = getGroundPosition2D(evt);

        if (!current) {
            return;
        }

        var compensationFactor = 10;
    if (pickedAxis != null)
    {
      switch(pickedAxis){
        case "X":
          var diff = current.subtract(startingPoint);
          currentMesh.position.x += diff.x;
        break;
        case "Y":
          var diff = current.subtract(startingPoint);
          currentMesh.position.y -= diff.y/compensationFactor;
        break;
        case "Z":
          var diff = current.subtract(startingPoint);
          currentMesh.position.z += diff.z;
        break;
      }
    } else {
      //var diff = current.subtract(startingPoint);
      //var y = currentMesh.position.y;
      //currentMesh.position = new BABYLON.Vector3(diff.x, y, diff.z);
    }

        startingPoint = current;
    }

    function clickMesh(lastMesh, currentMesh){
    // If we click again the already selected mesh then there is no reason to remove axis and add them again
    if(lastMesh == currentMesh)
      return;

    // Show axis for the current mesh
    for(var i = 0; i < currentMesh.getChildren().length; i++)
      currentMesh.getChildren()[i].isVisible = true;

    // Remove axis for the previous mesh
    if(lastMesh != null){
      if(lastMesh.getChildren().length > 0)
        for(var i = 0; i < lastMesh.getChildren().length; i++)
          lastMesh.getChildren()[i].isVisible = false;
    }
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

    $("#titrboutons").append('<button id="clear" class="btn"  > Clear </button>');
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
window.addEventListener('resize', function() {
    engine.resize(); //écouteur d'évènement lié à la fenêtre, lorsqu'on réduit celle-ci le canvas et les objets réduisent aussi pour s'adapter (s'aggrandissent)
});

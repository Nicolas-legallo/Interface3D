function joinM (m) { //fonction recursive qui parcourt le tableau des mesh selectionnés, et les lie entre-eux par fusion (merge);

  if(m <= 2){
  //  var newObj = new BABYLON.Mesh.MergeMeshes([selectedmeshes[i],selectedmeshes[i-1]],true); // cas de base, on merge l'objet pointé avec celui qui le précède.

    var newObj = new BABYLON.Mesh.MergeMeshes([selectedmeshes[m-1],selectedmeshes[m-2]],true);
    newObj.name = " objet : " + selectedmeshes[m].name +"."+selectedmeshes[m-1].name;
    console.log("name : "+newObj.name);



    return newObj;
  }
  else { //si on n'est pas dans le cas de base alors on appelle la fonction
    return new BABYLON.Mesh.MergeMeshes([selectedmeshes[m],joinM(m-1),true]);
    console.log("tour de boucle -  m vaut : " +m);

  }
}
















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


shadowGenerator.getShadowMap().renderList.push(newObj);
shadowGenerator2.getShadowMap().renderList.push(newObj);

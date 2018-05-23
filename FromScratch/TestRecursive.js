function joinM(obj,i) { //fonction recursive qui parcourt le tableau des mesh selectionnés, et les lie entre-eux par fusion (merge);

    if (i >= selectedMeshes.length-1) {
        //  var newObj = new BABYLON.Mesh.MergeMeshes([selectedmeshes[i],selectedmeshes[i-1]],true); // cas de base, on merge l'objet pointé avec celui qui le précède
        return Obj;
    } else { //si on n'est pas dans le cas de base alors on appelle la fonction
    return  joinM(new BABYLON.Mesh.MergeMeshes(obj, selectedMesh[i], true),i+1);

    }
}




var arr = ['A', 'B', 'C', 'D'];

function rec (obj, i) {
    // console.log('start : ' + obj + ' - i: ' + i);
    if (i == arr.length - 1 || obj.length > 5) {
      return String(obj);
  } else {
    // console.log('rec(' + obj + ' + '+ arr[i] + ')');
      return rec(obj + arr[i], i+1);
  }
}

console.log(rec('', 0));

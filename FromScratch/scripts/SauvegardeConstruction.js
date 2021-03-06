/********************************************

SAUVEGARDE du    Script permettant de construire dynamiquement le fichier HTML
    pour s'adapter au mode choisi : Visualisation ou édition.
    Principalement composé d'insertions HTML en Jquery (beaucoup plus simple et rapide que le js de base)

  DATE : 16/05

********************************************************/
var insertion = $("#insererici");
var contenu = "";
var modeConstruction = false;
var modeVisu = true;

$(window).ready(function(){
  CreationPage();
  $("#switchmode").click(function(){
    modeConstruction = !modeConstruction;
    modeVisu = !modeVisu;
    $("#insererici").children().filter(":not(#pasca)").remove();
     CreationPage();
  });
});



function CreationPage(){
  contenu = "";

  // MODE CONSTRU
  if(modeConstruction == true && modeVisu == false){

    contenu +=   "<ul  class='jctx jctx-id-foo jctx-white jctx-black-shadow inserted'><li data-action='close' style='background-color : red'>Close Menu</li><li data-action='Delete' id='deleteM'>Delete</li>"+
        "<li data-action='bounce' id='bounce'>Bounce</li><li data-action='stopBounce' id='stopbounce'>Stop Bounce</li><hr><li data-action='Infos' id='infos'>Infos</li>"+
        "<li data-action='new_cls'>New class</li><li data-action='new_intf' class='disabled'>New interface (a disabled entry)</li></ul>"+
    "<div id='buttons' class='HolyGrail-nav inserted'><form method='post' id='contient'><h3 id='titreform'>Paramètres globaux : </h3><div id='container'><div id='scaling'>"+
    "<h5> Modif Taille : </h5><input type='number' name='scalingX' id='scalingX'>Modifier Taille X</input><input type='number' name='scalingY' id='scalingY'>Modifier Taille Y</input>"+
    "<input type='number' name='scalingZ' id='scalingZ'>Modifier Taille Z</input> <br><input type='button' id='validscaling' value='valider'></input></div><br>"
    +"<div id='rotation'><h5> Rotation : </h5><input type='number' step='any' max='1' name='rotationX' id='rotationX'> Rotation par les X</input><input type='number' step='any' max='1' name='rotationY' id='rotationY'> Rotation par les Y</input>"+
    "<input type='number' step='any' max='1' name='rotationZ' id='rotationZ'> Rotation par les Z</input><br><input type='button' id='validrot' value='valider'></div></div></form></div>"+
    "<aside id='aside' class='HolyGrail-ads inserted'><h3 id='titrboutons'> Fonctions globales : </h3><h3 id='infosmesh'> Informations de l'appareil: </h3><div id='infotemp'></div></aside>" ;

    $("#insererici").append(contenu);

    $("#titrboutons").append("<button id='joinM' class='btn'> Assembler des Mesh </button>");
    $("#titrboutons").append("<button id='joinNow' class='btn' style='display:none' > Join</button>"); //boutton de validation de l'assemblage des mesh
    $("#titrboutons").append("<button id='clickbox' class='btn'  > Ajouter un cube </button>");
    $("#titrboutons").append("<button id='clicksphere' class='btn'  > Ajouter une sphère </button>");
    $("#titrboutons").append("<button id='clickobj' class='btn'  > Ajouter un objet </button>");
  }


  // MODE VISU
  if(modeConstruction == false && modeVisu == true){

    contenu += "<ul class='jctx jctx-id-foo jctx-white jctx-black-shadow inserted' ><li data-action='close' style='background-color : red'>Close Menu</li><li data-action='Delete' id='deleteM'>Delete</li>"+
        "<li data-action='bounce' id='bounce'>Bounce</li><li data-action='stopBounce' id='stopbounce'>Stop Bounce</li><hr><li data-action='Infos' id='infos'>Infos</li>"+
        "<li data-action='new_cls'>New class</li><li data-action='new_intf' class='disabled'>New interface (a disabled entry)</li></ul>"+
    "<aside id='aside' class='inserted'><h3 id='infosmesh'> Informations de l'appareil: </h3> <div id='infotemp'></div><div id='infotemp'></div><canvas id ='graphcanvas'></canvas></aside>" ;
    $("#insererici").append(contenu);

  }
}

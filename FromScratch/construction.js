/********************************************

    Script permettant de construire dynamiquement le fichier HTML
    pour s'adapter au mode choisi : Visualisation ou édition.
    Principalement composé d'insertions HTML en Jquery (beaucoup plus simple et rapide que le js de base)

********************************************************/

var modeConstruction = true;
var modeVisu = false;


// De base, on insère tous les boutons dans le html. Ensuite, en fonction du mode sélectionné, on choisit de les afficher ou non

$("#titrboutons").append("<button id='createStream' class='btn'> Créer un flux </button>");
$("#titrboutons").append("<button id='clickbox' class='btn'  > Ajouter un cubeee </button>"); //cubeS
$("#titrboutons").append("<button id='clickXWall' class='btn'  > Ajouter un Mur Horizontal </button>");
$("#titrboutons").append("<button id='clickZWall' class='btn'  > Ajouter un Mur Vertical </button>");
$("#titrboutons").append("<button id='clicksphere' class='btn'  > Ajouter une sphère </button>");
$("#titrboutons").append('<button id="clickobj" class="btn"  > Ajouter un objet </button>');
$("#titrboutons").append("<button id='deleteM' class='btn'> Delete Mesh</button>");
$("#titrboutons").append("<button id='joinM' class='btn'> Assembler des Mesh </button>");
$("#titrboutons").append("<button id='clear' class='btn'  > Clear </button>");
$("#titrboutons").append("<button id='joinNow' class='btn' style='display:none' > Join</button>"); //boutton de validation de l'assemblage des mesh
$("#titrboutons").append("<button id='bounce' class='btn'> Bounce</button>");
$("#titrboutons").append("<button id='stopbounce' class='btn' style = 'display:none'> Stop Bounce</button>");





function CreationPage(){
  var contenu = "";
  if(modeConstruction == true && modeVisu == false){
    contenu += "<div id=buttons class='HolyGrail-nav'><form method='post' id='contient'><h3 id='titreform'>Paramètres globaux : </h3><div id='container'><div id='scaling'><h5> Modif Taille : </h5><input type='number' name='scalin gX' id='scalingX'>Modifier Taille X</input><input type='number' name='scalingY' id='scalingY'>Modifier Taille Y</input><input type='number' name='scalingZ' id='scalingZ'>Modifier Taille Z</input> <br><input type='button' id='validscaling' value='valider'></input></div><br>"
    +"<div id='rotation'><h5> Rotation : </h5><input type='number' step='any' max='1' name='rotationX' id='rotationX'> Rotation par les X</input><input type='number' step='any' max='1' name='rotationY' id='rotationY'> Rotation par les Y</input><input type='number' step='any' max='1' name='rotationZ' id='rotationZ'> Rotation par les Z</input><br><input type='button' id='validrot' value='valider'></div></div></form></div><aside id='aside' class='HolyGrail-ads'><h3 id='titrboutons'> Fonctions ouaisouais : </h3><input type='checkbox' id='checkground'><label for='checkground'>Masquer le plan</label><h3 id='infosmesh'> Informations de l'objet: </h3></aside>" ;
    $("#insererici").append(contenu);

  //  $("#infosmesh").append("  <div id='infotemp'></div><canvas id='graphcanvas'> </canvas>");

    $("#createStream").css("display","block");
    $("#clickbox").css("display", "block");
    $("#clickXwall").css("display", "block");
    $("#clickZwall").css("display","block");
    $("#clicksphere").css("display","block");
    $("#clickobj").css("display","block");
    $("#deleteM").css("display","block");
    $("#joinM").css("display","block");
    $("#clear").css("display","block");
    $("#joinNow").css("display", "none");
    $("#bounce").css("display","block");
    $("#stopbounce").css("display","block");
    $("#graphcanvas").css("display","none");


    console.log(document.getElementById("createStream"));

  }

  if(modeConstruction == false && modeVisu == true){
    $("#createStream").css("display","none");
    $("#clickbox").css("display", "none");
    $("#clickXwall").css("display", "none");
    $("#clickZwall").css("display","none");
    $("#clicksphere").css("display","none");
    $("#clickobj").css("display","none");
    $("#deleteM").css("display","none");
    $("#joinM").css("display","none");
    $("#clear").css("display","none");
    $("#joinNow").css("display", "none");
    $("#bounce").css("display","none");
    $("#stopbounce").css("display","none");

  //  <script style="text/javascript" src="chart.js" defer></script> //charger le js pour avoir les graph seulement en mode visu
  }


}

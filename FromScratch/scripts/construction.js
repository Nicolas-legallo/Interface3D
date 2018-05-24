/********************************************

    Script permettant de construire dynamiquement le fichier HTML
    pour s'adapter au mode choisi : Visualisation ou édition.
    Principalement composé d'insertions HTML en Jquery (beaucoup plus simple et rapide que le js de base)

********************************************************/
var insertion = $("#insererici");
var contenu = "";
var menu = "";
var modeConstruction = false;
var modeVisu = true;

$(window).ready(function(){
  CreationPage();
  $("#switchmode").click(function(){
    modeConstruction = !modeConstruction;
    modeVisu = !modeVisu;
    $("#insererici").children().filter(":not(#pasca)").remove();
    $("#menuonglets").children().filter(":not(#switchmode)").remove();
    CreationPage();
    $("#biblio").hide();
    $("#formrotation").hide();
  });
});

function CreationPage(){
  contenu = "";
  menu = "";
  // MODE CONSTRU
  if(modeConstruction == true && modeVisu == false){

    contenu +=   "<div id='buttons' class='HolyGrail-nav'><div id='toggler'>Importer un objet</div><div id='biblio' ><figure><img src='./plan.png' id='clickbox' alt='Cube.png' height='64' width='64'><figcaption> Cube </figcaption></figure><figure><img src='./plan.png' id='clickligneprod' alt='ligneprod.png' height='64' width='64'><figcaption> Ligne Prod</figcaption></figure>"+
          "<figure><img src='./plan.png' id='clickchariot' alt='chariot.png' height='64' width='64'><figcaption> Chariot</figcaption></figure><figure><img src='./plan.png' id='clickstock1' alt='stock1.png' height='64' width='64'><figcaption>Stock 1</figcaption></figure>"+
          "<figure><img src='./plan.png' id='clickstock2' alt='stock2.png' height='64' width='64'><figcaption>Stock 2</figcaption></figure><figure><img src='./plan.png' id='clickstock3' alt='stock3.png' height='64' width='64'><figcaption>Stock 3</figcaption></figure>"+
          "<figure><img src='./plan.png' id='clickcamera' alt='camera.png' height='64' width='64'><figcaption>Camera</figcaption></figure><figure><img src='./plan.png' id='clickcopilote' alt='postecopilote.png' height='64' width='64'><figcaption>Poste</figcaption></figure>"+
          "<figure><img src='./plan.png' id='clickrail' alt='rail.png' height='64' width='64'><figcaption>Rail</figcaption></figure><figure><img src='./plan.png' alt='Smiley face' height='64' width='64'><figcaption> 404 </figcaption></figure>"+
          "<figure><img src='./plan.png' alt='Smiley face' height='64' width='64'><figcaption> 404 </figcaption></figure><figure><img src='./plan.png' alt='Smiley face' height='64' width='64'><figcaption> 404 </figcaption></figure>"+
          "<figure><img src='./plan.png' alt='Smiley face' height='64' width='64'><figcaption> 404 </figcaption></figure><figure><img src='./plan.png' alt='Smiley face' height='64' width='64'><figcaption> 404 </figcaption></figure>"+
          "<figure><img src='./plan.png' alt='Smiley face' height='64' width='64'><figcaption> 404 </figcaption></figure><figure><img src='./plan.png' alt='Smiley face' height='64' width='64'><figcaption> 404 </figcaption></figure>"+
          "<figure><img src='./plan.png' alt='Smiley face' height='64' width='64'><figcaption> 404 </figcaption></figure><figure><img src='./plan.png' alt='Smiley face' height='64' width='64'><figcaption>404</figcaption></figure></div>"+

          "<div id='toggler2'>Paramètres globaux :</div><div id='formrotation'><form method='post' id='contient'><div id='container'><div id='scaling'>"+
          "<h5> Modif Taille : </h5><input type='number' name='scalingX' id='scalingX'>Modifier Taille X</input><input type='number' name='scalingY' id='scalingY'>Modifier Taille Y</input>"+
          "<input type='number' name='scalingZ' id='scalingZ'>Modifier Taille Z</input> <br><input type='button' id='validscaling' value='valider'></input></div><br>"
          +"<div id='rotation'><h5> Rotation : </h5><input type='number' step='any' max='1' name='rotationX' id='rotationX'> Rotation par les X</input><input type='number' step='any' max='1' name='rotationY' id='rotationY'> Rotation par les Y</input>"+
          "<input type='number' step='any' max='1' name='rotationZ' id='rotationZ'> Rotation par les Z</input><br><input type='button' id='validrot' value='valider'></div></div></form></div></div>"+
          "<ul  class='jctx jctx-id-foo jctx-white jctx-black-shadow inserted'><li data-action='close' style='background-color : red'>Close Menu</li><li data-action='Delete' id='deleteM'>Delete</li>"+
        "<li data-action='bounce' id='bounce'>Bounce</li><li data-action='stopBounce' id='stopbounce'>Stop Bounce</li><hr><li data-action='Infos' id='infos'>Infos</li>"+
        "<li data-action='new_cls'>New class</li><li data-action='new_intf' class='disabled'>New interface (a disabled entry)</li></ul>"+
    "<aside id='aside' class='HolyGrail-ads inserted'><h3 id='titrboutons'> Fonctions globales : </h3><h3 id='infosmesh'> Autres </h3><div id='infotemp'></div></aside>" ;


    $("#insererici").append(contenu);

    $("#titrboutons").append("<button id='joinM' class='btn'> Assembler des Mesh </button>");
    $("#titrboutons").append("<button id='joinNow' class='btn' style='display:none' > Join</button>"); //boutton de validation de l'assemblage des mesh
    $("#titrboutons").append("<button id='clickbox' class='btn'  > Ajouter un cube </button>");
    $("#titrboutons").append("<button id='clicksphere' class='btn'  > Ajouter une sphère </button>");
    $("#titrboutons").append("<button id='clickligneprod' class='btn'  > Ajouter un objet </button>");

    menu += "<button type='button' class='btn btn-secondary' id='checkground'>Afficher/Masquer le plan</button><button type='button' class='btn btn-secondary' id='clear'>Clear</button>"+
    "<button type='button' class='btn btn-secondary' id='createStream'><img src='/usine3D/FromScratch/img/logo/Ajouter_sans_contour24x24.png'>Flux</button>"+
    "<button type='button' class='btn btn-secondary' id='addWall'> Créer un mur</button>";

    $("#menuonglets").prepend(menu);

  }

  // MODE VISU
  if(modeConstruction == false && modeVisu == true){

    contenu += "<ul class='jctx jctx-id-foo jctx-white jctx-black-shadow inserted' ><li data-action='close' style='background-color : red'>Close Menu</li><li data-action='Delete' id='deleteM'>Delete</li>"+
        "<li data-action='bounce' id='bounce'>Bounce</li><li data-action='stopBounce' id='stopbounce'>Stop Bounce</li><hr><li data-action='Infos' id='infos'>Infos</li>"+
        "<li data-action='new_cls'>New class</li><li data-action='new_intf' class='disabled'>New interface (a disabled entry)</li></ul>"+
    "<aside id='aside' class='HolyGrail-ads inserted'><h3 id='infosmesh'> Informations de l'appareil: </h3> <div id='infotemp'></div><div id='infotemp'></div><canvas id ='graphcanvas'></canvas></aside>" ;
    $("#insererici").append(contenu);


    menu +="<button type='button' class='btn btn-secondary' id='checkground'>Afficher/Masquer le plan</button>";
    $("#menuonglets").prepend(menu);

  }
}

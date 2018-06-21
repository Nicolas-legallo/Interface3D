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
var currentmode = "";



$(window).ready(function(){ // au chargement de la page
  CreationPage(); //on appelle la fonction pour générer la page
  $("#switchmode").click(function(){ //lors d'un clic sur le bouton de changement de mode
    modeConstruction = !modeConstruction;
    modeVisu = !modeVisu; //les variables s'inversent pour sélectionner l'autre mode
    $("#insererici").children().filter(":not(#pasca)").remove(); //on supprime tous les éléments du html sauf le canvas
    $("#menuonglets").children().filter(":not(#switchmode,#divcurrentmode)").remove(); //on supprime tous les éléments du menu sauf le bouton de switch et le bandeau informatif
    CreationPage(); // on appelle la fonction de création qui va recréer la page avec le mode choisi
    $("#biblio").hide(); // on cache les deux onglets déroulants à gauche pour qu'ils soient fermés au chargement de la page.
    $("#formrotation").hide();

  });
});

function CreationPage(){
  contenu = ""; //on réinitialise les valeurs des variables;
  menu = "";
  currentmode = "";
  $("#currentmode").text("");


  // MODE CONSTRU
  if(modeConstruction == true && modeVisu == false){


    contenu +=   "<div id='buttons' class='HolyGrail-nav'><div id='toggler'>Importer un objet <img id='flechebibli' class='toggleup' src='/usine3D/FromScratch/img/logo/bas16x16.png'></div><div id='biblio'>  <div class='tab'><button class='tablinks selectedcontent' id='tab1'>Transfo</button><button class='tablinks' id='tab2'>Stockage</button><button class='tablinks' id='tab3'>Autre</button></div>"+
          " <div id='content1' class='tabcontent'><figure><img src='/usine3D/FromScratch/img/screens/cube.png' id='clickbox' alt='Cube.png' height='64' width='64'><figcaption> Cube </figcaption></figure><figure><img src='/usine3D/FromScratch/img/screens/lignep.png' id='clickligneprod' alt='ligneprod.png' height='64' width='64'><figcaption> Ligne Prod</figcaption></figure>"+
          "<figure><img src='/usine3D/FromScratch/img/screens/chariot.png' id='clickchariot' alt='chariot.png' height='64' width='64'><figcaption> Chariot</figcaption></figure><figure><img src='/usine3D/FromScratch/img/screens/stock1.png' id='clickstock1' alt='stock1.png' height='64' width='64'><figcaption>Stock 1</figcaption></figure></div>"+
          "<div id='content2' class='tabcontent'><figure><img src='/usine3D/FromScratch/img/screens/stock2.png' id='clickstock2' alt='stock2.png' height='64' width='64'><figcaption>Stock 2</figcaption></figure><figure><img src='./plan.png' id='clickstock3' alt='stock3.png' height='64' width='64'><figcaption>Stock 3</figcaption></figure>"+
          "<figure><img src='./plan.png' id='clickcamera' alt='camera.png' height='64' width='64'><figcaption>Camera</figcaption></figure><figure><img src='/usine3D/FromScratch/img/screens/poste.png' id='clickcopilote' alt='postecopilote.png' height='64' width='64'><figcaption>Poste</figcaption></figure></div>"+
          "<div id='content3' class='tabcontent'><figure><img src='./plan.png' id='clickrail' alt='rail.png' height='64' width='64'><figcaption>Rail</figcaption></figure><figure><img src='./plan.png' id='cuisiniere' alt='Smiley face' height='64' width='64'><figcaption>Cuisinière</figcaption></figure>"+
          "<figure><img src='./plan.png' id='clickpalette' alt='palette.png' height='64' width='64'><figcaption> Palette </figcaption></figure><figure><img src='./plan.png' id='clickcuve' alt='Smiley face' height='64' width='64'><figcaption> Cuve </figcaption></figure>"+
          "<figure><img src='./plan.png' alt='Smiley face' height='64' width='64'><figcaption> 404 </figcaption></figure><figure><img src='./plan.png' alt='Smiley face' height='64' width='64'><figcaption> 404 </figcaption></figure>"+
          "<figure><img src='./plan.png' alt='Smiley face' height='64' width='64'><figcaption> 404 </figcaption></figure><figure><img src='./plan.png' alt='Smiley face' height='64' width='64'><figcaption> 404 </figcaption></figure>"+
          "<figure><img src='./plan.png' alt='Smiley face' height='64' width='64'><figcaption> 404 </figcaption></figure><figure><img src='./plan.png' alt='Smiley face' height='64' width='64'><figcaption>404</figcaption></figure></div></div>"+

          "<div id='toggler2'>Paramètres globaux  <img id='flecherot' class ='toggleup' src='/usine3D/FromScratch/img/logo/bas16x16.png'></div><div id='formrotation'><form method='post' id='contient'><div id='container'><div id='scaling'>"+
          "<h5> Modif Taille : </h5><input type='number' name='scalingX' id='scalingX'>Modifier Taille X</input><input type='number' name='scalingY' id='scalingY'>Modifier Taille Y</input>"+
          "<input type='number' name='scalingZ' id='scalingZ'>Modifier Taille Z</input> <br><input type='button' id='validscaling' value='valider'></input></div><br>"
          +"<div id='rotation'><h5> Rotation : </h5><input type='number' step='any' max='1' name='rotationX' id='rotationX'> Rotation par les X (en degrés)</input><input type='number' step='any' max='1' name='rotationY' id='rotationY'> Rotation par les Y (en degrés)</input>"+
          "<input type='number' step='any' max='1' name='rotationZ' id='rotationZ'> Rotation par les Z (en degrés)</input><br><input type='button' id='validrot' value='valider'></div></div></form></div></div>"+
          "<ul  id='menudroit' class='jctx jctx-id-foo jctx-white jctx-black-shadow inserted'><li data-action='close' style='background-color : red'>Close Menu</li><li data-action='Delete' id='deleteM'>Delete</li>"+
        "<li data-action='bounce' id='bounce'>Bounce</li><li data-action='stopBounce' id='stopbounce'>Stop Bounce</li><hr><li data-action='Infos' id='infos'><img src='/usine3D/FromScratch/img/logo/Info_16x16.png'>Infos</li></ul></div>";
    // "<aside id='aside' class='HolyGrail-ads inserted'><h3 id='titrboutons'> Fonctions globales : </h3><h3 id='infosmesh'> Autres </h3><div id='infotemp'></div></aside>" ;


    $("#insererici").append(contenu);

    menu += "<button type='button' class='btn btn-secondary' id='checkground'>Afficher/Masquer le plan</button><button type='button' class='btn btn-secondary' id='clear'>Clear</button>"+
    "<button type='button' class='btn btn-secondary' id='createStream'><img src='/usine3D/FromScratch/img/logo/Ajouter_sans_contour24x24.png'>Flux</button>"+
    "<button type='button' class='btn btn-secondary' id='addWall'> Créer un mur</button>"+
    "<button type='button' class='btn btn-secondary' id='joinM'> Assembler des Mesh</button>"+
    "<button type='button' class='btn btn-secondary' id='joinNow' style='display : none'> Join</button>"+
    "<button type='button' class='btn btn-secondary' id='importjson'> Importer Json</button>";

    $("#menuonglets").prepend(menu);
    engine.resize();
    currentmode = "Mode actuel : Construction";
    $("#currentmode").text(currentmode);

  }

  // MODE VISU
  if(modeConstruction == false && modeVisu == true){

    contenu += "<ul id='menudroit' class='jctx jctx-id-foo jctx-white jctx-black-shadow inserted' ><li data-action='close' style='background-color : red'>Close Menu</li><li data-action='Delete' id='deleteM'>Delete</li>"+
        "<li data-action='bounce' id='bounce'>Bounce</li><li data-action='stopBounce' id='stopbounce'>Stop Bounce</li><hr><li data-action='Infos' id='infos'><img id='logoinfo' src='/usine3D/FromScratch/img/logo/Info_16x16.png'>Infos</li></ul>"+
    "<aside id='aside' class='HolyGrail-ads inserted'><h4 id='infosmesh'> Informations de l'appareil: </h4> <div id='infotemp' class='infotemp2'></div><div id='infotemp2'></div><canvas id ='graphcanvas'></canvas></aside>" ;
    $("#insererici").append(contenu);


    menu +="<button type='button' class='btn btn-secondary' id='checkground'>Afficher/Masquer le plan</button>";
    $("#menuonglets").prepend(menu);
    engine.resize();
    currentmode = "Mode actuel : Visualisation";
    $("#currentmode").text(currentmode);


  }
}


var content = "";
var construct = true;
var visualize = false;

function Create(){
      content = "";

      if(construct == true && visualize == false){
        content += "<div id='1'> <p> hello</p></div><div><p>Insert a lot of html here</p></div>";
        $("insertHere").append(content);
      }
      if(construct == false && visualize == true){
        content += "<div id='not1'><p> Definitely not the same content as the construct one</p></div>";
        $("insertHere").append(content);
      }
}

$(window).ready(function(){
  Create();
  $("#switchmode").click(function(){
    construct = !construct;
    visualize = !visualize;
  // INSERT THE SOLUTION TO CLEAR THE HTML HERE
    CreationPage();
  });
});



<!DOCTYPE html>
<html>

<head>

    <meta http-equiv="Content-Type" content="text/html" charset="utf-8" />
</head>

<body id="body" class="HolyGrail">
    <header>
        <link rel="stylesheet" type="text/css" href="style.css" media="all">
        <link rel="stylesheet" href=".\bootstrap\css\bootstrap.css">
        <link rel="stylesheet" href="justcontext.css">
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css" integrity="sha384-9gVQ4dYFwwWSjIDZnLEWnxCjeSWFphJiwGPXr1jddIhOegiu1FwO5qRGvFXOdJZ4" crossorigin="anonymous">
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js" defer></script>
        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/js/bootstrap.min.js" integrity="sha384-uefMccjFJAIv6A+rW+L4AHf99KvxDjWSu1z9VI8SKNVmz4sk7buKt/6v9KI65qnm" crossorigin="anonymous"></script>
        <script style="text/javascript" src="scripts/construction.js" defer></script>
      </header>

    <div id='menuonglets' class='btn-group' role='group' aria-label='Basic example'>
      <button type='button' class='btn btn-secondary' id='switchmode'>Mode Visu/ Mode Constru</button>
    </div>

    <div class='HolyGrail-body' id='insertHere'>
      <main class='HolyGrail-content'>
          <canvas id='renderCanvas'></canvas>
      </main>
      <!-- Things are inserted here -->
    </div>
</body>
</html>

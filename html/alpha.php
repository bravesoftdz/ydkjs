<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>You Don't Know Jack® ALPHA FR</title>
<link href="css/ydkj.css" rel="stylesheet"/>
<script src="js/jquery-1.11.0.min.js" type="text/javascript"></script>
<script src="js/YDKJ.js?ver=1" type="text/javascript"></script>

<script type="text/javascript">

jQuery(document).ready(function() {
  var game = new YDKJ();
  game.start();
});

</script>
</head>

<body style="background-color:#000;margin:0;padding:0;border:0">
  <div style="text-align:center;font-size:20px;margin:5px;font-family:JackCondensed, sans-serif"><a href="/" style="color:#666">Retour à l'accueil</a></div>
  <div id="screen" style="background-color:#000;position:relative;width:640px;height:480px;overflow:hidden;margin-left:auto;margin-right:auto">
    <img src="ajax-loader.gif" style="position:absolute;left:293px;top:212px" class="markedAsRemoved"/>
  </div> <!-- Couleur #EEE pour l'intro -->
  <div id="debuglive" style="display:none;background-color:#000;color:#FFF;padding:5px;margin-top:10px;"><br/></div>
  <div id="debug" style="display:none;background-color:#000;color:#FFF;padding:5px;margin-top:10px;height:150px;overflow-y:scroll"></div>
  <div id="tmpscreen" style="display:none"></div>
  <div id="preload" style="display:none"></div>
</body>
</html>
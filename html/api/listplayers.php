<?php

require 'local/config.inc.php';
require 'common.inc.php';
require 'mysql.inc.php';

session_start();

if (!isset($_SESSION['player_id'])) die('Connect to a session first');

connectMysql('dyn');
$player_id = $_SESSION['player_id'];
$res = $DB->query("SELECT * FROM players WHERE id = " . $player_id);
if ($rs = $res->fetch()) {
    $_SESSION['session_id'] = $rs['session_id'];
} else {
    unset($_SESSION['session_id']);
    unset($_SESSION['player_id']);
    session_write_close();
    die('Unknown player ID');
}

$session_id = $_SESSION['session_id'];
$res = $DB->query("SELECT * FROM sessions WHERE id = " . $session_id);
if ($rs = $res->fetch()) {
    $player_host = $rs['player_host'];
    $status = $rs['status'];
    $nbquestions = $rs['nbquestions'];
    $public = $rs['public'];
} else {
    unset($_SESSION['session_id']);
    session_write_close();
    die('Unknown session ID');
}

$sql = '';
if (isset($_POST['player_nick'])) {
    $player_nick = $_POST['player_nick'];
    $sp = explode(',',$player_nick);
    $nicks = array();
    foreach($sp as $nick) if (trim($nick) != '') array_push($nicks, trim($nick));
    $sql = ", nicknames = '".addslashes(implode(', ',$nicks))."'";
}

// Mise à jour du last_ping
$DB->query("UPDATE players SET last_ping = NOW() ".$sql." WHERE id = " . $player_id);
session_write_close();
cleanSessions();

$is_host = 0;
if ($player_host == $player_id) $is_host = 1;

$readonly = 0;
if (isset($_POST['readonly'])) $readonly = intval($_POST['readonly']);

$game_starting = 0;
if (($is_host) && (!$readonly)) {
    if (isset($_POST['game_starting'])) $game_starting = intval($_POST['game_starting']);
    if (($game_starting != 0) && ($game_starting != 1) && ($game_starting != 2)) $game_starting = 0;
    if (($status < 2) && ($game_starting < 2)) {
        $status = $game_starting;
        $public = intval($_POST['public']);
        $nbquestions = intval($_POST['nbquestions']);
        if (!$nbquestions) $nbquestions = 7;
        $DB->query("UPDATE sessions SET status = ".$status.", public = ".$public.", nbquestions = ".$nbquestions." WHERE id = " . $session_id);
    }

    $participants = array();
    if (isset($_POST['players_participants'])) $participants = $_POST['players_participants'];
    $list_participants = '';
    foreach($participants as $p_id) {
        if ($list_participants != '') $list_participants .= ',';
        $list_participants .= intval($p_id);
    }
    if ($list_participants != '') $list_participants = 'id IN ('.$list_participants.')'; else $list_participants = '1 = 0';
    $DB->query("UPDATE players SET spectator = IF(".$list_participants." AND nicknames != '',0,1) WHERE session_id = " . $session_id);
}

$players = array();
$res = $DB->query("SELECT * FROM players WHERE session_id = " . $session_id . " ORDER BY id");
while ($rs = $res->fetch()) {
    $player = array('id' => $rs['id'], 'nicknames' => htmlspecialchars($rs['nicknames']), 'spectator' => $rs['spectator']);
    array_push($players, $player);
}

if (($game_starting == 2) && ($status != 2)) {
    // Démarrage de la partie !
    $nbplayers = 0;
    $playerids = array(0,0,0);
    $nicks = array('','','');
    foreach($players as $player) if (!$player['spectator']) {
        $sp = explode(',',$player['nicknames']);
        foreach($sp as $nick) if (trim($nick) != '') {
            $playerids[$nbplayers] = $player['id'];
            $nicks[$nbplayers] = trim($nick);
            $nbplayers++;
            if ($nbplayers == 3) break;
        }
    }
    if ($nbplayers == 0) {
        $status = 0;
        $DB->query("UPDATE sessions SET status = ".$status." WHERE id = " . $session_id);
    } else {
        $status = 2;
        $DB->query("UPDATE sessions SET status = ".$status.",
                    nbplayers = ".$nbplayers.",
                    player1 = ".intval($playerids[0]).",
                    nick1 = '".addslashes($nicks[0])."',
                    player2 = ".intval($playerids[1]).",
                    nick2 = '".addslashes($nicks[1])."',
                    player3 = ".intval($playerids[2]).",
                    nick3 = '".addslashes($nicks[2])."'
                    WHERE id = " . $session_id);
    }
}

echo json_encode(array(
        'players' => $players,
        'status' => $status,
        'nbquestions' => $nbquestions,
        'public' => $public
    ));

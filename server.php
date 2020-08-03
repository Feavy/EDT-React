<?php
header("Access-Control-Allow-Origin: *");
$allowed = true;
$fromBackup = false;

if(isset($_GET['week']) && is_numeric($_GET['week']) && $allowed) {
    $year = date("Y");
    if(isset($_GET['year']) && is_numeric($_GET['year']) && abs($year-$_GET['year']) <= 1)
        $year = $_GET['year'];
        
    $count = file_get_contents("count.html");
    file_put_contents("count.html", $count+1);
    
    ini_set('default_socket_timeout', ($fromBackup) ? 0 : 5);
    
    $week = $_GET['week']."";
    
    $xml = file_get_contents("http://flopedt.iut-blagnac.fr/edt/INFO/fetch_cours_pl/".$year."/".$week."/0");
    
    if($xml === FALSE && file_exists($week."-".$year))
        $xml = file_get_contents($week."-".$year);
    elseif($xml !== FALSE && (!file_exists($week."-".$year) || date("d", filemtime($week."-".$year)) != date("d")))
        file_put_contents($week."-".$year, $xml);
    if(isset($_GET['infos'])) {
        $xml .= "\n".file_get_contents("http://flopedt.iut-blagnac.fr/edt/INFO/fetch_bknews/".$year."/".$week);
    }
    
    echo $xml;
}
?>
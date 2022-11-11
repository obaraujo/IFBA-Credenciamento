<?php
header("Access-Control-Allow-Origin: *");
$information_complete = array_key_exists('checkin_code', $_POST);

if ($information_complete) {
  /**
   * ´esse arquivo retorna a instancia do mysqli, seguindo assim:
   * $conn = new mysqli($hostname, $username, $password, $database);
   */
  include('./connect-db.php');

  $sql = "INSERT INTO `present` (`checkin_code`) VALUES ('" . $_POST['checkin_code'] . "');";
  $result = $conn->query($sql);

  if (array_key_exists('day_16', $_POST)) {
    if ($_POST['day_16'] !== "") {
      $sql = "UPDATE `present` SET `day_16` = '" . $_POST['day_16'] . "' WHERE `present`.`checkin_code` = '" . $_POST['checkin_code'] . "'; ";
      $result = $conn->query($sql);
    }
  }

  if (array_key_exists('day_17', $_POST)) {
    if ($_POST['day_17'] !== "") {
      $sql = "UPDATE `present` SET `day_17` = '" . $_POST['day_17'] . "' WHERE `present`.`checkin_code` = '" . $_POST['checkin_code'] . "'; ";
      $result = $conn->query($sql);
    }
  }

  $result =  $conn->query("SELECT * FROM `present` WHERE `present`.`checkin_code` = '" . $_POST['checkin_code'] . "';")->fetch_all()[0];
  echo json_encode([
    "state" => $result[array_key_exists('day_17', $_POST) ? 2 : 1],
    'days' =>  [
      "day_16" => $result[1],
      "day_17" => $result[2],
    ]
  ]);

  die();
}

header("Location: https://stagon.in/semanapreta/credenciamento/", true, $status);
die();

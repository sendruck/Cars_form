<?php 
    if (isset($_POST['key'])) {

        $con = mysqli_connect('localhost', 'root', '', 'first-lab');

        if ($_POST['key'] == 'addnew') {
            $model = $_POST['model'];
            $marka = $_POST['marka'];
            $year = $_POST['year'];
            $type = $_POST['type'];
            $engine = $_POST['engine'];
            $color = $_POST['color'];
            $cena = $_POST['cena'];

            $result = mysqli_query($con, "INSERT INTO cars(model,marka,year,type,engine,color,cena) VALUES ('$model', '$marka', '$year', '$type', '$engine', '$color', '$cena')");
        
            // if($result == 'true') 
            // {echo $model, $marka, $year, $type, $engine, $color, $cena;}
            // else{echo "Ваші дані не додані";}

            if($result == 'true') {
                header('Access-Control-Allow-Origin: *');
                header('Content-type: application/json');
                    $response = array();
                    $response = array(
                        'model' => $model,
                        'marka'=> $marka,
                        'year'=> $year,
                        'type'=> $type,
                        'engine'=> $engine,
                        'color'=> $color,
                        'cena'=> $cena,
                    );

                echo json_encode($response); 
            }
        }
    }

    if (isset($_GET['key'])) {
        $con = mysqli_connect('localhost', 'root', '', 'first-lab');

        if ($_GET['key'] == 'get_all') {

            $allData = mysqli_query($con, 'SELECT * FROM `cars` ORDER BY id DESC');
            if (mysqli_num_rows($allData) > 0) {
                $reponse = array();
                $n = 0; 
                while($row =  mysqli_fetch_array($allData)) {
                    $response[] =  $row; 
                }
                header("Content-type:application/json");                 
                echo json_encode($response); 
                }
        }
    }   
?>
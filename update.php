<?php 
    if (isset($_POST['id'])) {
        $row_number = $_POST['id'];
        $con = mysqli_connect('localhost', 'root', '', 'first-lab');
            
            $model = $_POST['model'];
            $marka = $_POST['marka'];
            $year = $_POST['year'];
            $type = $_POST['type'];
            $engine = $_POST['engine'];
            $color = $_POST['color'];
            $cena = $_POST['cena'];
            

            $result = mysqli_query($con, "UPDATE cars SET model='$model', marka='$marka', year='$year', type='$type', engine='$engine', color='$color', cena='$cena' WHERE id='$row_number'");
            if($result == 'true') {
                header('Access-Control-Allow-Origin: *');
                header('Content-type: application/json');
                    $response = [
                        'model' => $model,
                        'marka'=> $marka,
                        'year'=> $year,
                        'type'=> $type,
                        'engine'=> $engine,
                        'color'=> $color,
                        'cena'=> $cena,
                    ];

                echo json_encode($response); 
            }
    } 
?>
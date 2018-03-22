<?php 
    if (isset($_POST['del_id'])) {
        $row_number = $_POST['del_id'];
        $con = mysqli_connect('localhost', 'root', '', 'first-lab');

        $query = "DELETE FROM cars WHERE id=$row_number";
        $result = mysqli_query($con, $query);
        if($result) {
            echo "$row_number";
        } else {
            echo "NO";
        }
    } 
?>
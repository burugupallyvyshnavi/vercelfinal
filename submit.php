<?php
include 'connect.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['name'];
    $phone = $_POST['phone'];

    $sql = "INSERT INTO form_data (name, phone) VALUES ('$name', '$phone')";

    if (mysqli_query($conn, $sql)) {
        echo "Form submitted successfully!";
    } else {
        echo "Error: " . mysqli_error($conn);
    }
}
?>

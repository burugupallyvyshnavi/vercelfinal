<?php
// Database connection setup
$servername = "localhost";
$username   = "root";       // default for XAMPP
$password   = "";           // default is blank
$database   = "admin";      // your database name (as seen in phpMyAdmin)

// Create connection
$conn = mysqli_connect($servername, $username, $password, $database);

// Check connection
if (!$conn) {
    die("<h3 style='color:red;'>Connection failed: " . mysqli_connect_error() . "</h3>");
}

// Get form data safely
$name  = mysqli_real_escape_string($conn, $_POST['name']);
$phone = mysqli_real_escape_string($conn, $_POST['phone']);

// Insert query (note the backticks around `phone number` because of the space)
$sql = "INSERT INTO admin (`name`, `phone number`) VALUES ('$name', '$phone')";

// Execute and show message
if (mysqli_query($conn, $sql)) {
    echo "<h3 style='color:green;'>Form submitted successfully!</h3>";
} else {
    echo "<h3 style='color:red;'>Error: " . mysqli_error($conn) . "</h3>";
}

// Close connection
mysqli_close($conn);
?>

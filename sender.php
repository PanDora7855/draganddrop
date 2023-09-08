<?php

if(!empty($_FILES['file'])){
    $targetDir = 'uploads/';
    foreach($_FILES['file']['name'] as $key => $name) {
        $filename = basename($_FILES['file']['name'][$key]);
        $targetFilePath = $targetDir.$filename;
        if(move_uploaded_file($_FILES['file']['tmp_name'][$key], $targetFilePath)){
            echo 'File Uploaded</br>';
        }
    }
}
?>


<?php

if(!empty($_FILES['request'])){
    $targetDir = 'uploads/';
    foreach($_FILES['request']['name'] as $key => $name) {
        $filename = basename($_FILES['request']['name'][$key]);
        $targetFilePath = $targetDir.$filename;
        if(move_uploaded_file($_FILES['request']['tmp_name'][$key], $targetFilePath)){
            echo 'File Uploaded</br>';
        }
    }
}

if(!empty($_FILES['expert'])){
    $targetDir = 'uploads/';
    foreach($_FILES['expert']['name'] as $key => $name) {
        $filename = basename($_FILES['expert']['name'][$key]);
        $targetFilePath = $targetDir.$filename;
        if(move_uploaded_file($_FILES['expert']['tmp_name'][$key], $targetFilePath)){
            echo 'File Uploaded</br>';
        }
    }
}
?>


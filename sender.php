<?php

if(!empty($_FILES['request0'])){
    $targetDir = 'uploads/';
    foreach($_FILES['request0']['name'] as $key => $name) {
        $filename = basename($_FILES['request0']['name'][$key]);
        $targetFilePath = $targetDir.$filename;
        if(move_uploaded_file($_FILES['request0']['tmp_name'][$key], $targetFilePath)){
            echo 'File Uploaded</br>';
        }
    }
}

if(!empty($_FILES['expert1'])){
    $targetDir = 'uploads/';
    foreach($_FILES['expert1']['name'] as $key => $name) {
        $filename = basename($_FILES['expert1']['name'][$key]);
        $targetFilePath = $targetDir.$filename;
        if(move_uploaded_file($_FILES['expert1']['tmp_name'][$key], $targetFilePath)){
            echo 'File Uploaded</br>';
        }
    }
}
?>


<?php
    $dir = "uploads";
    if (is_dir($dir)) {
        if ($dh = opendir($dir)) {
            while (($file = readdir($dh)) !== false) {
                if (!is_dir($file)) {
                    echo $file."<br />";
                }
            }
            closedir($dh);
        }
    }
?>
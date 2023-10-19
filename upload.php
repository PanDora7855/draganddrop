<?php 
header('Content-Type: application/json; charset=utf-8');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, GET, POST");

// php -S 127.0.0.1:8080

$response = array();
$upload_dir = 'uploads/';
$server_url = 'http://127.0.0.1:8080';

// echo '<h1>POST:</h1><pre>';
// 	print_r($_POST);
// echo '</pre>';

// echo '<br>';

// echo '<h1>FILES:</h1><pre>';
// 	print_r($_FILES);
// echo '</pre>';

if($_FILES)
{
    foreach ($_FILES as $key => $value) {
        $count = count($value['name']);

        for ($i = 0; $i < $count; $i++) {

            $file_name = $value["name"][$i];
            $file_tmp_name = $value["tmp_name"][$i];
            $error = $value["error"][$i];
        
            if($error > 0){
                array_push($response,array(
                    "status" => "error",
                    "error" => true,
                    "message" => "Error uploading the file!"
                ));
            }else 
            {
                $upload_name = $upload_dir.strtolower($file_name);
                $upload_name = preg_replace('/\s+/', '-', $upload_name);
    
                if(move_uploaded_file($file_tmp_name , $upload_name)) {
    
                    $path = './'.$upload_name;
                    $type = pathinfo($path, PATHINFO_EXTENSION);
                    $data = file_get_contents($path);
                    $base64URL = 'data:' . $type . ';base64,' . base64_encode($data);
    
                      array_push($response,array(
                        "status" => "success",
                        "error" => false,
                        "message" => "File uploaded successfully",
                        "url" => $server_url."/".$upload_name,
                        "base64" => $base64URL,
                        "total" => $count
                      ));
                }else
                {
                    array_push($response,array(
                        "status" => "danger",
                        "error" => true,
                        "url" =>  $file_name,
                        "message" => "Error uploading the file!"
                    ));
                }
            }
        }
    
    }
}else
    {
        echo $_FILES;
        $response = array(
            "count" => $count,
            "status" => "error",
            "error" => true,
            "message" => print_r($_FILES['file'])
        );
    }
echo json_encode($response) . "\n";

?>






<?php

$posts = array(
  (object) [
    'title' => 'title 1',
    'color' => 'green'
  ],
  (object) [
    'title' => 'title 2',
    'color' => 'yellow'
   ],
   (object) [
     'title' => 'title 3',
     'color' => 'red'
   ]
);

echo json_encode($posts);

exit;

# ANOTHER WAY TO DO THIS:
$pages_array = array(
     array(
         'slug' => 'index',
         'title' => 'Site Index',
         'template' => 'interior'
     ),

     array(
         'slug' => 'a',
         'title' => '100% Wide (Layout A)',
         'template' => 'interior'
     ),

     array(
         'slug' => 'homepage',
         'title' => 'Homepage',
         'template' => 'homepage'
     )
);

?>

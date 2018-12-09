<?php

$GLOBALS["SITEMAP"] = "sitemap.xml";
$GLOBALS["SITE"] = "https://allekok.github.io/chepke-gull/#";
$GLOBALS["IGNORE"] = [".", "..", "list.txt", "list.php", "list.php~", "image", "index.html", "index.html~", ".git", "LICENSE", "README.md", "google0a141cc724bea402.html", "sw.js",$GLOBALS["SITEMAP"], "{$GLOBALS["SITEMAP"]}~", "sitemap.php", "sitemap.php~",".gitignore", "download.php", "q-download.php"];
$GLOBALS["DIRS"] = ".DIRS";
$GLOBALS["FILES"] = ".FILES";

// let's list directories.
function list_dirs ($path = ".") {

    $dir = opendir($path);
    $list = [ ];

    while(false !== ( $e = readdir($dir) ) ) {
        $current_path = "$path/$e";
        if(! is_dir($current_path) ) continue;
        if( in_array($e, $GLOBALS["IGNORE"]) ) continue;

        $list[] = $current_path;
        $list[] = list_dirs($current_path);
    }

    return $list;
    
}

// Now, let's list files.
function list_files ($path = ".") {

    $dir = opendir($path);
    $list = [];

    while(false !== ( $e = readdir($dir) ) ) {
        $current_path = "$path/$e";
        if(in_array($e, $GLOBALS["IGNORE"])) continue;

        if(is_dir ($current_path)) {
            $list[] = list_files($current_path);
        }
        else {
            $list[] = $current_path;
        }
    }

    return $list;
}

// https://github.com/appzcoder/30-seconds-of-php-code#deepflatten
function deepFlatten($items)
{
    $result = [];
    foreach ($items as $item) {
        if (!is_array($item)) {
            $result[] = $item;
        } else {
            $result = array_merge($result, deepFlatten($item));
        }
    }

    return $result;
}

function save_list ($filename) {
    $DIRS = deepFlatten(list_dirs());
    $FILES = deepFlatten(list_files());
    $array = array_merge($DIRS, $FILES);
    $towrite = "<?xml version='1.0' encoding='UTF-8'?>\n
<urlset xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"
xsi:schemaLocation=\"http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd\"
xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n";
    $towrite .= "\t<url>\n\t\t<loc>{$GLOBALS["SITE"]}.</loc>\n\t</url>\n";
    foreach(deepFlatten($array) as $e) {
        $e = $GLOBALS["SITE"] . $e;
        $towrite .= "\t<url>\n\t\t<loc>$e</loc>\n\t</url>\n";
    }
    $towrite .= "</urlset>";
    $f = fopen($filename, "w");
    fwrite($f, $towrite);
    fclose($f);
}

save_list($GLOBALS["SITEMAP"]);

?>

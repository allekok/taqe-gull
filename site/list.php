<?php
/* Function */
function make_list ($path = ".")
{
    $not = [".", "..", "list.txt", "list.php", "image",
	    "index.html", ".git", "LICENSE", "README.md",
	    "sw.js", "tools", ".gitignore", "site", "info.html"];
    $dir = opendir($path);
    $files = [];
    
    while (false !== ($e = readdir($dir)))
    {
        if (! in_array($e, $not) )
	{
            if( is_dir("$path/$e") )
	    {
                make_list ("$path/$e");
            }
            $files[] = $e;
        }
    }
    closedir($dir);
    
    sort($files);
    $list = implode("\n", $files);
    file_put_contents("$path/list.txt", $list);
}

/* Run */
make_list();
?>

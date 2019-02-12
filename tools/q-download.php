<?php

$GLOBALS["NOT"] = ["http://www.auriolus.com","http://statcounter.com/tumblr/","http://statcounter.com/p8229713/?guest=1","/flora/contact"];
$GLOBALS["SITE"] = "http://kurdflora.com";

function get_letters() {
    $html = @file_get_contents($GLOBALS["SITE"]);

    $dom = new DOMDocument;
    @$dom->loadHTML($html);

    $letters = [];
    foreach($dom->getElementsByTagName("a") as $a) {
        $href = $a->getAttribute("href");
        if(in_array($href, $GLOBALS["NOT"])) continue;
	
        $letters[] = [
            "url" => $href,
            "letter" => urldecode(substr($href, strrpos($href, "/")+1)),
        ];
    }

    return $letters;

}

// making letters directories.
$letters = get_letters();
foreach($letters as $one) {
    if(! file_exists("../res/{$one["letter"]}/")) {
        mkdir("../res/{$one["letter"]}/", 0755, true);
    }
}

foreach($letters as $one) {
    $url = $GLOBALS["SITE"] . $one["url"];
    $html = @file_get_contents($url);
    $dom = new DOMDocument;
    @$dom->loadHTML($html);
    if($one["letter"] != $letters[count($letters)-1]["letter"]) continue;

    $hrefs = [];
    foreach($dom->getElementsByTagName("a") as $a) {
        if(in_array($a->getAttribute("href"), $GLOBALS["NOT"])) continue;
        $hrefs[] = $a->getAttribute("href");
    }
    
    foreach($hrefs as $href) {
        
        $url = $GLOBALS["SITE"] . $href;
        echo $url . "\n";
        $html = @file_get_contents($url);
        @$dom->loadHTML($html);

        // the main pages
        // we need to distinguish 3 things:
        // 1. Kurdish Name
        // 2. Body(Latin+English+detail)
        // 3. The Big Image(s)

        $divs = $dom->getElementsByTagName("div");
        $imgs = $dom->getElementsByTagName("img");

        foreach($divs as $div) {
            if($div->getAttribute("class") == "flora-body") {
                $flora_body = $div;
                // break;
            }
        }

        $res_ltr = [];
        $title = "";
        $body = "";
        foreach($flora_body->getElementsByTagName("div") as $div) {
            // ltr
            if($div->getAttribute("class") == "ltr") {
                $ltr = $div->getElementsByTagName("span");
                foreach($ltr as $span) {
                    $class = $span->getAttribute("class");
                    if($class == "italic") {
                        $kind = $span->nodeValue;
                    }
                    else {
                        $res_ltr[] = [
                            "word" => $span->nodeValue,
                            "kind" => $kind,
                        ];
                    }
                }
            }

            // flora-text
            if($div->getAttribute("class") == "flora-text") {
                $flora_text = $div;
                $spans = $flora_text->getElementsByTagName("span");
                $ps = $flora_text->getElementsByTagName("p");
                
                foreach($spans as $span) {
                    if($span->getAttribute("class") == "inline-title") {
                        $title = $span->nodeValue;
                    }
                }

                foreach($ps as $p) {
                    $p = $p->nodeValue;
                    $body .= "$p\n";
                }
            }
        }
        
        
        $res_imgs = [];
        foreach($imgs as $img) {
            if($img->getAttribute("class") == "mobile-image") {
                $res_imgs[] = @file_get_contents($img->getAttribute("src"));
            }
        }
        
        // break;
        $dest = substr($href, strrpos($href, "/")+1);
        if(! file_exists("../res/{$one["letter"]}/{$title}_{$dest}/")) {
            mkdir("../res/{$one["letter"]}/{$title}_{$dest}/", 0755, true);
        }
        $f = fopen("../res/{$one["letter"]}/{$title}_{$dest}/INFO.TXT", "w");
        for($i=0; $i<count($res_ltr); $i++) {
            $res_ltr[$i] = "{$res_ltr[$i]["kind"]}\t{$res_ltr[$i]["word"]}";
        }
        $res_ltr = implode("\n", $res_ltr);
        $towrite = "$title\n$res_ltr\n\n$body";
        fwrite($f, $towrite);
        fclose($f);

        for($i = 0; $i<count($res_imgs); $i++) {
            $f = fopen("../res/{$one["letter"]}/{$title}_{$dest}/{$title}_{$i}.JPG", "w");
            fwrite($f, $res_imgs[$i]);
            fclose($f);
        }
        echo "$title\n";
        // break;
    }
    // break;
}

?>

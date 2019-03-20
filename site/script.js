function get_list(path, target_ID) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("get", `${path}/list.txt?preventCache=${Date.now()}`);
    document.getElementById(target_ID).innerHTML = "<div class='loader'></div>";

    xmlhttp.onload = function() {
        if(path !== get_path) set_url(path);
        echo_list(this.responseText, target_ID);
    }
    xmlhttp.send();
}

function set_url(path) {
    window.location = `#${path}`;
}

function get_path() {
    var h = window.location.hash.substr(1);
    if (h === "") return ".";
    return h;
}

function echo_list(list, target_ID) {
    list = list.split("\n");
    var html = "";
    var href = get_path();
    var gLQ = "";
    var lnk = "";
    var back = href === "." ? "" : href.split("/").slice(0, href.split("/").length - 1).join("/");
    if (back !== "") {
        html += `<a style='text-align:left;background:rgba(255,255,255,.15);' href='#${back}' onclick='event.preventDefault();get_list("${back}", "main");'>گەڕانەوە &rsaquo;</a>`;
    }
    
    for (var i in list) {
        href = get_path() + "/" + list[i];
        lnk = gLQ = href.split("/").length < 5 ? `#${href}` : `${href}`;
        gLQ = href.split("/").length < 5 ? `event.preventDefault();get_list("${href}", "main");` : "";

        html += `<a href='${lnk}' onclick='${gLQ}'>&rsaquo; ${list[i]}</a>`;
    }
    if(get_path().split("/").length == 4) {
	html += `<a href='./info.html#${get_path()}'>&rsaquo; INFO.HTML</a>`;
    }

    document.getElementById(target_ID).innerHTML = html;
}

function filter(needle) {
    var context = document.getElementById("main").querySelectorAll("a");
    filterp(needle, context);
}

function filterp(needle="", context, lastChance=false) {
    var res = false;
    
    needle = san_data(needle, lastChance);
    
    context.forEach(function(item) {
	var cx = san_data(item.innerHTML, lastChance);
	var _filterp = (needle == "") ? true : (cx.indexOf(needle) !== -1);
	if (_filterp) {
	    item.style.display = "";
	    res = true;
	}
	else {
	    item.style.display = "none";
	    res = false;
	}
    });

    if(!res && !lastChance)
	filterp(needle, context, true);
}

function KurdishNumbers(inp="") {
    
    var en = [/0/g, /1/g, /2/g, /3/g, /4/g, /5/g, /6/g, /7/g, /8/g, /9/g],
	ku = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'],
	ar = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];

    for (var i in en) {
        inp = inp.replace(en[i], ku[i]);
        inp = inp.replace(ar[i], ku[i]);
    }
    
    return inp;
}

function san_data(inp="", lastChance=false) {
    if (inp == "") return "";

    var extras = [/&laquo;/g, /&raquo;/g, /&rsaquo;/g, /&lsaquo;/g, /&bull;/g, /&nbsp;/g, /\?/g, /!/g, /#/g, /&/g, /\*/g, /\(/g, /\)/g, /-/g, /\+/g, /=/g, /_/g, /\[/g, /\]/g, /{/g, /}/g, /</g, />/g, /\//g, /\|/, /\'/g, /\"/g, /;/g, /:/g, /,/g, /\./g, /~/g, /`/g, /؟/g, /،/g, /»/g, /«/g, /ـ/g, /›/g, /‹/g, /•/g, /‌/g, /\s+/g,
                  /؛/g,
    ];
    var ar_signs = ['ِ', 'ُ', 'ٓ', 'ٰ', 'ْ', 'ٌ', 'ٍ', 'ً', 'ّ', 'َ'];
    
    var kurdish_letters = [
        "ه",
        "ه",
        "ک",
        "ی",
        "ه",
        "ز",
        "س",
        "ت",
        "ز",
        "ر",
        "ه",
        "خ",
        "و",
        "و",
        "و",
        "ی",
        "ر",
        "ل",
        "ز",
        "س",
        "ه",
        "ر",
        "م",
        "ا",
        "ا",
        "ل",
        "س",
        "ی",
        "و",
        "ئ",
        "ی",
    ];

    var other_letters = [
        /ه‌/g,
        /ە/g,
        /ك/g,
        /ي/g,
        /ھ/g,
        /ض/g,
        /ص/g,
        /ط/g,
        /ظ/g,
        /ڕ/g,
        /ح/g,
        /غ/g,
        /وو/g,
        /ۆ/g,
        /ؤ/g,
        /ێ/g,
        /ڕ/g,
        /ڵ/g,
        /ذ/g,
        /ث/g,
        /ة/g,
        /رر/g,
        /مم/g,
        /أ/g,
        /آ/g,
        /لل/g,
        /سس/g,
        /یی/g,
        /ڤ/g,
        /ع/g,
        /ى/g,
    ];
    
    for (var i in extras) {
        inp = inp.replace(extras[i], "");
    }
    
    for (i in ar_signs) {
        inp = inp.replace(ar_signs[i], "");
    }

    for (i in kurdish_letters) {
        inp = inp.replace(other_letters[i], kurdish_letters[i]);
    }

    inp = KurdishNumbers(inp);

    if (lastChance) inp = inp.replace(/ه/g, "");

    return inp;
}

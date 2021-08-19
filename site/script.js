window.onpopstate = () => {
	if(window.history.state)
		get_list(get_path(), 'main')
}
function set_url(path) {
	const url = `#${path}`
	window.history.pushState({url}, '', url)
}
function get_url(path, callback) {
	const x = new XMLHttpRequest
	x.open('get', path)
	x.onload = () => callback(x.responseText)
	x.send()
}
function get_list(path, tar) {
	get_url(`${path}/list.txt`, list => {
		if(path != get_path())
			set_url(path)
		echo_list(list, tar)
	})
	document.getElementById(tar).innerHTML =
		'<div class="loader"></div>'
}
function get_list_btn(path, tar, event) {
	event.preventDefault()
	get_list(path, tar)
}
function get_path() {
	const h = window.location.hash.substr(1)
	return h == '' ? '.' : h
}
function echo_list(list, tar) {
	const t = document.getElementById(tar)
	t.style.animation = ''
	void t.offsetHeight
	
	let html = ''

	const p = get_path(),
	      back = p == '.' ? 0 : p.substr(0, p.lastIndexOf('/'))
	if(back) {
		html += `<a class='back-btn' href='#${back}' ` +
			`style='text-align:left' onclick=` +
			`'get_list_btn("${back}", "main", event)'` +
			`>گەڕانەوە &rsaquo;</a>`
	}

	list = list.split('\n')
	for(const item of list) {
		const P = p + '/' + item
		const P_level = level(P)
		const href = P_level < 4 ?
		      `#${P}` : `./info.html#${P}`
		const on_click = P_level < 4 ?
		      `get_list_btn("${P}", "main", event)` : ''
		html += `<a href='${href}' onclick='${on_click}'>` + 
			`&rsaquo; ${item}</a>`
	}

	t.style.animation = 'fade .3s'
	t.innerHTML = html
}
function count_char(str, char) {
	let n = 0
	for(const i in str)
		if(str[i] == char)
			n++
	return n
}
function level(path) {
	return count_char(path, '/') + 1
}
function filter(needle) {
	const context = document.getElementById('main').
	      querySelectorAll('a')
	filterp(needle, context)
}
function filterp(needle='', context, last_chance=false) {
	let res = false
	
	needle = san_data(needle, last_chance)
	
	context.forEach(item => {
		const cx = san_data(item.innerHTML, last_chance)
		const _filterp = needle == '' ?
		      true : cx.indexOf(needle) !== -1
		if(_filterp) {
			res = true
			item.style.display = ''
		} else
			item.style.display = 'none'
	})

	if(!res && !last_chance)
		filterp(needle, context, true)
}
function kurdish_numbers(inp) {
	const en = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
	      ck = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'],
	      fa = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
	for(const i in en)
		inp = inp.replace(en[i], ck[i]).replace(fa[i], ck[i])
	return inp
}
function san_data(inp='', last_chance=false) {
	if(inp == '')
		return inp

	const extras = [
		/&laquo;/g, /&raquo;/g, /&rsaquo;/g, /&lsaquo;/g,
		/&bull;/g, /&nbsp;/g, /\?/g, /!/g, /#/g, /&/g,
		/\*/g, /\(/g, /\)/g, /-/g, /\+/g, /=/g, /_/g,
		/\[/g, /\]/g, /{/g, /}/g, /</g, />/g, /\//g,
		/\|/, /\'/g, /\"/g, /;/g, /:/g, /,/g, /\./g,
		/~/g, /`/g, /؟/g, /،/g, /»/g, /«/g, /ـ/g, /›/g,
		/‹/g, /•/g, /‌/g, /\s+/g, /؛/g
	]
	const ar_signs = ['ِ', 'ُ', 'ٓ', 'ٰ', 'ْ', 'ٌ', 'ٍ', 'ً', 'ّ', 'َ']
	const from = [
		/ه‌/g, /ە/g, /ك/g, /ي/g, /ھ/g, /ض/g, /ص/g,
		/ط/g, /ظ/g, /ڕ/g, /ح/g, /غ/g, /وو/g, /ۆ/g,
		/ؤ/g, /ێ/g, /ڕ/g, /ڵ/g, /ذ/g, /ث/g, /ة/g,
		/رر/g, /مم/g, /أ/g, /آ/g, /لل/g, /سس/g, /یی/g,
		/ڤ/g, /ع/g, /ى/g
	]
	const to = [
		'ه', 'ه', 'ک', 'ی', 'ه', 'ز', 'س', 'ت', 'ز',
		'ر', 'ه', 'خ', 'و', 'و', 'و', 'ی', 'ر', 'ل',
		'ز', 'س', 'ه', 'ر', 'م', 'ا', 'ا', 'ل', 'س',
		'ی', 'و', 'ئ', 'ی'
	]

	for(const o of extras)
		inp = inp.replace(o, '')
	for(const o of ar_signs)
		inp = inp.replace(o, '')
	for(const i in from)
		inp = inp.replace(from[i], to[i])
	inp = kurdish_numbers(inp)

	if(last_chance)
		inp = inp.replace(/ه/g, '')

	return inp
}

const ver = 'v6'
const root = '/taqe-gull/'
self.addEventListener('install', event => {
	event.waitUntil(
		caches.open(ver).then(cache => {
			return cache.addAll([
				root + 'site/script.js?v8',
				root + 'site/style.css?v11',
				root + 'site/image/portraits/1.jpg',
				root + 'site/DroidNaskh-Regular.woff2',
				root + 'sw.js',
			])
		})
	)
})

self.addEventListener('activate', event => {
	event.waitUntil(
		caches.keys().then(keyList => {
			return Promise.all(keyList.map(key => {
				if(key != ver)
					return caches.delete(key)
			}))
		})
	)
})

self.addEventListener('fetch', event => {
	event.respondWith(
		caches.match(event.request).then(resp => {
			return resp || fetch(event.request).then(r => r)
		})
	)
})

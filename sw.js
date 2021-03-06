const version = "v5";
self.addEventListener('install', function(event) {
    event.waitUntil(
	caches.open(version).then(function(cache) {
	    return cache.addAll([
		'/taqe-gull/sw.js',
		'/taqe-gull/index.html',
		'/taqe-gull/site/script.js?v6',
		'/taqe-gull/site/style.css?v8',
		'/taqe-gull/site/image/portraits/1.jpg',
		'/taqe-gull/site/DroidNaskh-Regular.woff2',
	    ]);
	})
    );
});

self.addEventListener('activate', function(event) {
    var cacheWhitelist = [version];

    event.waitUntil(
	caches.keys().then(function(keyList) {
	    return Promise.all(keyList.map(function(key) {
		if (cacheWhitelist.indexOf(key) === -1) {
		    return caches.delete(key);
		}
	    }));
	})
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
	caches.match(event.request).then(function(resp) {
	    return resp || fetch(event.request).then(function(response) {		
		return response;
	    });
	}).catch(function() {
	    return caches.match('/taqe-gull/index.html');
	})
    );
});

// service-worker.js

// Define a name for the current cache
var cacheName = 'v1'; 

// Default files to always cache
var cacheFiles = [
  './',
  './index.html',
  './app.js',
  './style.css',
  'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css'
]

self.addEventListener('install', function(e) {
  console.log('[Service Worker] Installed');

  // e.waitUntil Delays the event until the Promise is resolved
  e.waitUntil(

    // Open the cache
    caches.open(cacheName).then(function(cache) {

      // Add all the default files to the cache
      console.log('[Service Worker] Caching cacheFiles');
      return cache.addAll(cacheFiles);
    })
  ); 
});

self.addEventListener('activate', function(e) {
  console.log('[Service Worker] Activated');

  e.waitUntil(

    // Get all the cache keys (cacheName)
    caches.keys().then(function(cacheNames) {
      return Promise.all(cacheNames.map(function(thisCacheName) {

        // If a cached item is saved under a previous cacheName
        if (thisCacheName !== cacheName) {

          // Delete that cached file
          console.log('[Service Worker] Removing Cached Files from Cache - ', thisCacheName);
          return caches.delete(thisCacheName);
        }
      }));
    })
  ); 
});

self.addEventListener('fetch', function(e) {
  console.log('[Service Worker] Fetch', e.request.url);

  // e.respondWith Responds to the fetch event
  e.respondWith(

    // Check in cache for the request being made
    caches.match(e.request)


      .then(function(response) {

        // If the request is in the cache
        if ( response ) {
          console.log("[Service Worker] Found in Cache", e.request.url, response);
          // Return the cached version
          return response;
        }

        // If the request is NOT in the cache, fetch and cache

        var requestClone = e.request.clone();
        fetch(requestClone)
          .then(function(response) {

            if ( !response ) {
              console.log("[Service Worker] No response from fetch ")
              return response;
            }

            var responseClone = response.clone();

            //  Open the cache
            caches.open(cacheName).then(function(cache) {

              // Put the fetched response in the cache
              cache.put(e.request, responseClone);
              console.log('[Service Worker] New Data Cached', e.request.url);

              // Return the response
              return response;
          
            }); // end caches.open

          })
          .catch(function(err) {
            console.log('[Service Worker] Error Fetching & Caching New Data', err);
          });


      }) // end caches.match(e.request)
  ); // end e.respondWith
});

self.addEventListener('install', event => {
    console.log('Service Worker installing.');
  });
  
  self.addEventListener('activate', event => {
    console.log('Service Worker activating.');
  });
  
  self.addEventListener('fetch', event => {
    if (event.request.url.endsWith('/static/isUnderMaintenance.json')) {
      event.respondWith(
        fetch(event.request).then(response => {
          if (response.ok) {
            self.clients.matchAll().then(clients => {
              clients.forEach(client => {
                client.postMessage({ type: 'maintenance', isUnderMaintenance: true });
              });
            });
          }
          return response;
        }).catch(() => {
          self.clients.matchAll().then(clients => {
            clients.forEach(client => {
              client.postMessage({ type: 'maintenance', isUnderMaintenance: false });
            });
          });
        })
      );
    }
  });
  
const CACHE_NAME = 'productivity-pwa-v1';
const API_CACHE = 'productivity-api-v1';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/api.js',
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// INSTALL - CACHEAR ASSETS ESTATICOS
self.addEventListener('install', (event) => {
  console.log('[SW] INSTALANDO...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] CACHEANDO ASSETS ESTATICOS');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// ACTIVATE - LIMPAR CACHES ANTIGOS
self.addEventListener('activate', (event) => {
  console.log('[SW] ATIVANDO...');
  
  event.waitUntil(
    caches.keys()
      .then((keys) => {
        return Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME && key !== API_CACHE)
            .map((key) => {
              console.log('[SW] REMOVENDO CACHE ANTIGO:', key);
              return caches.delete(key);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// FETCH - ESTRATEGIA DE CACHE
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // ESTRATEGIA: NETWORK FIRST PARA API
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      networkFirstStrategy(request, API_CACHE)
    );
    return;
  }
  
  // ESTRATEGIA: CACHE FIRST PARA ASSETS ESTATICOS
  event.respondWith(
    cacheFirstStrategy(request, CACHE_NAME)
  );
});

// CACHE FIRST - ASSETS ESTATICOS
async function cacheFirstStrategy(request, cacheName) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    console.log('[SW] CACHE HIT:', request.url);
    return cachedResponse;
  }
  
  try {
    console.log('[SW] CACHE MISS - BUSCANDO:', request.url);
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[SW] FETCH FALHOU:', error);
    
    // FALLBACK PARA OFFLINE
    if (request.destination === 'document') {
      const cache = await caches.open(cacheName);
      return cache.match('/index.html');
    }
    
    return new Response('OFFLINE', {
      status: 503,
      statusText: 'SERVICO INDISPONIVEL'
    });
  }
}

// NETWORK FIRST - API CALLS
async function networkFirstStrategy(request, cacheName) {
  try {
    console.log('[SW] NETWORK FIRST:', request.url);
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok && request.method === 'GET') {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] NETWORK FALHOU - TENTANDO CACHE:', request.url);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    return new Response(JSON.stringify({ 
      error: 'OFFLINE',
      message: 'SEM CONEXAO COM SERVIDOR'
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// BACKGROUND SYNC (OPCIONAL)
self.addEventListener('sync', (event) => {
  console.log('[SW] BACKGROUND SYNC:', event.tag);
  
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  console.log('[SW] SINCRONIZANDO DADOS...');
  // IMPLEMENTAR LOGICA DE SINCRONIZACAO
}

// PUSH NOTIFICATIONS (OPCIONAL)
self.addEventListener('push', (event) => {
  console.log('[SW] PUSH RECEBIDO');
  
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Productivity Helper';
  const options = {
    body: data.body || 'NOVA NOTIFICACAO',
    icon: '/icons/icon-192.png',
    badge: '/icons/badge.png',
    data: data.url
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.notification.data) {
    event.waitUntil(
      clients.openWindow(event.notification.data)
    );
  }
});
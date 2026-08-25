const CACHE_NAME = 'zaptday-pwa-v1';

self.addEventListener('install', (event) => {
  // Pula a fila de espera para ativação rápida
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // O service worker assume o controle imediatamente
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Interceptador minimalista obrigatório.
  // Apenas repassa a requisição sem cachear, mantendo
  // toda a lógica, visual e banco de dados do seu app 100% originais.
  event.respondWith(fetch(event.request));
});

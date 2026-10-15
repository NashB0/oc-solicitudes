// OC Solicitudes — archivo de avisos.
// Recibe los avisos aunque la app esté cerrada y los muestra como notificación del celular.
// Al tocar la notificación, abre la app (o la trae al frente si ya estaba abierta).
// No guarda nada ni intercepta la carga de la app: solo avisos.

self.addEventListener('install', function() { self.skipWaiting(); });
self.addEventListener('activate', function(e) { e.waitUntil(self.clients.claim()); });

self.addEventListener('push', function(e) {
  let p = {};
  try { p = e.data ? e.data.json() : {}; } catch (err) { p = {}; }
  const d = p.data || {};
  const n = p.notification || {};
  const titulo = d.titulo || n.title || 'OC Solicitudes';
  const opciones = {
    body: d.cuerpo || n.body || 'Hay una novedad en la app.',
    icon: 'icon-192.png',
    badge: 'icon-192.png',
    tag: d.tag || undefined,
    renotify: !!d.tag,
    data: { url: d.url || self.registration.scope }
  };
  e.waitUntil(self.registration.showNotification(titulo, opciones));
});

self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  const destino = (e.notification.data && e.notification.data.url) || self.registration.scope;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(lista) {
    for (const c of lista) {
      if (c.url.indexOf(self.registration.scope) === 0 && 'focus' in c) return c.focus();
    }
    return self.clients.openWindow(destino);
  }));
});

/**
 * Dev-server proxy (Vite). Replaces proxy.conf.json so /ngrok-api can fail soft when
 * the ngrok agent is not running (nothing on 127.0.0.1:4040).
 */
const NGROK_DOWN_BODY = JSON.stringify({
  tunnels: [],
  uri: '/api/tunnels',
});

const PROXY_CONFIG = {
  '/api': {
    target: 'http://localhost:8080',
    secure: false,
    changeOrigin: true,
  },
  '/graphql': {
    target: 'http://localhost:8080',
    secure: false,
    ws: true,
    changeOrigin: true,
  },
  '/ngrok-api': {
    target: 'http://127.0.0.1:4040',
    secure: false,
    changeOrigin: true,
    pathRewrite: { '^/ngrok-api': '/api' },
    logLevel: 'silent',
    configure: (proxy) => {
      proxy.on('error', (err, req, res) => {
        if (!err || err.code !== 'ECONNREFUSED') {
          return;
        }
        if (!res || res.writableEnded || res.headersSent) {
          return;
        }
        const url = req.url ?? '';
        if (!url.includes('tunnels')) {
          return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(NGROK_DOWN_BODY);
      });
    },
  },
};

module.exports = PROXY_CONFIG;

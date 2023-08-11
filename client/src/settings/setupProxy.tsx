// setupProxy.tsx
// @ts-nocheck
import {createProxyMiddleware} from 'http-proxy-middleware';

app.use(
  createProxyMiddleware("/Nutrition", {
    target: 'https://platform.fatsecret.com/rest/server.api',
    pathRewrite: {
      '^/Nutrition': ''
    },
    changeOrigin: true
  })
);

export default app;

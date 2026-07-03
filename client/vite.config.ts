/**
 * @file vite.config.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-27
 */

import fs from "node:fs";
import path from "node:path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig, loadEnv, type UserConfig } from "vite";
import vtCmpr from "vite-plugin-compression";

// 1. config ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
export default defineConfig(({ command, mode }) => {
  // 1-1. init
  const dirName: string = import.meta.dirname;
  const rootDir: string = path.resolve(dirName);
  const envMode: string = mode === `production` ? `production` : `development`;
  const isProd: boolean = envMode === `production`;
  const isDev: boolean = !isProd;
  const isBuild: boolean = command === `build`;

  // 1-2. env load
  const rawEnv: Record<string, string> = loadEnv(envMode, rootDir, ``);
  const env: Record<string, string> = Object.fromEntries(Object.entries(rawEnv).filter(([k]) => k.startsWith(`VITE_`))) as Record<string, string>;

  // 1-3. env file merge
  const noop: () => void = () => {};
  const noopSet: (target: Record<string, string>, key: string, value: string) => void = () => {};
  const setEnv: (target: Record<string, string>, key: string, value: string) => void = (target, key, value) => {
    target[key] = value;
  };

  const mrgEnvFrmFl: (filePath: string) => void = (filePath) => {
    const exists: boolean = fs.existsSync(filePath);
    const merge: () => void = () => {
      fs.readFileSync(filePath, { encoding: `utf8` })
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => Boolean(line) && !line.startsWith(`#`))
        .forEach((line) => {
          const cleaned: string = line.startsWith(`export `) ? line.slice(7).trim() : line;
          const idx: number = cleaned.indexOf(`=`);
          const hasEq: boolean = idx > 0;

          const key: string = hasEq ? cleaned.slice(0, idx).trim() : ``;
          const rawVal: string = hasEq ? cleaned.slice(idx + 1).trim() : ``;
          const val: string = rawVal.startsWith(`"`) && rawVal.endsWith(`"`) ? rawVal.slice(1, -1) : rawVal;

          const shouldSet: boolean = hasEq && key.startsWith(`VITE_`);
          (shouldSet ? setEnv : noopSet)(env, key, val);
        });
    };

    (exists ? merge : noop)();
  };

  mrgEnvFrmFl(path.join(rootDir, `.env-${envMode}`));

  // 1-4. debug
  const debugEnv: () => void = () => {
    console.log(`[Vite Config] mode: ${mode}, envMode: ${envMode}`);
    console.log(`[Vite Config] VITE_APP_SERVER_URL: ${env.VITE_APP_SERVER_URL}`);
  };
  (isDev ? debugEnv : noop)();

  // 2. derived values ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
  const baseUrl: string = env.VITE_APP_PUBLIC_URL || `/lifechange`;
  const publicUrl: string = env.VITE_APP_PUBLIC_URL || `/lifechange`;

  // 3. plugins ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
  const plugins: NonNullable<UserConfig[`plugins`]> = [
    react({
      devTarget: `esnext`,
      jsxImportSource: `@emotion/react`,
    }),
    ...(isProd && isBuild ? [
        vtCmpr({
          verbose: false,
          disable: false,
          threshold: 10_240,
          algorithm: `brotliCompress`,
          ext: `.br`,
          deleteOriginFile: false,
        }),
      ] : []),
  ];

  // 4. define ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
  const defineEnv: Record<string, string> = Object.fromEntries(Object.entries(env).map(([k, v]) => [`import.meta.env.${k}`, JSON.stringify(v)] as const)) as Record<string, string>;

  // 5. final config ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
  const config: UserConfig = {
    base: baseUrl,
    plugins: plugins,
    define: {
      ...defineEnv,
      "process.env.NODE_ENV": JSON.stringify(envMode),
      "process.env.PUBLIC_URL": JSON.stringify(publicUrl),
      "import.meta.env.MODE": JSON.stringify(mode),
      "import.meta.env.DEV": JSON.stringify(isDev),
      "import.meta.env.PROD": JSON.stringify(isProd),
      "import.meta.env.BASE_URL": JSON.stringify(publicUrl),
    },
    envDir: rootDir,
    resolve: {
      alias: {
        "@type": path.resolve(dirName, `./src/assets/type/domain`),
        "@": path.resolve(dirName, `./src`),
        "@assets": path.resolve(dirName, `./src/assets`),
        "@interfaces": path.resolve(dirName, `./src/interfaces`),
        "@hooks": path.resolve(dirName, `./src/hooks`),
        "@stores": path.resolve(dirName, `./src/stores`),
        "@pages": path.resolve(dirName, `./src/pages`),
        "@schemas": path.resolve(dirName, `./src/schemas`),
        "@exportReacts": path.resolve(dirName, `./src/exports/ExportReacts`),
        "@exportMuis": path.resolve(dirName, `./src/exports/ExportMuis`),
        "@exportHooks": path.resolve(dirName, `./src/exports/ExportHooks`),
        "@exportStores": path.resolve(dirName, `./src/exports/ExportStores`),
        "@exportLayouts": path.resolve(dirName, `./src/exports/ExportLayouts`),
        "@exportComponents": path.resolve(dirName, `./src/exports/ExportComponents`),
        "@exportContainers": path.resolve(dirName, `./src/exports/ExportContainers`),
        "@exportPages": path.resolve(dirName, `./src/exports/ExportPages`),
        "@exportSchemas": path.resolve(dirName, `./src/exports/ExportSchemas`),
        "@exportScripts": path.resolve(dirName, `./src/exports/ExportScripts`),
        "@exportLibs": path.resolve(dirName, `./src/exports/ExportLibs`),
        "@exportTypes": path.resolve(dirName, `./src/exports/ExportTypes`),
      },
    },
    css: {
      postcss: {},
      modules: {
        localsConvention: `camelCase`,
      },
    },
    build: {
      outDir: `build`,
      assetsDir: `assets`,
      sourcemap: false,
      minify: isProd ? `oxc` : false,
      target: `es2020`,
      cssMinify: true,
      chunkSizeWarningLimit: 2048,
      reportCompressedSize: false,
      rolldownOptions: {
        output: {
          minify: isProd ? {
            compress: {
              dropConsole: true,
              dropDebugger: true,
            },
          } : undefined,
          manualChunks: (id: string): string | undefined => {
            if (/node_modules[\\/](react|react-dom|react-router)[\\/]/.test(id)) {
            	return `react`;
            }
            if (id.includes(`node_modules/@mui`) || id.includes(`node_modules/@emotion`)) {
            	return `mui`;
            }
            if (id.includes(`node_modules/axios`) || id.includes(`node_modules/zustand`) || id.includes(`node_modules/moment`)) {
            	return `vendor`;
            }
            return;
          },
          assetFileNames: (assetInfo) => {
            const info: string[] = assetInfo.name ? assetInfo.name.split(`.`) : [];
            const extType: string | undefined = info.at(-1);

            return extType === `css` ? `assets/css/[name].[hash][extname]` : `assets/[name].[hash][extname]`;
          },
          chunkFileNames: `assets/js/[name].[hash].js`,
          entryFileNames: `assets/js/[name].[hash].js`,
        },
      },
      assetsInlineLimit: 4096,
    },
    server: {
      port: 3000,
      open: true,
      host: true,
      cors: true,
    },
    preview: {
      port: 3000,
      open: false,
    },
    optimizeDeps: {
      include: [`react`, `react-dom`, `react-router`],
    },
  };

  return config;
});

import { fileURLToPath, URL } from 'node:url'
import fs from 'fs'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import electron from 'vite-plugin-electron'
import renderer, { worker } from 'vite-plugin-electron-renderer'

fs.rmSync('dist', { recursive: true, force: true })
fs.rmSync('dist-electron', { recursive: true, force: true })
fs.rmSync('src/**/*.js', { recursive: true, force: true })

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        minify: false,
        assetsDir: '',
    },
    plugins: [
        vue(),
        vueJsx(),
        electron({
            // Multiple entry needed Vite >= 3.2.0
            entry: [
                'src/electron/main/main.ts',
                'src/electron/main/worker.ts',
                'src/electron/preload/preload.ts',
            ],
        }),
        renderer({
            nodeIntegration: true,
        }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    worker: {
        plugins: [
            worker({
                nodeIntegrationInWorker: true,
            }),
        ],
    },
})

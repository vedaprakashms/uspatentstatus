process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'
import installExtension from 'electron-devtools-installer'
import { app, BrowserWindow } from 'electron'
import path from 'path'
import { Worker } from 'worker_threads'
import * as Remote from '@electron/remote/main'

Remote.initialize()

let win: BrowserWindow

app.whenReady().then(async () => {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        minHeight: 600,
        minWidth: 512,
        autoHideMenuBar: true,
        frame: false,
        webPreferences: {
            contextIsolation: true,
            nodeIntegrationInWorker: true,
            preload: path.join(__dirname, './preload.js'),
        },
    })
    if (app.isPackaged) {
        win.loadFile(path.join(__dirname, '../dist/index.html'))
    } else {
        win.loadURL(process.env.VITE_DEV_SERVER_URL as string)
        win.webContents.openDevTools()
        try {
            await installExtension({
                id: 'nhdogjmejiglipccpnnnanhbledajbpd',
                electron: '>=1.2.1',
            })
        } catch (e: any) {
            console.error('Vue Devtools failed to install:', e.toString())
        }
    }

    win.maximize()
    Remote.enable(win.webContents)

    const worker = new Worker(path.join(__dirname, './worker.js'))
    worker.on('message', (value) => {
        console.log('[worker message]:', value)
    })
})

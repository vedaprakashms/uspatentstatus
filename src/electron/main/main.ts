process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'
//import installExtension from 'electron-devtools-installer'
import { app, BrowserWindow } from 'electron'
import path from 'path'
import * as Remote from '@electron/remote/main'

Remote.initialize()
//const isDev = process.env.IS_DEV == 'true' ? true : false

function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
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
            webSecurity: false,
        },
    })

    // and load the index.html of the app.
    // win.loadFile("index.html");
    mainWindow.loadURL(
        !app.isPackaged
            ? (process.env.VITE_DEV_SERVER_URL as string)
            : `file://${path.join(__dirname, '../dist/index.html')}`
    )
    // Open the DevTools.
    if (!app.isPackaged) {
        mainWindow.webContents.openDevTools()
    }
    mainWindow.maximize()
    Remote.enable(mainWindow.webContents)
    mainWindow.webContents.session.webRequest.onBeforeSendHeaders(
        (details, callback) => {
            const { requestHeaders } = details
            UpsertKeyValue(requestHeaders, 'Access-Control-Allow-Origin', ['*'])
            callback({ requestHeaders })
        }
    )

    mainWindow.webContents.session.webRequest.onHeadersReceived(
        (details, callback) => {
            const { responseHeaders } = details
            UpsertKeyValue(responseHeaders, 'Access-Control-Allow-Origin', [
                '*',
            ])
            UpsertKeyValue(responseHeaders, 'Access-Control-Allow-Headers', [
                '*',
            ])
            callback({
                responseHeaders,
            })
        }
    )
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
    // Only Invoke this part of the commented code if you want to debug using Vue extension
    // if (!app.isPackaged) {
    //     // Install Vue Devtools
    //     try {
    //         await installExtension({
    //             id: 'nhdogjmejiglipccpnnnanhbledajbpd',
    //             electron: '>=1.2.1',
    //         })
    //     } catch (e: any) {
    //         console.error('Vue Devtools failed to install:', e.toString())
    //     }
    // }
    createWindow()
    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

function UpsertKeyValue(obj: any, keyToChange: any, value: any) {
    const keyToChangeLower = keyToChange.toLowerCase()
    for (const key of Object.keys(obj)) {
        if (key.toLowerCase() === keyToChangeLower) {
            // Reassign old key
            obj[key] = value
            // Done
            return
        }
    }
    // Insert at end instead
    obj[keyToChange] = value
}

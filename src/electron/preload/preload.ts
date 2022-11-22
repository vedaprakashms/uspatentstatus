import { contextBridge } from 'electron'
import { app, BrowserWindow } from '@electron/remote'

const Api = {
    getString: (): string => 'this is a Test String',
    getDownloadPath: (): string => app.getPath('downloads'),
    closeApp: (): void => {
        BrowserWindow.getFocusedWindow()?.close()
    },
    minimize: (): void => {
        BrowserWindow.getFocusedWindow()?.minimize()
    },
    toggleMaximize: () => {
        const win = BrowserWindow.getFocusedWindow()

        if (win?.isMaximized()) {
            win.unmaximize()
        } else {
            win?.maximize()
        }
    },
}
contextBridge.exposeInMainWorld('myApi', Api)
export { Api }

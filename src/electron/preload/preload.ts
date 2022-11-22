import { contextBridge } from 'electron'
import { app, BrowserWindow } from '@electron/remote'
import _7z from '7zip-min'
import path from 'path'
import fs from 'fs'
import zlib from 'zlib'
import { exec } from 'child_process'

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
    _7zip: async (queryid: string) => {
        let archPath = path.join(
            app.getPath('downloads'),
            'USPatentStatus',
            'data',
            queryid + '.zip'
        )
        let extpath = path.join(
            app.getPath('downloads'),
            'USPatentStatus',
            'data',
            queryid
        )
        //rewrite the unzipping part. using shell commands.
        exec('dir', (e, stdout, stderr) => {
            console.log(stdout)
            console.log(stderr)
            console.log(e)
        })

        return 'done'
    },
}
contextBridge.exposeInMainWorld('myApi', Api)
export { Api }

import { contextBridge } from 'electron'
import { app, BrowserWindow } from '@electron/remote'
import fs from 'fs'
import path from 'path'
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
    unzip: async (queryid: string) => {
        let zip_path = path.join(
            app.getPath('downloads'),
            'USPatentStatus',
            'data',
            queryid + '.zip'
        )
        let extracted_path = path.join(
            app.getPath('downloads'),
            'USPatentStatus',
            'data',
            queryid
        )
        console.log(zip_path)
        if (fs.existsSync(zip_path)) {
            switch (process.platform) {
                case 'win32':
                    console.log(
                        `Starting the extraction for ${zip_path} under the os ${process.platform}`
                    )
                    exec(
                        'powershell -command Expand-Archive -Force ' +
                            zip_path +
                            ' ' +
                            extracted_path,
                        (error, stdout, stderr) => {
                            if (error) {
                                console.error(error)
                            }
                            if (stderr) console.error(stderr)
                            console.log(stdout)
                        }
                    )
                    break
                default:
                    console.log(process.platform)
                    exec(
                        'unzip ' +
                            zip_path +
                            ' -d ' +
                            extracted_path,
                        (error, stdout, stderr) => {
                            if (error) {
                                console.error(error)
                            }
                            if (stderr) console.error(stderr)
                            console.log(stdout)
                        }
                    )
                    break
            }
        } else console.error(`File in the path ${zip_path} not found.`)

        return extracted_path
    },
}
contextBridge.exposeInMainWorld('myApi', Api)
export { Api }

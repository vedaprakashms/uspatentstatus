import { contextBridge } from 'electron'
import { app, BrowserWindow } from '@electron/remote'
import fs from 'fs'
import path from 'path'
import { spawn } from 'child_process'

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
                    // exec(
                    //     'powershell -command Expand-Archive -Force ' +
                    //         zip_path +
                    //         ' ' +
                    //         extracted_path,
                    //     (error, stdout, stderr) => {
                    //         if (error) {
                    //             console.error(error)
                    //         }
                    //         if (stderr) console.error(stderr)
                    //         console.log(stdout)
                    //     }
                    // )
                    let child = spawn(
                        'powershell -command Expand-Archive -Force',
                        [zip_path, extracted_path],
                        { shell: true }
                    )
                    child.stdout.on('data', (data) => {
                        console.log(`std out: ${data}`)
                    })
                    child.stderr.on('data', (data) => {
                        console.log(`std out: ${data}`)
                    })
                    child.on('close', (code: any) => {
                        setTimeout(() => {
                            console.log(`child process ended with code ${code}`)
                            fs.readdir(extracted_path, (err, files) => {
                                console.log(files.length)
                                files.forEach((file) => {
                                    let filedata = fs.readFileSync(
                                        path.join(extracted_path, file)
                                    )
                                    console.log(JSON.parse(filedata.toString()))
                                })
                                err ? console.error(err) : ''
                            })
                        }, 5000)
                    })

                    break
                default:
                    console.log(process.platform)
                    // exec(
                    //     'unzip ' + zip_path + ' -d ' + extracted_path,
                    //     (error, stdout, stderr) => {
                    //         if (error) {
                    //             console.error(error)
                    //         }
                    //         if (stderr) console.error(stderr)
                    //         console.log(stdout)
                    //     }
                    // )
                    let child1 = spawn(
                        'unzip',
                        [zip_path, '-d', extracted_path],
                        { shell: true }
                    )
                    child1.stdout.on('data', (data) => {
                        console.log(`std out: ${data}`)
                    })
                    child1.stderr.on('data', (data) => {
                        console.log(`std out: ${data}`)
                    })
                    child1.on('close', (code: any) => {
                        setTimeout(() => {
                            console.log(`child process ended with code ${code}`)
                            fs.readdir(extracted_path, (err, files) => {
                                console.log(files.length)
                                files.forEach((file) => {
                                    let filedata = fs.readFileSync(
                                        path.join(extracted_path, file)
                                    )
                                    console.log(JSON.parse(filedata.toString()))
                                })
                                err ? console.error(err) : ''
                            })
                        }, 5000)
                    })
                    break
            }
        } else console.error(`File in the path ${zip_path} not found.`)

        //let files = fs.readdirSync(extracted_path)
        // fs.readdir(extracted_path, (err, files) => {
        //     files.forEach((file) => {
        //         let filedata = fs.readFileSync(path.join(extracted_path, file))
        //         console.log(JSON.parse(filedata.toString()))
        //     })
        //     console.error(err)
        // })

        return extracted_path
    },
}
contextBridge.exposeInMainWorld('myApi', Api)
export { Api }

import { app } from "@electron/remote";

const Api = {
    getString:():string=>"this is a Test String",
    getDownloadPath:():string=>app.getPath("downloads")
}

export {Api}
import type {Api} from "@/electron/preload/preload"
declare global {
    interface Window{
        myApi?:typeof Api
    }
}



export {}
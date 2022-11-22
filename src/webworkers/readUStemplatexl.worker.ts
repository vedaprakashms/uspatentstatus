import { readUSTemplate } from '../functions/readUS'

addEventListener('message', (e) => {
    //console.log(e.data)
    readUSTemplate(e.data)
        .then((r) => {
            console.log('reading the excel in worker')
            console.log(r)
            postMessage(r)
        })
        .then(() => {
            console.log('this is try')
        })
})

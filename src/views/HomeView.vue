<script setup lang="ts">
import { usTemplate } from '../functions/writeustemplate'
import readustemplate from '../webworkers/readUStemplatexl.worker?worker'
import readString from '../webworkers/readString.worker?worker'
import searchApi from '../webworkers/SearchApi.worker?worker'
import { useUSPTOStore } from '../stores/uspto'
import { storeToRefs } from 'pinia'
import ApplicationNumber from '../components/ApplicationNumber.vue'
import PatentNumber from '../components/PatentNumber.vue'
import { useToast } from 'vue-toastification'
import { ref } from 'vue'
let searchString = ref('')
let uspto = useUSPTOStore()
const toast = useToast()

let { appno, patno } = storeToRefs(uspto)

//when the US template is selected, the file is read in web worker and returned the values to save time.
let fileContentChange = async (event: any) => {
    uspto.appno = []
    uspto.patno = []
    let worker1 = new readustemplate()
    const file = event.target.files[0]
    const dataBuffer = await file.arrayBuffer()
    worker1.postMessage(dataBuffer)
    worker1.addEventListener('message', (r) => {
        for (let index = 0; index < r.data.ApplicationNo.length; index++) {
            const element = r.data.ApplicationNo[index]
            uspto.appno.push({ number: element, status: 'circle' })
        }
        for (let index = 0; index < r.data.PatentNo.length; index++) {
            const element = r.data.PatentNo[index]
            uspto.patno.push({ number: element, status: 'circle' })
        }
        worker1.terminate()
        let worker3 = new searchApi()
        worker3.postMessage({
            type: 'App',
            jsonData: JSON.stringify(uspto.appno),
            filepath: window.myApi?.getDownloadPath(),
        })
        worker3.postMessage({
            type: 'Pat',
            jsonData: JSON.stringify(uspto.patno),
            filepath: window.myApi?.getDownloadPath(),
        })
        worker3.addEventListener('message', (e) => {
            console.log(e.data)
            toast.success(e.data.msg, {
                timeout: 2000,
            })
            window.myApi?._7zip(e.data.queryid).then(console.log)
        })
        //worker3.terminate()
    })
}
//when the application and patent numbers are put this method is taken into consideration.
let stringData = async () => {
    uspto.appno = []
    uspto.patno = []
    let worker2 = new readString()
    worker2.postMessage(searchString.value)
    worker2.addEventListener('message', (r) => {
        for (let index = 0; index < r.data.ApplicationNo.length; index++) {
            const element = r.data.ApplicationNo[index]
            uspto.appno.push({ number: element, status: 'circle' })
        }
        for (let index = 0; index < r.data.PatentNo.length; index++) {
            const element = r.data.PatentNo[index]
            uspto.patno.push({ number: element, status: 'circle' })
        }
        worker2.terminate()
        let worker3 = new searchApi()
        worker3.postMessage({
            type: 'App',
            jsonData: JSON.stringify(uspto.appno),
            filepath: window.myApi?.getDownloadPath(),
        })
        worker3.postMessage({
            type: 'Pat',
            jsonData: JSON.stringify(uspto.patno),
            filepath: window.myApi?.getDownloadPath(),
        })

        worker3.addEventListener('message', (e) => {
            console.log(e.data)
            toast.success(e.data.msg, {
                timeout: 2000,
            })
        })
    })
}
</script>

<template>
    <main class="overflow-scroll">
        <h1
            class="uppercase text-3xl font-bold font-Trispace text-center underline decoration-wavy hover:decoration-double text-zinc-800"
        >
            US Patent Status Extraction
        </h1>
        <div id="fileInput" class="mx-2 mt-2 grid grid-cols-12 gap-2">
            <input
                type="file"
                @change="fileContentChange"
                class="rounded-md col-span-12 lg:col-span-11 bg-slate-200 placeholder:text-2xl placeholder:text-center"
            />
            <div
                @click="usTemplate"
                class="hover:bg-green-600 text-center col-span-12 lg:col-span-1 bg-slate-700 rounded-md text-2xl font-bold text-yellow-200 hover:text-orange-400 max-lg:flex max-lg:justify-center"
            >
                <fa :icon="['fas', 'file-excel']" class="text-white mt-1" />
                <span class="font-bold text-white px-1"> Template </span>
            </div>
        </div>
        <div class="mx-2 mt-2 grid grid-cols-12 gap-2">
            <textarea
                rows="7"
                class="rounded-md col-span-12 lg:col-span-11 bg-slate-200 placeholder:text-2xl placeholder:text-center"
                placeholder="Enter United States Application and Patent Numbers"
                v-model="searchString"
            ></textarea>
            <button
                @click="stringData"
                class="col-span-12 lg:col-span-1 bg-slate-700 rounded-md text-2xl font-bold text-yellow-200 hover:text-orange-400"
            >
                Search <fa :icon="['fab', 'searchengin']" />
            </button>
        </div>
        <div class="mx-2">
            <h1 class="text-center text-4xl underline decoration-wavy mb-4">
                Results
            </h1>
            <div class="grid grid-cols-12 gap-2 m-2">
                <ApplicationNumber
                    v-for="(i, j) in appno"
                    :key="j"
                    :data="i"
                    class="lg:col-span-3 md:col-span-6 col-span-12"
                />
                <PatentNumber
                    v-for="(i, j) in patno"
                    :key="j"
                    :data="i"
                    class="lg:col-span-3 md:col-span-6 col-span-12"
                />
            </div>
        </div>
    </main>
</template>

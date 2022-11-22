import { ref } from 'vue'
import { defineStore } from 'pinia'
export const useUSPTOStore = defineStore('uspto', () => {
    let appno = ref<patnumber[]>([])
    let patno = ref<patnumber[]>([])

    return {
        appno,
        patno,
    }
})

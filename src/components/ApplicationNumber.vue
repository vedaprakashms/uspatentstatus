<script setup lang="ts">
import { ref } from 'vue'
interface Props {
    data: patnumber
}
const props = defineProps<Props>()
let r = ref(true)
let kr = ref(props.data.status.toString())
let bac = ref('h-4 text-amber-300 mx-2 mt-1')
let k = () => {
    if (r.value) {
        r.value = false
        kr.value = props.data.status.toString()
        bac.value = 'h-4 text-green-500 mx-2 mt-1'
    } else {
        r.value = true
        kr.value = props.data.status.toString()
        bac.value = 'h-4 text-amber-300 mx-2 mt-1'
    }
}
</script>
<template>
    <div class="bg-slate-700 text-white flex align-middle">
        <h1>Application No: {{ props.data.number }}</h1>
        <fa :icon="['fas', kr]" :class="bac" @click="k" />
    </div>
</template>

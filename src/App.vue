<script setup lang="ts">
import { RouterView } from 'vue-router'
import MenuBar from '@/components/menubar.vue'

let closeApp = () => window.myApi?.closeApp()
let minimize = () => window.myApi?.minimize()
let toggleMaximize = () => window.myApi?.toggleMaximize()
</script>

<template>
    <header class="titlebar">
        <div
            class="bg-black w-full align-middle content-center flex justify-between"
        >
            <h1
                class="text-white font-bold mx-2 max-sm:text-center order-1 md:order-2"
            >
                US Patent Status
            </h1>
            <div class="text-white order-2 md:order-1">
                <MenuBar class="Clickbutton" />
            </div>
            <div class="align-middle order-3">
                <fa
                    class="text-green-500 mx-1 Clickbutton hover:text-green-300"
                    icon="circle"
                    @click="minimize"
                />
                <fa
                    class="text-amber-500 mx-1 Clickbutton hover:text-amber-300"
                    icon="circle"
                    @click="toggleMaximize"
                />
                <fa
                    class="text-red-500 mx-1 Clickbutton hover:text-red-300"
                    icon="circle"
                    @click="closeApp"
                />
            </div>
        </div>
    </header>

    <RouterView class="lg:h-[93/100] md:h-[92%] h-[92%] bg-slate-400" />

    <footer>
        <div class="w-full bg-black">
            <h1 class="text-white text-center">this is footer</h1>
        </div>
    </footer>
</template>

<style scoped>
.titlebar {
    -webkit-user-select: none;
    user-select: none;
    -webkit-app-region: drag;
}
.Clickbutton {
    -webkit-app-region: no-drag;
}
</style>

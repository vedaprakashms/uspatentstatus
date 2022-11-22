<script lang="ts" setup>
import {RouterLink} from "vue-router"
</script>
<template>
    <ul class="flex">
        <li class="mx-1 uppercase font-bold text-amber-400">
            <RouterLink to="/">Status</RouterLink>            
        </li> | 
        <li class="mx-1 uppercase font-bold text-amber-400">
            <RouterLink to="/template">Template</RouterLink>
        </li> |
        <li class="mx-1 uppercase font-bold text-amber-400">
            <RouterLink to="/about">About</RouterLink>
        </li>
    </ul>
</template>
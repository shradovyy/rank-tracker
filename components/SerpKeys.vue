<template>
    <div class="grid gap-4">
        <div class="flex items-center gap-4">
            <h2 class="subheading">Your SERP API Keys</h2>
            <button class="button-white" @click="addSerpApiKeyUI">Add Key</button>
        </div>
        <div class="border border-gray-100 rounded-xl overflow-hidden shadow-xl shadow-gray-100">
            <div v-if="serpApiKeys.length > 0">
                <SerpKeysItem class="border-b border-b-gray-100 last:border-b-0" :key="item._id" :item="item" v-for="item of serpApiKeys"/>
            </div>
            <div class="flex py-10 px-6 items-center justify-center flex-col gap-4" v-else>
                <p class="paragraph text-center">You haven't added any SERP API keys yet</p>
                <button class="button-white" @click="addSerpApiKeyUI">Add Key</button>
            </div>
        </div>
        
    </div>
</template>

<script setup>
import SerpKeysItem from '~/components/SerpKeysItem.vue';
const { keys: serpApiKeys, getApiKeys, addSerpApiKeyUI } = useSerp();
await getApiKeys();
</script>

<style lang="scss" scoped>

</style>
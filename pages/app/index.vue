<template>
    <FullRankTrackingApp/>
</template>

<script setup>
import FullRankTrackingApp from '~/components/FullRankTrackingApp.vue'

definePageMeta({
    middleware: 'auth'
})

useSeoMeta({
    title: 'Rank Tracker - JSguy.dev',
    ogTitle: 'Rank Tracker - JSguy.dev',
})
</script>
<template>
    <footer class="section">
        <div class="container-group py-6">
            <div class="flex justify-center items-center">
                <p class="text-sm dark:text-gray-400">© {{ year }} <a href="https://jsguy.dev/" class="text-theme-blue">JSguy.dev</a>. All Rights Reserved</p>
            </div>
        </div>
    </footer>
</template>

<script setup>
import moment from 'moment';
const year = ref(moment().year());
</script>

<style lang="scss" scoped>
</style>
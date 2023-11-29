<template>
    <div class="px-4 py-4 flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
        <div>
            <div class="subheading text-lg">
                <div v-if="hidden"><a href="" class="text-gray-400 hover:text-theme-blue" @click.prevent="hidden = !hidden">Hidden <fa :icon="{ prefix: 'fas', iconName: 'eye' }"/></a></div>
                <div class="break-all" v-else>{{ item.api_key }}</div>
            </div>
            <div class="paragraph text-sm">{{ item.plan_searches_left }} / {{ item.searches_per_month }} <strong>left</strong></div>
        </div>
        <div>
            <button class="button-white text-red-500" @click.prevent="serp.removeApiKeyUI(item._id)">Delete</button>
        </div>
    </div>
</template>

<script setup>
defineProps({
    item: {
        required: true,
        type: Object
    }
});

const serp = useSerp();

const hidden = ref(true);

</script>

<style lang="scss" scoped>

</style>
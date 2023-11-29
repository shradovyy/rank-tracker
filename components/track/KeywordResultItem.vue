<template>
    <div>
        <div>
            <div v-if="prevPos" class="flex items-center gap-2">
                <span class="py-1 px-2 rounded-full text-xs font-semibold bg-gray-200">{{ result.previous.position }}</span>
                <span class="text-sm"><fa :icon="{ prefix: 'fas', iconName: 'arrow-right' }"/></span>
                <span class="py-1 px-2 rounded-full text-xs font-semibold bg-gray-200" :class="{ '!bg-emerald-500 text-white' : (result.current.position < result.previous.position), '!bg-red-400 text-white' : (result.current.position > result.previous.position) }">{{ result.current.position }}</span>
            </div>
            <div v-else>
                <span class="py-1 px-2 rounded-full text-xs font-semibold bg-gray-200">{{ result.current.position }}</span>
            </div>
        </div>
        <div>
            <h3 class="subheading">{{ result.current.title }}</h3>
            <a :href="result.current.link" class="paragraph text-theme-blue text-sm" target="_blank">{{ result.current.link }} <fa :icon="{ prefix: 'fas', iconName: 'link' }"/></a>
        </div>
        <div>
            <div  v-if="result.recentPositions.length > 1">
                <KeywordMiniGraph :series="[ { name: 'Position', data: graphData  } ]"/>
            </div>
        </div>
        <div class="paragraph text-sm text-right">{{ timeAgo }}</div>
    </div>
</template>

<script setup>
import KeywordMiniGraph from './KeywordMiniGraph.vue'
import moment from 'moment';

const props = defineProps(['result'])

const timeAgo = computed(() => {
    return moment(props.result.current.updatedOn).fromNow();
});

const prevPos = computed(() => {
    return props.result.previous;
});

const graphData = computed(() => {
    return props.result.recentPositions.map(item => item.position).reverse();
});

</script>

<style lang="scss" scoped>

</style>
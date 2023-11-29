<template>
    <div class="grid gap-4" v-if="stats">

        <div class="flex items-center gap-4 flex-wrap">
            <h2 class="subheading">Overview</h2>
            <div class="flex border border-gray-100 overflow-hidden rounded-lg p-1 gap-1">
                <button
                    class="h-6 px-2 flex items-center text-sm rounded-md  hover:bg-gray-100 transition duration-200"
                    :class="{'bg-gray-100 text-theme-blue font-semibold' : selectedPeriod === period}"
                    v-for="period of periods"
                    :key="period"
                    @click="selectedPeriod = period"
                    :disabled="loading"
                    >
                        {{ period }}
                </button>
            </div>
        </div>

        <div class="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 content-start border border-gray-100 rounded-xl overflow-hidden bg-white shadow-xl shadow-gray-100">

            <div class="bg-white/50 absolute top-0 left-0 w-full h-full flex items-center justify-center" v-if="loading">
                <Loader/>
            </div>

            <div class="flex flex-col gap-2 p-4 border-gray-100 border-b lg:border-b-0 sm:border-r">
                <h3 class="subheading">All</h3>
                <div>
                    <div class="flex flex-col gap-2">
                        <div class="paragraph text-sm flex items-center gap-2">
                            <span>{{ stats.totalCurrentPages }} organic pages</span>
                            <span v-if="stats.pageDifference > 0" class="text-emerald-600 font-bold"><fa :icon="{ prefix: 'fas', iconName: 'arrow-up' }"/> {{ stats.pageDifference }}</span>
                            <span v-else-if="stats.pageDifference < 0" class="text-red-500 font-bold"><fa :icon="{ prefix: 'fas', iconName: 'arrow-down' }"/> {{ Math.abs(stats.pageDifference) }}</span>
                            <span v-else class="text-gray-500 font-bold">{{ stats.pageDifference }}</span>
                        </div>
                        <div class="paragraph text-sm flex items-center gap-2">
                            <div>{{ stats.totalKeywords }} keywords</div>
                            <div class="flex items-center gap-2">
                                <span v-if="stats.keywordsWentUp > 0"  class="text-emerald-600 font-bold"><fa :icon="{ prefix: 'fas', iconName: 'arrow-up' }"/> {{ stats.keywordsWentUp }}</span>
                                <span v-if="stats.keywordsWentDown > 0"  class="text-red-500 font-bold"><fa :icon="{ prefix: 'fas', iconName: 'arrow-down' }"/> {{ stats.keywordsWentDown }}</span>
                            </div>
                        </div>
                    </div>
                    <h4 class="mt-4 text-4xl text-gray-800 font-semibold">{{ stats.totalKeywords }} <span class="text-sm text-gray-500">keywords</span></h4>
                </div>
            </div>

            <div v-for="(item, key) of stats.globalRankingChanges"  class="flex flex-col gap-2 p-4 topRankings" :class="`top${item.topRanking}`">
                <h3 class="subheading">Top {{ item.topRanking }}</h3>
                <div>
                    <div class="flex flex-col gap-1">
                        <div class="paragraph text-sm flex items-center gap-2">
                            <span>{{ item.currentTotalPages }} organic pages</span>
                            <span v-if="item.pageDifference > 0" class="text-emerald-600 font-bold"><fa :icon="{ prefix: 'fas', iconName: 'arrow-up' }"/> {{ item.pageDifference }}</span>
                            <span v-else-if="item.pageDifference < 0" class="text-red-500 font-bold"><fa :icon="{ prefix: 'fas', iconName: 'arrow-down' }"/> {{ Math.abs(item.pageDifference) }}</span>
                            <span v-else class="text-gray-500 font-bold">{{ item.pageDifference }}</span>
                        </div>
                        <div class="paragraph text-sm flex items-center gap-2">
                            <span>{{ item.keywordsInTopRanking }} keywords</span>
                            <span v-if="item.keywordDifference > 0" class="text-emerald-600 font-bold"><fa :icon="{ prefix: 'fas', iconName: 'arrow-up' }"/> {{ item.keywordDifference }}</span>
                            <span v-else-if="item.keywordDifference < 0" class="text-red-500 font-bold"><fa :icon="{ prefix: 'fas', iconName: 'arrow-down' }"/> {{ Math.abs(item.keywordDifference) }}</span>
                            <span v-else class="text-gray-500 font-bold">{{ item.keywordDifference }}</span>
                        </div>
                    </div>
                    <h4 class="mt-4 text-2xl font-semibold text-emerald-600"><span class="text-4xl">{{ item.keywordsInTopRanking }}</span> / {{ stats.totalKeywords }}</h4>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import Loader from './Loader.vue';
const props = defineProps(['filters'])
const stats = ref(null);
const periods = ref(['1d', '7d', '1m', '3m', '6m', '1y']);
const selectedPeriod = ref('7d');
const loading = ref(false);

const { getDashboardStats } = useTrack();

watch(selectedPeriod, () => {
    getKeywordStats();
});

const getKeywordStats = async () => {
    loading.value = true;
    await getDashboardStats({ ...props.filters, period: selectedPeriod.value }, (err, body) => {
        if(!err) {
            stats.value = body;
        }
    });
    loading.value = false;
}

await getKeywordStats();

</script>

<style lang="scss" scoped>
.topRankings {
    @apply border-gray-100 border border-t-0 border-l-0 border-r-0 last:border-0;
    &.top1 {
        @apply md:border-r lg:border-b-0;
    }
    &.top3 {
        @apply sm:border-r md:border-r-0 lg:border-r lg:border-b-0;
    }
    &.top5 {
        @apply md:border-b-0 md:border-r;
    }
    &.top10 {
        @apply sm:border-r sm:border-b-0 ;
    }
}
</style>
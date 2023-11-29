<template>
    <div class="flex flex-col gap-4">
        <div class="flex items-center gap-4">
            <h2 class="subheading">Track Keywords</h2>
            <button class="button-white" @click="addKeyword">Add Keyword</button>
        </div>

        <div class=" bg-white shadow-lg shadow-gray-200 border border-gray-100 rounded-xl">
            <div class="p-4 border-b border-b-gray-100 flex items-center flex-wrap">
                <h2 class="subheading mr-4">{{ keywords.length }} {{ keywords.length === 1 ? 'keyword' : 'keywords' }}</h2>
                <Loader v-if="loading" class="text-black"/>
            </div>

            <div class="overflow-y-visible overflow-x-auto">
                <div class="min-w-[1024px] relative" v-if="keywords.length > 0">
                    <div class="grid-row grid-cols-[minmax(0,_1fr)_120px_120px_minmax(0,_1fr)_150px_70px]">
                        <div class="grid-col">Keyword</div>
                        <div class="grid-col truncate">Country</div>
                        <div class="grid-col">Position</div>
                        <div class="grid-col">URL</div>
                        <div class="grid-col text-right">Updated</div>
                    </div>
                    <KeywordGridRow class="grid-row grid-cols-[minmax(0,_1fr)_120px_120px_minmax(0,_1fr)_150px_70px]" :key="item._id" :item="item" v-for="item of keywords" @remove="handleRemoveKeyword" @refresh="handleKeywordRefresh"/>
                </div>
                <div class="flex py-10 px-6 items-center justify-center flex-col gap-4" v-else>
                    <p class="paragraph text-center">You don't have any keywords to track yet</p>
                    <button class="button-white" @click="addKeyword">Add Keyword</button>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import KeywordGridRow from '~/components/track/KeywordGridRow.vue';
import Loader from '~/components/Loader.vue';

const track = useTrack();
const serp = useSerp();
const keywords = ref([]);
const loading = ref(false);

const props = defineProps(['filters']);

const addKeyword = () => {
    track.addKeywordUI(props.filters.site || '', (data) => {
        getKeywords();
        serp.getApiKeys();
    });
}

// get list of tracked keywords
const getKeywords = async () => {
    loading.value = true;
    await track.getKeywords(props.filters, (err, data) => {
        if(!err) {
            keywords.value = data;
        }
    });
    loading.value = false;
}

// remove keyword
const handleRemoveKeyword = async (keywordId) => {
    loading.value = true;
    await track.removeKeyword(keywordId, (err, body) => {
        if(!err) {
            keywords.value = keywords.value.filter(keyword => keyword._id !== keywordId);
        }
    });
    loading.value = false;
}

// refresh keyword
const handleKeywordRefresh = async (keywordId) => {
    loading.value = true;
    await track.getKeywords({ keywordId }, (err, data) => {
        if(!err) {
            serp.getApiKeys();
            if(data && data[0]) {
                keywords.value = keywords.value.map(keyword => keyword._id === keywordId ? data[0] : keyword);
            }
        }
    });
    loading.value = false;
}

await getKeywords();

</script>

<style lang="scss" scoped>

</style>
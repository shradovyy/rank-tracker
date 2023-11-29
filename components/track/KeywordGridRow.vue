<template>
    <div>
        <div class="paragraph text-sm"><a href="" class="text-theme-blue" @click.prevent="expanded = !expanded">{{ item.keyword }}</a></div>
        <div class="paragraph text-sm truncate">{{ country.country_name }}</div>
        <div class="paragraph text-sm">
            <div v-if="firstPage">
                <div v-if="firstPage.previous" class="flex items-center gap-2">
                    <span class="py-1 px-2 rounded-full text-xs font-semibold bg-gray-200">{{ firstPage.previous.position }}</span>
                    <span class="text-sm"><fa :icon="{ prefix: 'fas', iconName: 'arrow-right' }"/></span>
                    <span class="py-1 px-2 rounded-full text-xs font-semibold bg-gray-200" :class="{ '!bg-emerald-500 text-white' : (firstPage.current.position < firstPage.previous.position), '!bg-red-400 text-white' : (firstPage.current.position > firstPage.previous.position) }">{{ firstPage.current.position }}</span>
                </div>
                <div v-else>
                    <span class="py-1 px-2 rounded-full text-xs font-semibold bg-gray-200">{{ firstPage.current.position }}</span>
                </div>
            </div>
            <div v-else>—</div> 
        </div>
        <div class="paragraph text-sm flex flex-wrap">
            <div class="truncate mr-2">
                <span v-if="item.results[0]"><a :href="item.results[0].current.link" target="_blank" class="text-theme-blue">{{ item.results[0].current.link }}</a></span>    
                <span v-else>—</span>
            </div>
            <div v-if="item.results.length > 1">
                <span><a href="" @click.prevent="expanded = !expanded" class="hover:text-theme-blue text-gray-400 font-semibold">{{ (item.results.length - 1) }} more</a></span>
            </div>
        </div>
        <div class="paragraph text-sm text-right">{{ timeAgo }}</div>
        <div class="flex justify-end gap-2">

            <Loader v-if="refreshingRank"/>
            <button class="button-white w-6 h-6 p-0" @click="refreshRanking" v-else><fa :icon="{ prefix: 'fas', iconName: 'rotate-right' }"/></button>

            <button class="button-white w-6 h-6 p-0" @click="handleRemove"><fa :icon="{ prefix: 'fas', iconName: 'xmark' }"/></button>
        </div>

        <div class="col-span-full grid gap-4 relative" v-if="expanded && firstPage">

            <div class="border border-gray-100 rounded-md shadow-xl my-4 shadow-gray-100 bg-white">
                <div class="p-4 border-b border-b-gray-100 flex items-center justify-between">
                    <h2 class="subheading">Organic Pages</h2>
                    <a href="" class="flex justify-center items-center w-8 h-8 border border-gray-100 rounded-lg bg-white" @click.prevent="expanded = false"><fa :icon="{ prefix: 'fas', iconName: 'xmark' }"/></a>
                </div>
                <div class="">

                    <div class="grid-row grid-cols-[120px_minmax(0,_1fr)_120px_150px]">
                        <div class="grid-col">Position</div>
                        <div class="grid-col">Search Result</div>
                        <div class="grid-col">History</div>
                        <div class="grid-col text-right">Updated</div>
                    </div>

                    <KeywordResultItem class="grid-row grid-cols-[120px_minmax(0,_1fr)_120px_150px]" :key="result._id" v-for="result of item.results" :result="result"/>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import moment from 'moment';
import GoogleCountries from '~/js/google-countries-object'
import KeywordResultItem from './KeywordResultItem.vue';
import Loader from '../Loader.vue';
const props = defineProps(['item']);
const emit = defineEmits(['remove', 'refresh']);

const track = useTrack();

const refreshingRank = ref(false);
const expanded = ref(false);
const timeAgo = computed(() => {
    return moment(props.item.updatedOn).fromNow();
});

const country = computed(() => {
    return GoogleCountries[props.item.country];
})

const firstPage = computed(() => {
    return props.item.results[0];
})

const handleRemove = () => {
    emit('remove', props.item._id);
}

const refreshRanking = async () => {
    refreshingRank.value = true;
    await track.addKeyword(props.item.keyword, props.item.site, props.item.country, (err, body) => {
        if(!err) {
            emit('refresh', props.item._id);
        }
    });
    refreshingRank.value = false;
}

</script>

<style lang="scss" scoped>

</style>
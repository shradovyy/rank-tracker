<template>
    <section class="section">
        <div class="container-group">
            <Stats :filters="filters"/>
            <FiltersComponent v-model:filters="filters"/>        
            <RankTrackerApp :filters="filters"/>
            <SerpKeys/>
        </div>
    </section>
</template>

<script setup>
import Stats from '~/components/Stats.vue';
import SerpKeys from '~/components/SerpKeys.vue';
import RankTrackerApp from '~/components/RankTrackerApp.vue';
import FiltersComponent from '~/components/Filters.vue';
import moment from 'moment';

const route = useRoute();
const router = useRouter();

// filters
const filters = ref({
    country: '',
    site: '',
    ...route.query
});

// watch filters to change route
watch(filters, (to, from) => {
    let query = {};
    if(filters.value.country) query.country = filters.value.country;
    if(filters.value.site) query.site = filters.value.site;
    if(Object.keys(query).length <= 0) router.push({ path: `/app` });
    else router.push({ path: `/app/search-${moment().unix()}`, query: query });
}, { deep: true });
</script>

<style lang="scss" scoped>

</style>
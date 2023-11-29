<template>
    <div class="flex flex-col gap-4">
        <div class="flex justify-between items-center">
            <div class="flex items-center gap-4">
                <h2 class="subheading">Filters</h2>
            </div>
        </div>

        <div class="bg-white shadow-lg p-4 shadow-gray-200 border border-gray-100 rounded-xl">
            <div class="flex flex-wrap gap-4 items-end">
                <select v-model="filters.country" class="max-w-[200px] border bg-white border-gray-200 block w-full rounded-md px-2 text-gray-900 h-8 placeholder:text-gray-400 text-sm md:text-base outline-none focus:ring-2 ring-offset-1">
                    <option value="">All countries</option>
                    <option :value="country._id" v-for="country of availableFilters.countries">{{ GoogleCountriesObj[country._id].country_name }} </option>
                </select>
                <select v-model="filters.site" class="max-w-[200px] border bg-white border-gray-200 block w-full rounded-md px-2 text-gray-900 h-8 placeholder:text-gray-400 text-sm md:text-base outline-none focus:ring-2 ring-offset-1">
                    <option value="">All sites</option>
                    <option :value="site._id" v-for="site of availableFilters.sites">{{ site._id }}</option>
                </select>
                <button class="button-white" v-if="filtersChanged" @click="applyFilters">Apply filters</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import GoogleCountriesObj from '~/js/google-countries-object'
const { getAvailableFilters } = useTrack();

const props = defineProps(['filters'])
const emit = defineEmits(['update:filters']);
const filters = ref({ ...props.filters });
const filtersChanged = ref(false);

watch(filters.value, (to, from) => {
    filtersChanged.value = true;
}, { deep: true });

const applyFilters = () => {
    emit('update:filters', { ...filters.value });
    filtersChanged.value = false;
}

// get list of available filters based on tracked keywords
const availableFilters = ref({ countries: [], sites: [] });
const fetchAvailableFilters = async () => {
    const { data, error } = await getAvailableFilters();
    if(!error.value) {
        availableFilters.value = data.value;
    }
}

await fetchAvailableFilters()

</script>

<style lang="scss" scoped>

</style>
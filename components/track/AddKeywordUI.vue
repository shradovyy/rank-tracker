<template>
     <div class="p-6 grid gap-2">
        <Input name="Keyword" placeholder="Enter keyword to track" :error="errors.keyword" v-model="_keyword"/>
        <Input name="URL" placeholder="Enter URL" :error="errors.url" v-model="_url"/>
        
        <Input name="Country" :error="errors.country" type="slot">
            <select v-model="country" class="border bg-white border-gray-200 block w-full rounded-md px-4 text-gray-900 h-10 placeholder:text-gray-400 text-sm md:text-base outline-none focus:ring-2 ring-offset-1">
                <option :value="country.country_code" v-for="country of GoogleCountries">{{ country.country_name }} ({{ country.country_code.toUpperCase() }})</option>
            </select>
        </Input>
        

    </div>
</template>

<script setup>
import Input from '../Input.vue';
import GoogleCountries from '~/js/google-countries.json'
const props = defineProps(['url', 'keyword', 'errors', 'modal'])
const _keyword = ref(props.keyword || '');
const _url = ref(props.url || '');
const country = ref('us');
const errors = ref({});

const track = useTrack();

props.modal.onConfirm(async () => {
    props.modal.processing(true);
    await track.addKeyword(_keyword.value, _url.value, country.value, (err, data) => {
        if(err) {
            if(data.errors) errors.value = data.errors;
            else alert(data.message || 'Something went wrong. Please, try again!');
        } else {
            props.modal.close(true, data);
        }
    });
    props.modal.processing(false);
});

watch(_url, (to, from) => {
    props.modal.setProp('url', _url.value);
});

watch(_keyword, (to, from) => {
    props.modal.setProp('keyword', _keyword.value);
});

</script>

<style lang="scss" scoped>

</style>
<template>
    <div class="p-6">
        <Input name="API Key" placeholder="Enter SERP API Key" :error="errors.key" v-model="key"/>
    </div>
</template>

<script setup>
import Input from '../Input.vue';
const props = defineProps(['modal'])

const { addApiKey } = useSerp();

const key = ref('');
const errors = ref({});

props.modal.onConfirm(async () => {
    props.modal.processing(true);
    errors.value = {};
    await addApiKey(key.value, (err, body) => {
        if(err) {
            if(body.errors) errors.value = body.errors;
            else alert(body.message || "Something went wrong. Please, try again!")
        } else {
            props.modal.close();
        }
    });
    props.modal.processing(false);
});

</script>

<style lang="scss" scoped>

</style>
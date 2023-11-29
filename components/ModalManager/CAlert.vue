<template>
    <div class="py-8 px-6">
        {{ text }}
    </div>
</template>

<script setup>

const props = defineProps(['text', 'modal']);

props.modal.onConfirm(() => {
    props.modal.close(true);
});

</script>

<style lang="scss" scoped>
.alert-body {
    padding: 30px 20px 20px 20px;
}
</style>
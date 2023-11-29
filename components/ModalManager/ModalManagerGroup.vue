<template>
    <div>
        <ModalManager v-model="modals"/>
    </div>
</template>

<script setup>
import ModalManager from './ModalManager.vue';
import Modal from './Modal'
import CAlert from './CAlert.vue';
const modals = ref([]);

const createModal = (options = null) => {
    
    if(!options) return null;
    let modal = new Modal(options);
    modals.value.push(modal);

    modal.onClose(() => {
        for(let i = 0; i < modals.value.length; i++) {
            if(modals.value[i].modalId === modal.modalId) {
                setTimeout(() => {
                    modals.value.splice(i, 1);
                }, 200);
                break;
            }
        }
    });

    return modal;
}

const showConfirm = async (text) => {

    let modal = createModal({
        component: CAlert,
        confirm: 'Confirm',
        width: '350px',
        props: {
            text: text
        }
    });

    return await new Promise(resolve => {
        modal.onClose((success) => {
            resolve(success);
        });
    });
}

const showAlert = async (text) => {
    let modal = createModal({
        component: CAlert,
        confirm: 'OK',
        width: '350px',
        props: {
            text: text
        }
    });
}

defineExpose({
    createModal,
    showConfirm,
    showAlert
});

const emit = defineEmits(['ready']);

onMounted(() => {
    emit('ready');
})


</script>

<style lang="scss" scoped>

</style>
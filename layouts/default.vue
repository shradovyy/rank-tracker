<template>
    <div class="page-container relative overflow-hidden z-0">
        <Nav/>
        <div class="content-wrap">
            <slot/>
        </div>
        <Footer/>
        <ModalManagerGroup ref="modalManagerRef" @ready="modalMangerReady"/>
    </div>
</template>

<script setup>
import Nav from '../components/Nav.vue'
import Footer from '~/components/Footer.vue';
import ModalManagerGroup from '~/components/ModalManager/ModalManagerGroup.vue';

import { useModalManager } from '~/store/modalManager';
const { setModalManager } = useModalManager();


const modalManagerRef = ref(null);
const modalMangerReady = () => {
    setModalManager(modalManagerRef.value);
}

</script>

<style lang="scss" scoped>
.layout-wrapper {
    display: grid;
    grid-template-rows: minmax(1fr, auto) auto;
    min-height: 100vh;
}

.page-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.content-wrap {
    flex: 1;  /* This will push the footer to the bottom when there's not enough content */
}

</style>

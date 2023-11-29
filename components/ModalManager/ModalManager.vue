<template>
    <div>

        <div class="fixed top-0 left-0 w-full h-full bg-black/10 z-40" v-if="modals.length > 0" ></div>

        <div :key="modal.modalId" v-for="(modal, key) of modals">
            <div class="fixed top-0 left-0 w-full h-full z-50" >
                <div class="w-full h-full overflow-y-scroll">
                    <div class="flex justify-center items-center min-h-full py-12 px-6" :data-modal-holder="true">
                        <Transition name="bounce" appear>
                            <div class="bg-white min-w-[250px] w-full max-w-lg rounded-lg min-h-[100px] shadow-md" :data-modal="modal.modalId" :style="[modal.width ? `max-width: ${modal.width}` : '']" v-if="!(currentModal !== key || modal.closed)">

                                <div class="p-4 border-b border-b-gray-100 flex justify-between items-center" v-if="modal.title">
                                    <div>
                                        <h3 class="text-lg font-bold">{{ modal.title }}</h3>
                                        <div class="text-sm text-slate-600" v-if="modal.description">{{ modal.description }}</div>
                                    </div>
                                    <button class="button-white" @click="closeModal(key)"><fa :icon="{ prefix: 'fas', iconName: 'xmark' }"/></button>
                                </div>

                                <div class="relative">
                                    <component :is="modal.component" v-bind="modal.props" :modal="modal"/>
                                    <div class="bg-white/50 absolute top-0 left-0 w-full h-full" v-if="modal.isProcessing"></div>
                                </div>

                                <div class="border-t border-t-gray-100 p-4 flex justify-end gap-4">
                                    <button class="button-white" :id="`cancel-button-${modal.modalId}`" @click.prevent="closeModal(key)" :disabled="modal.isProcessing" v-if="!modal.hideCancelButton">{{ modal.buttons.cancel }}</button>
                                    <button class="button-white bg-theme-blue text-white hover:bg-theme-blue-active border-theme-blue-active" @click.prevent="confirm(modal, key)" :disabled="modal.isProcessing">{{ modal.buttons.confirm }}</button>
                                </div>

                            </div>
                        </Transition>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    export default {
        props: ['modelValue'],
        data() {
            return {
                modals: this.modelValue || []
            }
        },
        computed: {
            currentModal() {
                return this.modals.length - 1;
            },
            currentModalObj() {
                try {
                    return this.modals[this.currentModal];
                } catch(e) {
                    return null;
                }
            },
            modalsQuantity() {
                return this.modals.length;
            }
        },
        methods: {
            closeModal(key) {
                this.modals[key].cancel();
            },
            closeCurrentModal(e) {
                try {
                    if(e.target.hasAttribute('data-modal-holder')) {
                        this.closeModal(this.currentModal);
                    }
                } catch(e) {}
            },
            async confirm(modal, key) {
                if(modal.callback.confirm) {
                    modal.callback.confirm(modal.props);
                }
            }
        },
        watch: {
            currentModalObj() {
                if(this.currentModalObj) {
                    try {
                        setTimeout(() => {
                            document.getElementById(`cancel-button-${this.currentModalObj.modalId}`).focus();
                        }, 100);
                    } catch(e) {}
                }
            },
            modelValue() {
                this.modals = this.modelValue || [];
            },
            modals() {
                this.$emit('update:modelValue', this.modals);
            },
            modalsQuantity() {
                if(this.modalsQuantity > 0) {
                    document.body.classList.add('overflow-hidden');
                } else {
                    document.body.classList.remove('overflow-hidden');
                }                
            }
        }
    }
</script>

<style lang="scss" scoped>
.bounce-enter-active {
    animation: bounce-in 0.3s;
}
.bounce-leave-active {
    animation: bounce-in 0.2s reverse;
}
@keyframes bounce-in {
    0% {
        transform: scale(0);
        opacity: 0;
    }
    50% {
        transform: scale(1.15);
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
}

</style>
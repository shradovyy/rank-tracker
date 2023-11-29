<template>
    <div class="flex flex-col gap-1">
        <div class="flex justify-between items-center">
            <label :for="label" class="block text-sm font-medium leading-6 text-gray-900">{{ name }}</label>
            <span class="text-xs text-red-500">{{ error }}</span>
        </div>
        <input v-if="fieldType === 'text'" v-model="text" :placeholder="placeholder" type="text" :name="label" class="border bg-white border-gray-200 block w-full rounded-md px-4 text-gray-900 h-10 placeholder:text-gray-400 text-sm md:text-base outline-none focus:ring-2 ring-offset-1" :class="{ 'ring-2 ring-red-500' : error }">
        <input v-if="fieldType === 'password'" v-model="text" :placeholder="placeholder" type="password" :name="label" class="border bg-white border-gray-200 block w-full rounded-md px-4 text-gray-900 h-10 placeholder:text-gray-400 text-sm md:text-base outline-none focus:ring-2 ring-offset-1" :class="{ 'ring-2 ring-red-500' : error }">
        <textarea v-if="fieldType === 'textarea'" v-model="text" :name="label" :placeholder="placeholder" class="border bg-white border-gray-200 block w-full rounded-md p-4 text-gray-900 min-h-[100px] placeholder:text-gray-400 text-sm md:text-base outline-none focus:ring-2 ring-offset-1"></textarea>
        <slot></slot>
    </div>
</template>


<script>

export default {
    name: 'CInput',
    props: ["name", "modelValue", "error", "type", "placeholder", "label"],
    data() {
        return {
            text: this.modelValue || '',
            fieldType: this.type || 'text'
        }
    },
    watch: {
        text: {
            deep: true,
            handler() {
                this.$emit('update:modelValue', this.text);
            }
        },
        modelValue: {
            deep: true,
            handler() {
                this.text = this.modelValue || '';
            }
        }
    }
}
</script>


<style lang="scss">
    
</style>
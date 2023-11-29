<template>
    <div>
        <img src="/images/gradient-bg.png" class="absolute top-0 left-0 h-full md:h-auto w-full object-cover pointer-events-none -z-50">

        <section class="w-full overflow-x-clip relative">
            <div class="max-w-container mx-auto px-4 pt-12 md:pt-36 pb-24 md:pb-48 sm:px-6 lg:px-8">

                <div class="flex flex-col text-center items-center gap-6">
                    <h1 class="max-w-xl text-2xl md:text-3xl lg:text-4xl font-extrabold">Simple Rank Tracking: Your Key to SEO Success</h1>
                    <p class="max-w-[36rem] text-lg sm:text-xl">Efficiently Monitor Your Website's Performance and Outrank the Competition</p>
                    <div class="flex justify-center items-center gap-4 mt-4">
                        <nuxt-link to="/app" class="button-blue flex items-center">Get Started</nuxt-link>
                    </div>
                </div>

            </div>
        </section>

    </div>
</template>

<script setup>
definePageMeta({
    layout: 'default-full'
})


useSeoMeta({
    title: 'Rank Tracker by Stanislav Hradovyy - JSguy.dev',
    ogTitle: 'Rank Tracker by Stanislav Hradovyy - JSguy.dev',
    ogDescription: `Effortlessly track your website's search engine rankings with our user-friendly rank tracking tool. Accurate, real-time updates for SEO success.`,
    description: `Effortlessly track your website's search engine rankings with our user-friendly rank tracking tool. Accurate, real-time updates for SEO success.`
})
</script>

<style lang="scss" scoped>

</style>
<template>
  <div>
    <NuxtLayout>
      <NuxtLoadingIndicator :height="5" color="#007AFF" :duration="5000"/>
      <NuxtPage/>
    </NuxtLayout>
  </div>
</template>

<script setup>
const config = useRuntimeConfig();

</script>

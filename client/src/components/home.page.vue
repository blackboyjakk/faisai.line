<template>
  <h1 class="text-3xl font-bold underline">
    Hello world!
  </h1>
</template>
<script setup lang="ts">
  import { lineLogin } from '@/helper/line-auth';
  import liff from '@line/liff';
  import { useRoute } from 'vue-router';
  const route = useRoute()
  const load = async () => {
    await lineLogin().then(() => {
      const url = route.query.url?.toString()
      if (url) {
        alert(url)
        window.location.href = url
      }
    });


  };

  load()</script>
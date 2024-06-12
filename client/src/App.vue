<script setup lang="ts">
  import { ref } from "vue";
  const visible = ref(true)
  const items = ref([
    {
      label: 'Home',
      icon: 'pi pi-home',
      route: '/'
    },
    {
      label: 'Config',
      icon: 'pi pi-star',
      route: '/config'

    },

  ]);
</script>
<template>
  <header class="card" style="top:0;left: 0;width:100% ;position: absolute; ">
    <div class="lg:container mx-auto px-4">
      <Menubar :model="items" style="max-width:1200px ;">
        <template #item="{ item, props, hasSubmenu }">
          <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
            <a v-ripple :href="href" v-bind="props.action" @click="navigate">
              <span :class="item.icon" />
              <span class="ml-2">{{ item.label }}</span>
            </a>
          </router-link>
        </template>
      </Menubar>
    </div>
  </header>
  <main style="top:0;left: 0;width:100% ;">

    <RouterView />
  </main>
  <footer></footer>
</template>

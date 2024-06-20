<script setup lang="ts">
import { ref } from 'vue';

    const visible = ref(true)
    const items = ref([

        {
            label: 'Workflows',
            icon: 'pi pi-wrench',
            route: '/workflow'

        },
        {
            label: 'Workflow Rules',
            icon: 'pi pi-list-check',
            route: '/workflow-rule'

        },

    ]);
</script>
<template>


    <header class="card" style="top:0;left: 0; position: absolute;width: 100%;">
        <div>
            <Menubar :model="items" style="">
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
</template>
import { ref } from 'vue';

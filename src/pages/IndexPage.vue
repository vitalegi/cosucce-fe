<template>
  <q-page class="row items-start justify-evenly q-pa-md">
    <common-breadcrumbs />
    <q-card class="my-card" @click="viewBoards()">
      <img src="~assets/budget.jpg" />
      <q-card-section>
        <div class="text-h6">Budget</div>
        <div class="text-subtitle2">Il mio bellissimo budget</div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import CommonBreadcrumbs from 'src/commons/components/CommonBreadcrumbs.vue';
import routing from 'src/router/routing';
import { useRouter } from 'vue-router';

const router = useRouter();

function viewBoards() {
  routing.budget().viewBoards(router);
}
</script>
<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 500px
</style>

<template>
  <q-page class="row items-center justify-evenly">
    <q-card class="my-card" @click="routing.budget().viewBoards($router)">
      <img src="~assets/budget.jpg" />
      <q-card-section>
        <div class="text-h6">Budget</div>
        <div class="text-subtitle2">Il mio bellissimo budget</div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import routing from 'src/router/routing';
</script>
<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 500px
</style>

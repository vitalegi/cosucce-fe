<template>
  <q-card class="row justify-between" @click="edit()" style="height: 120px">
    <div class="row justify-start q-gutter-xs full-width">
      <div class="text-weight-medium single-line-nowrap-text">
        {{ element.label }}
      </div>
      <IconDisplay :icon="element.icon" :enabled="element.enabled" />
    </div>
  </q-card>
</template>

<script setup lang="ts">
import routing from 'src/router/routing';
import { useRouter } from 'vue-router';
import IconDisplay from '../commons/IconDisplay.vue';
import BoardCategory from 'src/budget/models/board-category';

interface Props {
  element: BoardCategory;
}

const router = useRouter();
const props = withDefaults(defineProps<Props>(), {});

function edit() {
  void routing
    .budget()
    .settingsEditCategory(router, props.element.boardId, props.element.categoryId);
}
</script>

<style lang="sass" scoped></style>

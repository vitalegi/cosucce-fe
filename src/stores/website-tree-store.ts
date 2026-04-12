import { defineStore, acceptHMRUpdate } from 'pinia';
import Breadcrumb from 'src/commons/model/breadcrumb';

export const useWebsiteTreeStore = defineStore('websiteTreeStore', {
  state: () => ({
    breadcrumbs: new Array<Breadcrumb>(),
  }),
  actions: {
    setPages(breadcrumbs: Breadcrumb[]) {
      this.breadcrumbs = breadcrumbs;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useWebsiteTreeStore, import.meta.hot));
}

import Vue from 'vue';
import Router from 'vue-router';
import Start from '@/components/Start';
import AddTags from '@/components/AddTags';
import Tagging from '@/components/Tagging';
import AIPlayground from '@/components/AIPlayground';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Start',
      component: Start,
    },
    {
      path: '/addTags',
      name: 'AddTags',
      component: AddTags,
    },
    {
      path: '/tagging/:fileId',
      name: 'Tagging',
      props: true,
      component: Tagging,
    },
    {
      path: '/ai',
      name: 'AIPlayground',
      component: AIPlayground,
    },
  ],
});

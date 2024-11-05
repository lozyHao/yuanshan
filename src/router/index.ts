import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("@/view/HomeView/HomeView.vue"),
    meta: {
      title: "远山",
    },
  },
  {
    path: "/image-space",
    name: "imageSpace",
    component: () => import("@/view/ImageSpace/ImageSpace.vue"),
    meta: {
      title: "工作区",
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  // 动态设置页面标题
  // if (to.meta.title) {
  // 	document.title = to.meta.title.toString()
  // }
  next();
});

export default router;

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
  },
  {
    path: '/products',
    component: () => import('layouts/ProductsLayout.vue'),
    children: [{ path: '', component: () => import('pages/ProductsPage.vue') }],
  },
  {
    path: '/about',
    component: () => import('layouts/AboutLayout.vue'),
    children: [{ path: '', component: () => import('pages/AboutPage.vue') }],
  },
  {
    path: '/cart',
    component: () => import('layouts/CartLayout.vue'),
    children: [{ path: '', component: () => import('pages/CartPage.vue') }],
  },
  {
    path: '/contacts',
    component: () => import('layouts/ContactsLayout.vue'),
    children: [{ path: '', component: () => import('pages/ContactsPage.vue') }],
  },
  {
    path: '/login',
    component: () => import('layouts/LoginLayout.vue'),
    children: [{ path: '', component: () => import('pages/LoginPage.vue') }],
  },
  {
    path: '/user',
    component: () => import('layouts/UserLayout.vue'),
    children: [{ path: '', component: () => import('pages/UserPage.vue') }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes

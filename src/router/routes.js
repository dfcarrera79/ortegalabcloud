import {useAppStore} from 'src/stores/useAppStore'
import multiguard from 'vue-router-multiguard';

const estaLogeado = (to, from, next) => {
	const appStore = useAppStore();
	if(to.query.app){
	  appStore.setApp(to.query.app);
	}
	if(appStore.usuario.codigo_perfil === 0){
	  return next({path:'/login', query:{ redirect: to.fullPath }});
	}
	return next();
}


const routes = [
	{path: '/',component: () => import('layouts/MainLayout.vue'), children: [{ path: '', component: () => import('pages/Index.vue'), beforeEnter: multiguard([estaLogeado]) }]},
	{path:"/login", component:() => import("layouts/MainLayout.vue"), children:[{ path: "", component: () => import("pages/FLogin.vue") }]},
	{path:"/doc_electronico", component:() => import("layouts/MainLayout.vue"), children:[{ path: "", component: () => import("pages/Documentos.vue"), beforeEnter: multiguard([estaLogeado]) }]},
	{path:"/doc_laboratorio", component:() => import("layouts/MainLayout.vue"), children:[{ path: "", component: () => import("pages/DocumentosLab.vue"), beforeEnter: multiguard([estaLogeado]) }]},

  // Always leave this as last one,
  // but you can also remove it
  	{
    	path: '/:catchAll(.*)*',
    	component: () => import('pages/Error404.vue')
  	}
];

export default routes;

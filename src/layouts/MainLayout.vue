<template>
<q-layout view="lHh Lpr lFf" class="bg_color_page">
	<q-header elevated>
		<q-toolbar v-if="appStore.getUsuarioActivo.codigo_perfil > 0" class="bg-toolbar q-pl-xs no-border">
			<q-btn flat dense round @click="drawer=!drawer" icon="menu" aria-label="Menu" />
			<q-toolbar-title style="font-size:17px">PORTAL</q-toolbar-title>
			<div>
				<q-btn class="full-width bg-toolbar text-white" style="width:35px" flat icon="mdi-account-circle" :label="appStore.getUsuarioActivo.razon_social">
			  		<q-menu>
				  		<q-list bordered style="width:320px">
							<q-item clickable v-ripple><q-item-section @click="editor = true" v-close-popup>Cambiar clave</q-item-section></q-item>
							<q-separator spaced inset />
							<q-item clickable v-ripple><q-item-section @click="cerrar()">Cerrar Sistema</q-item-section></q-item>
				  		</q-list>
					</q-menu>
			  	</q-btn>
			</div>
		</q-toolbar>
	</q-header>
	<q-drawer v-if="appStore.getUsuarioActivo.codigo_perfil > 0" v-model="drawer" show-if-above class="drawer">
		<q-list v-for="(menu, i) in menu_bar" :key="i" class="rounded-borders">
			<q-item clickable v-ripple :to="menu.to" :active="link === 'inbox'" @click="link = 'inbox'" active-class="drawer_menu_item text-caption">
				<q-item-section><q-item-label >{{menu.title}}</q-item-label></q-item-section>
			  	<q-item-section avatar v-if="menu.icon!==null" ><q-icon :name="menu.icon" /></q-item-section>
			</q-item>
			<q-separator />
		</q-list>
	</q-drawer>

	<q-page-container>
		<router-view />
	</q-page-container>

	<!-- Para cambiar la contraseña -->
	<q-dialog v-model="editor" persistent>
		<q-card style="width:320px">
			<q-card-section class="bg-modal-title" style="height:30px;padding:5px">
				<div class="text-subtitle2" style="margin:0,padding:0;height:30px">Cambiar clave de acceso</div>
			</q-card-section>
			<q-separator />
			<q-card-section class="q-pa-xs scroll">
			<div class="row">
				<div class="column col-xs-12 q-pb-xs q-pr-xs q-pt-xs">
					<q-input dense v-model="actual" label="Clave actual" type="password" />
				</div>
				<div class="column col-xs-12 q-pb-xs q-pr-xs q-pt-xs">
					<q-input dense v-model="nueva" label="Nueva clave" type="password" />
				</div>
				<div class="column col-xs-12 q-pb-xs q-pr-xs q-pt-xs">
					<q-input dense v-model="confirma" label="Confirmar clave" type="password"/>
				</div>
			</div>
			</q-card-section>
			<q-separator />
			<q-card-actions align="left" class="bg-modal-footer" >
				<q-btn flat label="Descartar" color="white" v-close-popup />
				<q-space />
				<q-btn outline label="Aplicar" color="white" @click="cambiarClave()" />
			</q-card-actions>
		</q-card>
	</q-dialog>

</q-layout>

</template>

<script setup>

import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar, QSpinnerFacebook } from 'quasar';
import { useAppStore } from 'src/stores/useAppStore';
import { useMensajes } from 'src/services/useMensajes';
import { useAxios } from 'src/services/useAxios';

	const router   = useRouter();
	const appStore = useAppStore();
	const q        = useQuasar();
	const editor   = ref(false);
	const actual   = ref('');
	const nueva    = ref('');
	const confirma = ref('');
	const link     = ref('inbox');
	const drawer   = ref(false);
	const { post } = useAxios();
	const { mostrarMensaje } = useMensajes();

	const menu_bar = computed(() => {
		if(appStore.app === 'portal'){
			return [
				{to: "/doc_electronico", icon:'mdi-book-open-variant', title:"Comprobantes Electrónicos"},
				{to: "/doc_laboratorio", icon:'mdi-hospital-box', title:"Laboratorio de Patología"},
		  	];
		}
		if(appStore.app === 'portal_docelectronico'){
		  	return [
				{to: "/doc_electronico", icon:'mdi-book-open-variant', title:"Comprobantes Electrónicos"}
			];
		}
		if(appStore.app === 'portal_resultadoslab'){
			router.push('/doc_laboratorio');
		  	return [
				{to: "/doc_laboratorio", icon:'mdi-hospital-box', title:"Laboratorio de Patología"}
			];
		}
	});

	const cambiarClave = async () => {
		if(actual.value.trim().length === 0){
			mostrarMensaje('Error', 'Para continuar debe ingresar su clave actual');
		  	return;
		}
		if(nueva.value.trim().length === 0){
		  	mostrarMensaje('Error', 'Para continuar debe ingresar su nueva clave');
		  	return;
		}
		if(nueva.value.trim().length !== confirma.value.trim().length){
			mostrarMensaje('Error', 'No coinciden las nuevas clave ingresadas');
		  	return;
		}
		q.loading.show({spinner:QSpinnerFacebook, message:"Procesando..."});
		const respuesta = await post('/api/perfil/cambiarpass', {}, JSON.stringify({clave:nueva.value, codigo_perfil:appStore.getUsuarioActivo.codigo_perfil}));
		q.loading.hide();
		editor.value = false;
		if(respuesta.length > 0){
			mostrarMensaje('Error', respuesta);
			return;
		}
		mostrarMensaje('Confirmación','Su solicitud se ha procesado correctamente y su clave ha sido actualizada en el sistema');
	}

	const cerrar = () => {
		appStore.cerrarSession();
		router.push('/login');
	}
</script>

<style lang="scss">

	.my-menu-link{
		color: white;
	  	background:#91B4C1
	}

</style>

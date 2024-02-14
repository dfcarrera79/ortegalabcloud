<template>
	<q-page class="flex flex-center bg-image">
		<div class="row">
			<q-img
				src="https://res.cloudinary.com/dvy167slj/image/upload/v1707937413/ortegalab/ortegalabcloud.jpg"
				spinner-color="white"
			/>
			<q-card
				square
				class="shadow-8 bg-white"
				style="width: 300px; height: 260px"
			>
				<div class="row bg-blue-grey-8 justify-center q-pa-xs">
					<span class="text-subtitle2 text-center text-white"
						>PORTAL DE CONSULTAS v2.05</span
					>
				</div>
				<div class="row">
					<div class="column col-xs-12 q-pa-sm">
						<q-input
							v-model="login"
							type="text"
							label="No. de Identificación"
							dense
						/>
					</div>
					<div class="column col-xs-12 q-pa-sm">
						<q-input
							v-model="clave"
							:type="isPwd ? 'password' : 'text'"
							label="Clave - Por defecto su Identificación"
							dense
							@keyup.enter="logearse()"
						>
							<template v-slot:append>
								<q-icon
									:name="
										isPwd ? 'visibility_off' : 'visibility'
									"
									class="cursor-pointer"
									@click="isPwd = !isPwd"
								/>
								<q-tooltip
									class="bg-grey-6 text-caption"
									anchor="bottom middle"
									self="center middle"
								>
									{{
										isPwd
											? "Mostrar clave"
											: "Ocultar clave"
									}}
								</q-tooltip>
							</template>
						</q-input>
					</div>
				</div>
				<q-separator dark />
				<div class="row">
					<div class="column col-xs-12 q-pa-sm">
						<q-btn
							class="full-width text-white"
							style="height: 40px"
							color="blue"
							label="Ingresar"
							@click="logearse()"
						/>
					</div>
				</div>
				<div class="row">
					<div class="column col-xs-12 q-pa-xs">
						<q-btn
							class="full-width text-blue-9"
							style="font-size: 13px; height: 40px"
							color="white"
							flat
							label="Recuperar Contraseña"
							@click="editor = true"
						/>
					</div>
				</div>
				<div
					class="row bg-blue-grey-8 justify-center items-center"
					style="height: 30px"
				>
					<a
						:href="appStore.url_portal"
						style="color: white"
						target="_blank"
						>{{ appStore.web_portal }}</a
					>
				</div>
			</q-card>
		</div>

		<!-- Para resetear la contraseña -->
		<q-dialog v-model="editor" persistent>
			<q-card style="width: 320px">
				<q-card-section
					class="bg-modal-title"
					style="height: 30px; padding: 5px"
				>
					<div
						class="text-subtitle2"
						style="margin:0,padding:0;height:20px"
					>
						Cambiar clave de acceso
					</div>
				</q-card-section>
				<q-separator />
				<q-card-section class="q-pa-xs scroll">
					<div class="row">
						<div class="column col-xs-12 q-pb-xs q-pr-xs q-pt-xs">
							<q-input
								dense
								v-model="numId"
								label="RUC | CI | Pasaporte"
							/>
						</div>
						<div class="column col-xs-12 q-pb-xs q-pr-xs q-pt-xs">
							<q-input dense v-model="email" label="email" />
						</div>
					</div>
				</q-card-section>
				<q-separator />
				<q-card-actions align="left" class="bg-modal-footer">
					<q-btn flat label="Descartar" color="white" v-close-popup />
					<q-space />
					<q-btn
						outline
						label="Aplicar"
						color="white"
						@click="resetearClave()"
					/>
				</q-card-actions>
			</q-card>
		</q-dialog>
	</q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useQuasar, QSpinnerFacebook } from "quasar";
import { useAppStore } from "src/stores/useAppStore";
import { useMensajes } from "src/services/useMensajes";
import { useAxios } from "src/services/useAxios";

const router = useRouter();
const q = useQuasar();
const appStore = useAppStore();
const editor = ref(false);
const isPwd = ref(true);
const login = ref("");
const clave = ref("");
const numId = ref("");
const email = ref("");
const { post } = useAxios();
const { mostrarMensaje } = useMensajes();

onMounted(() => {
	appStore.setDocumentosElectronicos([]);
	appStore.setDocumentosLaboratorio([]);
});

const logearse = async () => {
	if (login.value.trim().length === 0) {
		mostrarMensaje("Error", "Es obligatorio ingresar su login");
		return;
	}
	if (clave.value.trim().length === 0) {
		mostrarMensaje("Error", "Es obligatorio ingresar su clave de acceso");
		return;
	}
	q.loading.show({
		spinner: QSpinnerFacebook,
		message: "Verificando acceso...",
	});
	const respuesta = await post(
		"/api/perfil/autenticar",
		{},
		JSON.stringify({
			numId: login.value.trim(),
			password: clave.value.trim(),
		})
	);
	q.loading.hide();
	if (respuesta.mensaje.trim().length > 0) {
		mostrarMensaje("Error", respuesta.mensaje);
		return;
	}
	respuesta.perfil["contrasena"] = clave.value;
	appStore.setUsuario(respuesta.perfil);
	router.push("/doc_electronico");
};

const resetearClave = async () => {
	if (numId.value.trim().length === 0) {
		mostrarMensaje(
			"Error",
			"Es obligatorio que ingrese su Número de Indetificación"
		);
		return;
	}
	if (email.value.trim().length === 0) {
		mostrarMensaje(
			"Error",
			"Es obligatorio que ingrese un email para notificarle la nueva clave de acceso"
		);
		return;
	}
	if (/.+@.+\..+/.test(email.value) === false) {
		mostrarMensaje(
			"Error",
			"El email ingresado no tiene un formato válido"
		);
		return;
	}
	q.loading.show({ spinner: QSpinnerFacebook, message: "Procesando..." });
	const respuesta = await post(
		"/api/perfil/resetearpass",
		{},
		JSON.stringify({ cedula_ruc: numId.value, email: email.value })
	);
	q.loading.hide();
	editor.value = false;
	if (respuesta.trim().length > 0) {
		mostrarMensaje("Error", respuesta);
		return;
	}
	mostrarMensaje(
		"Confirmación",
		"Su solicitud se ha procesado correctamente, y se le ha enviado la nueva contraseña a su correo electrónico"
	);
};
</script>

<style scoped>
.bg-image {
	background-image: url("https://res.cloudinary.com/dvy167slj/image/upload/v1707948537/background.jpg");
	background-repeat: repeat;
	background-size: cover;
}
</style>

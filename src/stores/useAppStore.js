import { defineStore } from "pinia";

export const useAppStore = defineStore("oApp", {
	state: () => ({
		//api:'https://www.loxasoluciones-cloud.com:7171',
		api: "http://186.5.111.32:3004",
		//api:'http://192.168.50.14:7070',
		usuario: {
			codigo_perfil: 0,
			ruc_ci: "",
			contrasena: "",
			razon_social: "No logeado",
			nombre_comercial: "",
			email: "",
		},
		documentos_electronicos: [],
		documentos_laboratorio: [],
		app: "portal", // portal, portal_docelectronico, portal_resultadoslab
		nombre_portal: "OrtegaLab",
		web_portal: "www.ortegalab.com",
		url_portal: "https://ortegalab.com/",
		logo_portal: "../statics/ortegalab.jpg",
		//nombre_portal:'LoxaSoluciones',
		//web_portal:'www.loxasoluciones.com',
		//url_portal:'https://www.loxasoluciones.com/',
		//logo_portal:'../statics/logo_loxa.png',
	}),

	getters: {
		getURLApi(state) {
			return state.api;
		},
		getUsuarioActivo(state) {
			return state.usuario;
		},
		getDocumentosElectronicos(state) {
			return state.documentos_electronicos;
		},
		getDocumentosLaboratorio(state) {
			return state.documentos_laboratorio;
		},
	},

	actions: {
		iniciarApp(payload) {
			setUsuario(payload);
		},
		setApp(app) {
			this.app = app;
		},
		setUsuario(perfil) {
			this.usuario.ruc_ci = perfil.ruc_ci;
			this.usuario.contrasena = perfil.contrasena;
			this.usuario.codigo_perfil = perfil.codigo_perfil;
			this.usuario.razon_social = perfil.razon_social;
			this.usuario.nombre_comercial = perfil.nombre_comercial;
			this.usuario.email = perfil.email;
		},
		setDocumentosElectronicos(documentos) {
			this.documentos_electronicos = documentos;
		},
		setDocumentosLaboratorio(documentos) {
			this.documentos_laboratorio = documentos;
		},
		cerrarSession() {
			(this.usuario = {
				codigo_perfil: 0,
				ruc_ci: "",
				contrasena: "",
				razon_social: "No logeado",
				nombre_comercial: "",
				email: "",
			}),
				(this.documentos_electronicos = []);
			this.documentos_laboratorio = [];
		},
	},
});

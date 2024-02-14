<template>
	<form-admin-layout>
		<template v-slot:header>
			<div class="row">
				<div class="column col-xs-12 col-sm-3 q-pa-xs">
					<q-select dense v-model="tipo" :options="tipos" label="Tipo de Comprobante" :style="getStyle_1" />
				</div>
				<div class="column col-xs-6 col-sm-2 q-pa-xs ">
					<q-input dense v-model="desde" label="Desde" type="date" style="font-size:13px"/>
				</div>
				<div class="column col-xs-6 col-sm-2 q-pa-xs">
					<q-input dense v-model="hasta" label="Hasta" type="date" style="font-size:13px"/>
				</div>
				<div class="column col-xs-12 col-sm-2 q-pa-xs">
					<q-btn color="primary" icon="search" @click="listar(true)" label="Listar" :style="getStyle"/>
				</div>
			</div>
		</template>

		<!-- El contendor central, tabla, etc -->
		<q-table ref="virtualListRef" virtual-scroll :v-model:pagination="pagination" :rows-per-page-options="[0]" :virtual-scroll-item-size="48" :virtual-scroll-sticky-start="48" :columns="columnas_movil"
			no-data-label="No hay datos disponibles" :rows="lista" row-key="codigo_documento" class="my-sticky-header-column-table-admin" style="height:calc(100vh - 235px);max-width:100vw"
			hide-bottom hide-header @virtual-scroll="onScroll" v-if="q.screen.lt.md">
			<template v-slot:body="props">
			<q-tr :props="props">
				<q-td style="cursor:pointer" key="tipo" :props="props">
					<div class="row">
						<div class="column col-xs-5"><span class="text-teal-10 text-caption"><b>F/Emisión</b></span></div>
						<div class="column col-xs-5"><span class="text-caption">{{ props.row.fecha_txt }}</span></div>
					</div>
					<div class="row">
						<div class="column col-xs-5"><span class="text-teal-10 text-caption"><b>Comprobante</b></span></div>
						<div class="column col-xs-5"><span class="text-caption">{{ props.rowIndex }} - {{getNombreDocumento(props.row.tipo)}} {{props.row.numero_comprobante}}</span></div>
					</div>
					<div class="row">
						<div class="column col-xs-5"><span class="text-teal-10 text-caption"><b>Descargas</b></span></div>
						<q-icon name="mdi-xml" size="sm" color="blue" @click="downloadXML(props.row)"/>
						<q-btn color="white" text-color="white" style="width:10px" flat/>
						<q-icon name="mdi-pdf-box" size="sm" color="red" @click="downloadPDF(props.row)"/>
					</div>
					<div class="row">
						<div class="column col-xs-5"><span class="text-teal-10 text-caption"><b>Monto</b></span></div>
						<div class="column col-xs-5"><span class="text-caption">{{props.row.monto}}</span></div>
					</div>
					<div class="row">
						<div class="column col-xs-5"><span class="text-teal-10 text-caption"><b>Emisor</b></span></div>
						<div class="column col-xs-5"><span class="text-caption"> {{ props.row.nombre_comercial_proveedor }}</span></div>
					</div>
					<div class="row">
						<div class="column col-xs-5"><span class="text-teal-10 text-caption"><b>Clave de Acceso</b></span></div>
						<div class="column col-xs-5"><span class="text-caption"> {{ props.row.clave_acceso }}</span></div>
					</div>
				</q-td>
			</q-tr>
			</template>
		</q-table>

		<q-table ref="virtualListRef" virtual-scroll :v-model:pagination="pagination" :rows-per-page-options="[0]" :virtual-scroll-item-size="48" :virtual-scroll-sticky-start="48" :columns="columnas_desktop"
			no-data-label="No hay datos disponibles" :rows="lista" row-key="codigo_documento" class="my-sticky-header-column-table-admin" style="height:calc(100vh - 139px);max-width:100vw"
			hide-bottom @virtual-scroll="onScroll" v-if="q.screen.gt.sm">

			<template v-slot:body-cell-xml="props">
        		<q-td style="cursor:pointer" @click="downloadXML(props.row)" key="xml" :props="props">
					<q-icon name="mdi-xml" size="sm" color="blue" />
				</q-td>
      		</template>
			<template v-slot:body-cell-pdf="props">
				<q-td style="cursor:pointer" @click="downloadPDF(props.row)" key="pdf" :props="props">
					<q-icon name="mdi-pdf-box" size="sm" color="red" />
				</q-td>
			</template>

		</q-table>
		<template v-slot:footer>
			<div class="row bg-admin_list-footer q-pt-sm shadow-up-6 justify-center items-center" style="height:40px">
				<span class="text-teal-10 text-caption">
					{{ registros }} Comprobantes (s) - {{ page }} de {{ pagesCount }}
				</span>
				<div style="width:20px"></div>
				<q-spinner-dots color="blue" size="2em" v-if="progress"/>
			</div>
		</template>
	</form-admin-layout>
</template>

<script setup>

import { nextTick, ref, onMounted, onUnmounted, computed } from 'vue';
import { useQuasar } from 'quasar';

import FormAdminLayout from "src/components/FormAdminLayout.vue";

import { useAppStore } from 'src/stores/useAppStore';
import { useAxios } from 'src/services/useAxios';
import { useMensajes } from 'src/services/useMensajes';
import { useVirtualPaginator } from 'src/services/useVirtualPaginator';


	const q        = useQuasar();
	const appStore = useAppStore();
    const enabled  = ref(true);
    const desde    = ref(new Date().toISOString().substr(0, 10));
    const hasta    = ref(new Date().toISOString().substr(0, 10));
    const menu1    = ref(false);
    const menu2    = ref(false);
    const tipo     = ref({value:'00',label:'TODOS'});
    const tipos    = [
    	{value:'01',label:'FACTURA'},
      	{value:'04',label:'NOTA DE CREDITO'},
      	{value:'05',label:'NOTA DE DEBITO'},
      	{value:'06',label:'GUIA DE REMISION'},
      	{value:'07',label:'RETENCION'},
      	{value:'00',label:'TODOS'},
    ];
	const columnas_movil = [
		{name:'tipo', label:'Listado de Comprobantes', field:'tipo', sortable:true, align:'left', style:'width: 100px'}
	];
	const columnas_desktop = [
        {name:'fecha_txt', label:'F/Emisión', field:'fecha_txt', sortable:true, align:'left', style:'width: 100px',},
        {name:'tipo', label:'Comprobante', field:'tipo', sortable:true, align:'left', style: 'width: 100px', format: (val, row) => `${getNombreDocumento(val)}`,},
        {name:'numero_comprobante', label:'Comprobante', field:'numero_comprobante', sortable:true, align:'left', style: 'width: 100px'},
        {name:'xml', label:'XML', field:'xml', sortable:true, align:'left', style: 'width: 50px'},
        {name:'pdf', label:'RIDE', field:'pdf', sortable:true, align:'left', style: 'width: 50px'},
        {name:'monto', label:'Monto', field:'monto', sortable:true, align:'right', style: 'width: 75px'},
        {name:'nombre_comercial_proveedor', label:'Emisor', field:'nombre_comercial_proveedor', sortable:true, align:'left', style:'width: 100px',},
        {name:'clave_acceso', label:'Clave de Acceso', field:'clave_acceso', sortable:true, align:'left', style: 'width: 250px'},
	];
    const pagination         = {rowsPerPage: 0};
	const virtualListRef     = ref(null);
	const registros          = ref(0);
	const { post }           = useAxios();
	const { mostrarMensaje } = useMensajes();
	const { token, page, pagesCount, lastId, lista, progress, onScroll, setFn_list, resetPaginator, updatePaginator } = useVirtualPaginator();

	onMounted(() => {
		lista.value = appStore.getDocumentosElectronicos;
		setFn_list(listar);
	});

	onUnmounted(() => appStore.setDocumentosElectronicos(lista.value));

	const getStyle      = computed(() => q.screen.xs ? "height:40px;width:100%;font-size:13px" : "height:40px;width:120px;font-size:13px");
    const getStyle_1    = computed(() => q.screen.xs ? "height:40px;width:100%;font-size:12px" : "height:40px;width:100%;font-size:12px");

    const downloadXML = (item) => {
    	let fileName = getFileName(item) + '.xml';
      	var element = document.createElement('a');
		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(atob(item.xml)));
		element.setAttribute('download', fileName);
		element.style.display = 'none';
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
    }

    const downloadPDF = (item) => {
    	const fileName = getFileName(item) + '.pdf';
      	var element = document.createElement('a');
      	element.setAttribute('href', `${appStore.getURLApi}/api/documentos/download_ride_pkey?codigo_documento=${item.codigo_documento}`);
		element.setAttribute('download', fileName);
		element.style.display = 'none';
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
    }

    const listar = async (resetear) => {
		if(resetear){
			resetPaginator();
		}
		const posIni = lista.value.length - 1;
		progress.value = true;
		const respuesta = await post('/api/documentos/recuperar', {}, JSON.stringify(
			{
				ruc_ci:appStore.getUsuarioActivo.ruc_ci,
				clave:appStore.getUsuarioActivo.contrasena,
				tipo:tipo.value.value,desde:desde.value,
				hasta:hasta.value,
				token:token.value,
    			page:page.value,
				pagesCount:pagesCount.value,
    			lastId:lastId.value
			}
		));
		progress.value = false;
		if(respuesta.mensaje.length > 0){
			mostrarMensaje('Error', respuesta.mensaje);
			return;
		}
		registros.value = respuesta.info.page > 1 ? registros.value : respuesta.registros;
		updatePaginator(respuesta.info);
		nextTick(() => {
            if(virtualListRef.value !== null){
                virtualListRef.value.scrollTo(posIni, 'start-force');
            }
    	});
    }

    const getNombreDocumento = (tipo) => {
        if(tipo === "01"){
            return "Factura";
        }
        if(tipo === "04"){
            return "N. Crédito";
        }
        if(tipo === "05"){
            return "N. Débito";
        }
        if(tipo === "06"){
            return "Guía";
        }
        if(tipo === "07"){
            return "Retención";
        }
        return "NA";
    }

    const getFileName = (item) => {
        if(item.tipo === "01"){
            return `FACTURA_${item.numero_comprobante}_${item.clave_acceso}`;
        }
        if(item.tipo === "04"){
            return `NCREDITO_${item.numero_comprobante}_${item.clave_acceso}`;
        }
        if(item.tipo === "05"){
            return `NDEBITO_${item.numero_comprobante}_${item.clave_acceso}`;
        }
        if(item.tipo === "06"){
            return `GUIA_${item.numero_comprobante}_${item.clave_acceso}`;
        }
        if(item.tipo === "07"){
            return `RETENCION_${item.numero_comprobante}_${item.clave_acceso}`;
        }
        return "S/N";
    }

</script>

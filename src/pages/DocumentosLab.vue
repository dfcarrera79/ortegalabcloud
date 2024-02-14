<template>
	<form-admin-layout>
	<!-- Todo el contenedor de la pagina   -->
		<template v-slot:header>
  			<div class="row">
    			<div class="column col-xs-6 col-sm-3 q-pa-xs ">
      				<q-input outlined dense v-model="desde" label="Desde" type="date" style="font-size:13px"/>
    			</div>
    			<div class="column col-xs-6 col-sm-3 q-pa-xs">
      				<q-input outlined dense v-model="hasta" label="Hasta" type="date" style="font-size:13px"/>
    			</div>
    			<div class="column col-xs-12 col-sm-2 q-pa-xs">
      				<q-btn color="secondary" icon="search" @click="listar(true)" label="Listar" :style="getStyle"/>
    			</div>
  			</div>
		</template>

		<q-table ref="virtualListRef" virtual-scroll :v-model:pagination="pagination" :rows-per-page-options="[0]" :virtual-scroll-sticky-start="48" :columns="columnas"
    			no-data-label="No hay datos disponibles" :rows="lista" row-key="codigo_documento" class="my-sticky-header-column-table-admin" style="height:calc(100vh - 139px);max-width:100vw" hide-bottom @virtual-scroll="onScroll">
    		<template v-slot:body="props">
      			<q-tr :props="props">
        		<q-td style="cursor:pointer" key="fecha_emision" :props="props" v-if="movil">
          			<div class="row">
            			<div class="column col-xs-5"><span class="text-teal-10 text-caption"><b>F/Emisión</b></span></div>
            			<div class="column col-xs-5"><span class="text-caption">{{ props.row.fecha_emision }}</span></div>
          			</div>
          			<div class="row">
            			<div class="column col-xs-5"><span class="text-teal-10 text-caption"><b>Exámen</b></span></div>
            			<div class="column col-xs-5"><span class="text-caption">{{props.row.nombre_examen}}</span></div>
          			</div>
          			<div class="row">
            			<div class="column col-xs-5"><span class="text-teal-10 text-caption"><b>No. Exámen</b></span></div>
            			<div class="column col-xs-5"><span class="text-caption">{{props.row.numero_examen}}</span></div>
          			</div>
          			<div class="row">
            			<div class="column col-xs-5"><span class="text-teal-10 text-caption"><b>Descarga</b></span>	</div>
            			<q-btn color="white" text-color="white" style="width:10px" flat/>
            			<q-icon name="mdi-pdf-box" size="sm" color="red" @click="downloadPDF(props.row)"/>
          			</div>
          			<div class="row">
            			<div class="column col-xs-5"><span class="text-teal-10 text-caption"><b>Paciente</b></span></div>
            			<div class="column col-xs-5"><span class="text-caption">{{props.row.nombre_paciente}}</span></div>
          			</div>
          			<div class="row">
            			<div class="column col-xs-5"><span class="text-teal-10 text-caption"><b>Solicita</b></span></div>
            			<div class="column col-xs-5"><span class="text-caption"> {{ props.row.solicitante }}</span></div>
          			</div>
        		</q-td>
        		<q-td style="cursor:pointer" v-if="!movil" key="fecha_emision" :props="props"><span class="text-caption">{{ props.row.fecha_emision }}</span></q-td>
        		<q-td style="cursor:pointer" v-if="!movil" key="nombre_examen" :props="props"><span class="text-caption">{{ props.row.nombre_examen }}</span></q-td>
        		<q-td style="cursor:pointer" v-if="!movil" key="numero_examen" :props="props"><span class="text-caption">{{ props.row.numero_examen }}</span></q-td>
        		<q-td style="cursor:pointer;width:75px" v-if="!movil" @click="downloadPDF(props.row)" key="pdf" :props="props">
          			<q-icon name="mdi-pdf-box" size="sm" color="red" />
        		</q-td>
        		<q-td style="cursor:pointer" v-if="!movil" key="nombre_paciente" :props="props"><span class="text-caption">{{ props.row.nombre_paciente }}</span></q-td>
        		<q-td style="cursor:pointer" v-if="!movil" key="solicitante" :props="props">
          			<span class="text-caption" style="width:200px;max-width:200px;min-width:200px">{{ props.row.solicitante }}</span>
        		</q-td>
      			</q-tr>
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

	const appStore   = useAppStore();
	const q          = useQuasar();
	const movil      = ref(false);
    const enabled    = ref(true);
	const desde      = ref(new Date().toISOString().substr(0, 10));
    const hasta      = ref(new Date().toISOString().substr(0, 10));
    const menu1      = ref(false);
    const menu2      = ref(false);
    const registros   = ref(0);
    const pagination = {rowsPerPage: 0};
	const { post }   = useAxios();
	const { mostrarMensaje} = useMensajes();
	const { token, page, pagesCount, lastId, lista, progress, onScroll, setFn_list, resetPaginator, updatePaginator } = useVirtualPaginator();

	onMounted(() => {
		lista.value = appStore.getDocumentosLaboratorio
		setFn_list(listar);
	});
	onUnmounted(() => appStore.setDocumentosLaboratorio(lista.value));

    const getStyle = computed(() => movil.value ? "height:40px;width:100%;font-size:13px" : "height:40px;width:120px;font-size:13px");
	const getStyle_1 = computed(() => movil.value ? "height:40px;width:100%;font-size:12px" : "height:40px;width:100%;font-size:12px");
    const columnas = computed(() => {
        if(q.screen.xs){
            movil.value = true;
            return [
				{name:'fecha_emision', label:'Listado de Exámenes', field:'fecha_emision', sortable:true, align:'left', style:'width: 100px'}
			];
        }else{
            movil.value = false;
            return [
            	{name:'fecha_emision', label:'F/Emisión', field:'fecha_emision', sortable:true, align:'left', style:'width: 100px',},
            	{name:'nombre_examen', label:'Exámen', field:'nombre_examen', sortable:true, align:'left', style: 'width: 100px'},
            	{name:'numero_examen', label:'No. Exámen', field:'numero_examen', sortable:true, align:'left', style: 'width: 100px'},
            	{name:'pdf', label:'Descargar', field:'pdf', sortable:true, align:'left', style: 'width: 250px'},
            	{name:'nombre_paciente', label:'Paciente', field:'nombre_paciente', sortable:true, align:'left', style: 'width: 250px'},
            	{name:'solicitante', label:'Solicita', field:'solicitante', sortable:true, align:'left', style:'width: 100px',},
            ];
        }
    });

    const downloadPDF = (item) => {
      	let fileName = getFileName(item) + '.pdf';
      	var element = document.createElement('a');
      	element.setAttribute('href', `${appStore.getURLApi}/api/documentos/download_doclab_pkey?codigo_documento=${item.codigo_documento}`);
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
        const respuesta = await post('/api/documentos/recuperar_codlab', {}, {
			ruc_ci:appStore.getUsuarioActivo.ruc_ci,
			clave:appStore.getUsuarioActivo.contrasena,
			tipo:'00',
			desde:desde.value,
			hasta:hasta.value,
			token:token.value,
    		page:page.value,
			pagesCount:pagesCount.value,
    		lastId:lastId.value
		});
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

    const getFileName = (item) => item.nombre_examen + '_' + item.numero_examen + '_' + item.codigo_perfil;

</script>

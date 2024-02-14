import { axios } from 'src/boot/axios';
import { deducirMensajeError } from 'src/utils/AppUtils';
import { useAppStore } from "src/stores/useAppStore";

export function useAxios () {
    const appStore = useAppStore();

    const get = async (url, params) => {
        try{
			const promesa = await axios({
				method: 'GET',
                url: `${appStore.getURLApi}${url}`,
                params,
                headers: appStore.getHttpHeaders,
			});
            const data = await promesa.data;
            return data;
        }catch(error){
            return {
                error:'S',
                mensaje:deducirMensajeError(error),
                data:[]
            };
        }
    }

    const post = async (url, params, jsonData) => {
        try{
			const promesa = await axios({
				method: 'POST',
                url: `${appStore.getURLApi}${url}`,
                params,
                data:jsonData,
                headers: appStore.postHttpHeaders,
                json: true
			});
            const data = await promesa.data;
            return data;
        }catch(error){
            return {
                error:'S',
                mensaje:deducirMensajeError(error),
                data:[]
            };
        }
    }

    const postMultipart = async (url, params, formData) => {
        try{
			const promesa = await axios({
				method: 'POST',
                url: `${appStore.getURLApi}${url}`,
                params,
                data:formData,
                headers: appStore.postHttpHeadersMultipart,
                json: true
			});
            const data = await promesa.data;
            return data;
        }catch(error){
            return {
                error:'S',
                mensaje:deducirMensajeError(error),
                data:[]
            };
        }
    }

    const deletes = async (url, params, jsonData) => {
        try{
			const promesa = await axios({
				method: 'DELETE',
                url: `${appStore.getURLApi}${url}`,
                params,
                data:jsonData,
                headers: appStore.postHttpHeaders,
                json: true
			});
            const data = await promesa.data;
            return data;
        }catch(error){
            return {
                error:'S',
                mensaje:deducirMensajeError(error),
                data:[]
            };
        }
    }


    return {
        get, post, postMultipart, deletes
    }
}

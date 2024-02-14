export function numberFormat(value, decimals, decimal_sep, thousands_sep){
    let n = value;
    let c = isNaN(decimals) ? 2 : Math.abs(decimals);
    let d = decimal_sep || '.';

    let t = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep

    let sign = (n < 0) ? '-' : '';

    let i = parseInt(n = Math.abs(n).toFixed(c)) + '';
    let j = i.length;
    j = (j > 3) ? j % 3 : 0;
    return sign + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : '');
}

export function soloNumeros(valor) {
    return !/^([0-9])*$/.test(valor);
}

export function esNumero(valor) {
    return /^([0-9])*$/.test(valor);
}

export function replaceAll(texto, ocurrencia, reemplazo) {
    return texto.replace(new RegExp(ocurrencia, "g"), reemplazo);
}

export function formatDate(date) {
    if (!date) return null;

    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
}

export function toISOString(date){
    const respuesta = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().substring(0, 10);
    return respuesta;
}

export function toISOString_(date){
    const respuesta = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().substring(0, 19);
    return respuesta.replace('T', ' ');
}

export function dateToSQL(date) {
	if(date === undefined){
		return '2000-01-01';
	}
	if(date === null){
		return '2000-01-01';
	}
    const separator = date.indexOf("/") > -1 ? '/' : '-';
    let [year, month, day] = date.split(separator);
    let mes = month.padStart(2, '0');
    let dia = day.padStart(2, '0');
    return `${year}-${mes}-${dia}`;
}

export function getDateToSQL() {
    let ts = Date.now();
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    return year + "-" + month + "-" + date;
}

export function getDateTime() {
    let ts = Date.now();
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    let hour = date_obj.getHours();
    let minutes = date_obj.getMinutes();
    let seconds = date_obj.getSeconds();
    return new Date(year + "-" + month + "-" + date + " " + hour + ":" + minutes + ":" + seconds);
}

export function getFirstDate() {
    let ts = Date.now();
    let date_ob = new Date(ts);
    let date = 1;
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    return new Date(year + "-" + month + "-" + date);
}

export function removeObjectFromArray(arrayObj, key, value){
    let index = -1;
    for(let i = 0; i < arrayObj.length; i++){
        const obj = arrayObj[i];
        if(obj[key] === value){
            index = i;
            break;
        }
    }
    if(index > -1 ){
        arrayObj.splice(index, 1);
        return true;
    }
    return false;
}

export function deducirMensajeError(o_error){
    let mensaje = '';
    let hubo = false;
    if(o_error.message){
        mensaje = o_error.message === 'Network Error' ? 'La aplicación no logra conectarse con el servidor, revise si su dispositivo esta con internet o si el servidor esta disponible.' : o_error.message;
        hubo = true;
    }
    if(o_error.config){
        if(o_error.config.url){
            mensaje = mensaje + "<br><span style='color:red'>" + o_error.config.url + "</span>";
            hubo = true;
        }
    }
    if(hubo === false){
        mensaje = JSON.stringify(o_error);
    }
    return mensaje;
}

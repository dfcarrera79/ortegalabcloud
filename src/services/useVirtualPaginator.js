import { ref, watch } from 'vue';

export function useVirtualPaginator () {
    let fn_list       = null;
    const token       = ref('');
	const page        = ref(0);
	const pagesCount  = ref(0);
	const lastId      = ref(0);
    const lista       = ref([]);
    const progress    = ref(false);
    const listenWatch = ref(true);

    const onScroll  = ({ to, ref }) => {
        const lastIndex = lista.value.length - 1;
        if (progress.value === false && page.value < pagesCount.value && to === lastIndex) {
            page.value++;
        }
    }

	watch(page, async (newValue, oldValue) => {
		if(page.value > 1 && listenWatch.value){
			await fn_list(false);
		}
	});

    const setFn_list = (fn) => fn_list = fn;

    const resetPaginator = () => {
		token.value      = '';
		page.value       = 0;
		pagesCount.value = 0;
		lastId.value     = 0;
		lista.value      = [];
    }

    const updatePaginator = (infoPaginator) => {
		token.value      = infoPaginator.token;
		page.value       = infoPaginator.page;
		pagesCount.value = infoPaginator.pagesCount;
		lastId.value     = infoPaginator.lastId;
		lista.value.push(...infoPaginator.data);
    }

    return {
        token, page, pagesCount, lastId, lista, progress, listenWatch, onScroll, setFn_list, resetPaginator, updatePaginator
    }
}

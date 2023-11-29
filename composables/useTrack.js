import { useModalManager } from "~/store/modalManager";

import AddKeywordUIModal from '~/components/track/AddKeywordUI.vue'
import { useTrackStore } from "~/store/track";

export default function () {

    const { modalManager } = storeToRefs(useModalManager());
    const { addKeyword } = useTrackStore();
    // const { sites } = storeToRefs(useTrackStore());

    const addKeywordUI = (url = '', callback) => {
        let modal = modalManager.value.createModal({
            title: 'Add New Keyword',
            description: 'Enter your keyword and the website',
            component: AddKeywordUIModal,
            props: {
                url: url || '',
                keyword: ''
            }
        });

        modal.onClose((success, data) => {
            if(success) callback(data);
        });

    }

    const getKeywords = async (params = {}, callback) => {
        let query = new URLSearchParams(params).toString();
        const { data, error } = await useFetch(`/api/track/keywords?${query}`);
        if(error.value) {
            if(callback && typeof callback === 'function') callback(true, error.value.data);
        } else if(data.value) {
            if(callback && typeof callback === 'function') callback(false, data.value);
        }
    }

    const getAvailableFilters = async () => {
        return await useFetch(`/api/track/filters`, { watch: false });
    }

    const removeKeyword = async (keywordId, callback) => {
        let confirmed = await modalManager.value.showConfirm('Do you really wish to remove this keyword?');
        if(!confirmed) return;
        const { data, error } = await useFetch(`/api/track/keywords`, { method: 'DELETE', body: { _id: keywordId }, watch: false }); 
        if(error.value) {
            if(callback && typeof callback === 'function') callback(true, error.value.data);
        } else if(data.value) {
            if(callback && typeof callback === 'function') callback(false, data.value);
        }
    }

    const getDashboardStats = async (params = {}, callback) => {
        let query = new URLSearchParams(params).toString();
        const { data, error } = await useFetch(`/api/track/stats?${query}`);
        if(error.value) {
            if(callback && typeof callback === 'function') callback(true, error.value.data);
        } else if(data.value) {
            if(callback && typeof callback === 'function') callback(false, data.value);
        }
    }

    return {
        addKeyword,
        addKeywordUI,
        getKeywords,
        getAvailableFilters,
        removeKeyword,
        getDashboardStats
    }

}
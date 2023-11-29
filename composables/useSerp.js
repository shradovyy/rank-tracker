import { useModalManager } from "~/store/modalManager";

import AddApiKeyModal from '~/components/serp/AddApiKey.vue'
import { useSerpStore } from "~/store/serp";

export default function () {

    const { modalManager } = storeToRefs(useModalManager());
    const { keys } = storeToRefs(useSerpStore());
    const { getApiKeys, addApiKey, removeApiKey } = useSerpStore();

    const addSerpApiKeyUI = () => {
        let modal = modalManager.value.createModal({
            title: 'Add SERP API Key',
            description: 'Enter your SERP API Key',
            component: AddApiKeyModal
        });
    }

    const removeApiKeyUI = async (id) => {
        let confirmed = await modalManager.value.showConfirm('Do you really wish to remove this API Key?');
        if(!confirmed) return;
        await removeApiKey(id);
    }

    return {
        addSerpApiKeyUI,
        keys,
        getApiKeys,
        addApiKey,
        removeApiKeyUI
    }

}
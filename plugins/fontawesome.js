import { library, config } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
    faMagnifyingGlass,
    faHandHoldingDollar,
    faFileSignature,
    faCommentsDollar,
    faHouseCircleCheck,
    faFileInvoiceDollar,
    faUserGroup,
    faDatabase,
    faAngleDown,
    faArrowUp,
    faCheck,
    faArrowRight,
    faFileImport,
    faSignature,
    faRoad,
    faChevronDown,
    faChevronUp,
    faXmark,
    faPhone,
    faCircleQuestion,
    faEye,
    faLink,
    faEllipsisVertical,
    faRotateRight,
    faArrowDown
} from '@fortawesome/free-solid-svg-icons'

library.add(faMagnifyingGlass, faHandHoldingDollar, faFileSignature);
library.add(faCommentsDollar, faHouseCircleCheck, faFileInvoiceDollar, faUserGroup, faDatabase, faAngleDown, faArrowUp, faArrowDown, faEllipsisVertical, faRotateRight);
library.add(faCheck, faArrowRight, faFileImport, faSignature, faRoad, faChevronDown, faChevronUp, faXmark, faPhone, faCircleQuestion, faEye, faLink);


// This is important, we are going to let Nuxt worry about the CSS
config.autoAddCss = false

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component('fa', FontAwesomeIcon, {})
})
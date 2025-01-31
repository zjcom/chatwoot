/* eslint no-console: 0 */
/* eslint-env browser */
/* eslint-disable no-new */
/* Vue Core */

import Vue from 'vue';
import VueI18n from 'vue-i18n';
import VueRouter from 'vue-router';
import axios from 'axios';
// Global Components
import hljs from 'highlight.js';
import Multiselect from 'vue-multiselect';
import WootSwitch from 'components/ui/Switch';
import WootWizard from 'components/ui/Wizard';
import WootButton from 'components/ui/WootButton';
import { sync } from 'vuex-router-sync';
import Vuelidate from 'vuelidate';
import VTooltip from 'v-tooltip';
import WootUiKit from '../dashboard/components';
import App from '../dashboard/App';
import i18n from '../dashboard/i18n';
import createAxios from '../dashboard/helper/APIHelper';
import commonHelpers from '../dashboard/helper/commons';
import { getAlertAudio } from '../shared/helpers/AudioNotificationHelper';
import router from '../dashboard/routes';
import store from '../dashboard/store';
import vueActionCable from '../dashboard/helper/actionCable';
import constants from '../dashboard/constants';
import {
  verifyServiceWorkerExistence,
  registerSubscription,
} from '../dashboard/helper/pushHelper';
import * as Sentry from '@sentry/vue';
import 'vue-easytable/libs/theme-default/index.css';

Vue.config.env = process.env;

if (window.errorLoggingConfig) {
  Sentry.init({ Vue: Vue, dsn: window.errorLoggingConfig });
}

Vue.use(VueRouter);
Vue.use(VueI18n);
Vue.use(WootUiKit);
Vue.use(Vuelidate);
Vue.use(VTooltip);
Vue.use(hljs.vuePlugin);

Vue.component('multiselect', Multiselect);
Vue.component('woot-switch', WootSwitch);
Vue.component('woot-wizard', WootWizard);
Vue.component('woot-button', WootButton);

const i18nConfig = new VueI18n({
  locale: 'en',
  messages: i18n,
});

sync(store, router);
// load common helpers into js
commonHelpers();

window.WootConstants = constants;
window.axios = createAxios(axios);
window.bus = new Vue();
window.onload = () => {
  window.WOOT = new Vue({
    router,
    store,
    i18n: i18nConfig,
    components: { App },
    template: '<App/>',
  }).$mount('#app');
  vueActionCable.init();
};
window.addEventListener('load', () => {
  verifyServiceWorkerExistence(registration =>
    registration.pushManager.getSubscription().then(subscription => {
      if (subscription) {
        registerSubscription();
      }
    })
  );
  getAlertAudio();
});

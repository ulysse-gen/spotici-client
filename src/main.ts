import { createApp } from 'vue';
import App from './App.vue';
import store from './store';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import VueCookies from 'vue-cookies';

import { faHouse, faMagnifyingGlass, faPlay, faRotate, faCompactDisc, faBackwardStep, faForwardStep, faPause, faRepeat, faShuffle } from '@fortawesome/free-solid-svg-icons';
library.add(faHouse, faMagnifyingGlass, faPlay, faPause, faRotate, faCompactDisc, faBackwardStep, faForwardStep,  faRepeat, faShuffle);

createApp(App).use(store).component('font-awesome-icon', FontAwesomeIcon).use(VueCookies).mount('#app');

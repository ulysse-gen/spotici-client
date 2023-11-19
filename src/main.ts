import { createApp } from 'vue';
import App from './App.vue';
import store from './store';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import VueCookies from 'vue-cookies';

import { faHouse, faMagnifyingGlass, faPlay, faRotate, faCompactDisc, faBackwardStep, faForwardStep, faPause, faRepeat, faShuffle, faVolumeXmark, faVolumeLow, faVolumeHigh, faVolumeOff, faBars } from '@fortawesome/free-solid-svg-icons';
import router from './router'
library.add(faHouse, faMagnifyingGlass, faPlay, faPause, faRotate, faCompactDisc, faBackwardStep, faForwardStep,  faRepeat, faShuffle, faVolumeXmark, faVolumeLow, faVolumeHigh, faVolumeOff, faBars);

createApp(App).use(router).use(router).use(store).component('font-awesome-icon', FontAwesomeIcon).use(VueCookies).mount('#app');

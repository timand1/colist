import { createApp } from 'vue'
import './style.scss'
import router from './router'
import App from './App.vue'
import { FirebasePlugin } from './firebase'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlus, faTrashCan } from  '@fortawesome/free-solid-svg-icons';
library.add( faPlus, faTrashCan )

createApp(App)
  .use(router)
  .use(FirebasePlugin)
  .mount('#app')
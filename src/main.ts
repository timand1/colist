import { createApp } from 'vue'
import './style.scss'
import router from './router'
import App from './App.vue'
import { FirebasePlugin } from './firebase'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlus, faTrashCan, faChevronDown, faCheck, faXmark, faPen, faCircleUser, faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { faApple, faFacebookF, faGithub, faGoogle } from '@fortawesome/free-brands-svg-icons';
library.add( faPlus, faTrashCan, faChevronDown, faCheck, faXmark, faPen, faCircleUser, faSun, faMoon, faApple, faFacebookF, faGithub, faGoogle )

createApp(App)
  .use(router)
  .use(FirebasePlugin)
  .mount('#app')
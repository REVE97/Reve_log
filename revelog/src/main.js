import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { initializeTheme } from './lib/theme'

// 다크 모드
const disposeTheme = initializeTheme()

if (import.meta.hot) {
  import.meta.hot.dispose(disposeTheme)
}
//

const app = createApp(App)

app.use(router)

app.mount('#app')

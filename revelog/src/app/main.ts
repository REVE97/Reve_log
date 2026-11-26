import { createApp } from 'vue'
import './styles/style.css'
import App from './App.vue'
import router from './router'
import { initializeTheme } from '@/features/toggle-theme'

// 다크 모드
const disposeTheme = initializeTheme()

if (import.meta.hot) {
  import.meta.hot.dispose(disposeTheme)
}
//

const app = createApp(App)

app.use(router)

app.mount('#app')

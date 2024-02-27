import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'

const myCustomTheme = {
    dark: true,
    colors: {
        background: '#44403C'
    }
}

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    theme: false
    // theme: {
    //     defaultTheme: myCustomTheme,
    //     themes: {
    //         myCustomTheme,
    //       },
    // }
  })
  app.vueApp.use(vuetify)
})
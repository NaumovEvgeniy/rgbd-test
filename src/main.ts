import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false
Vue.config.errorHandler = (err, vm, info) => {
	alert(err)
	console.error(err, vm, info)
}

new Vue({
  render: h => h(App),
}).$mount('#app')

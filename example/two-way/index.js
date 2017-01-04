import angular from 'angular'
import HelloComponent from './hello.vue'

angular.module('vue.components', ['via'])
  .controller('MainController', function () {
    this.person = {
      firstName: 'The',
      lastName: 'World',
      description: `ngVue helps you use Vue components in your angular application 
        so that you are able to create a faster and reactive web interfaces.`
    }
  })
  .value('HelloComponent', HelloComponent)

<template>
  <div class="card blue-grey darken-1">
    <div class="card-content white-text">
      <!-- <input type="text" v-model="VIA_TW_lastName" /> -->
      <input type="text" v-model="firstName" />
      <input type="text" v-model="via$lastName" />
      <p>{{this.description}}</p>
    </div>
    <div class="card-action">
      <a href="https://vuejs.org/guide/overview.html">Vue.js</a>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import twoWay from '../../src/mixins/two-way'

export default Vue.component('hello-component',  {
  mixins: [twoWay],
  props: {
    firstName: String,
    lastName: {
      type: [String],
      propSync: true
    },
    description: String
  }
  // created: function () {
  //   console.log('created')
  //   this.$watch('lastName', (newVal, oldVal) => {
  //     console.log('lastName', newVal)
  //     this['via$lastName'] = newVal
  //   }, {})
  //   this.$watch('via$lastName', (newVal, oldVal) => {
  //     console.log('via$lastName', newVal)
  //     this.$emit('viaPropsChange', 'lastName', newVal, oldVal)
  //   }, {})
  // }
  // data () {
  //   return {
  //     VIA_TW_lastName: this.lastName
  //   }
  // },
  // watch: {
  //   lastName (val) {
  //     this.VIA_TW_lastName = val
  //   },
  //   VIA_TW_lastName (val) {
  //     this.$emit('input', val)
  //   }
  // },
  // methods: {
  //   handleInput (e) {
  //     let val = e.target.value
  //     this.VIA_TW_lastName = val
  //   }
  // }
})
</script>

<style scoped>
  .aaa {
    color: red;
  }
</style>

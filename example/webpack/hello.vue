<style scoped>
  .aaa {
    color: red;
  }
</style>

<script>
import Vue from 'vue'

export default {
  props: {
    firstName: String,
    lastName: String,
    description: String
  },
  render (h) {
    return (
      <div class="card blue-grey darken-1">
        <div class="card-content white-text">
          <span class="card-title aaa">Hi, {this.firstName} {this.lastName}</span>
          <p>{this.description}</p>
        </div>
        <div class="card-action">
          <a href="https://vuejs.org/guide/overview.html">Vue.js</a>
        </div>
      </div>
    )
  }
}
</script>

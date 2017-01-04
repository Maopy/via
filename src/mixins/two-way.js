const emitFuncName = 'viaPropsChange'
const isEnableName = 'propSync'

const getDataName = (propName) => `via$${propName}`

export default {
  data () {
    let data = {}
    let propsKeys = Object.keys((this.$options.props) || {})

    propsKeys.forEach((prop, i) => {
      let dataName = getDataName(prop)

      if (this.$options.props[prop][isEnableName]) {
        data[dataName] = this[prop]
      }
    })
    return data
  },
  created () {
    let propsKeys = Object.keys((this.$options.props) || {})

    propsKeys.forEach((prop, i) => {
      let dataName = getDataName(prop)

      if (this.$options.props[prop][isEnableName]) {
        let propsFn = this.$watch(prop, (newVal, oldVal) => {
          this[dataName] = newVal
        }, {})
        let dataFn = this.$watch(dataName, (newVal, oldVal) => {
          this.$emit(emitFuncName, prop, newVal, oldVal)
        }, {})
      }
    })
  }
}

import angular from 'angular'
import Vue from 'vue'

let watch = (expressions) => {
  return (watchFunc) => {
    if (angular.isString(expressions)) {
      // the `vprops` / `vdata` object is reactive
      // no need to watch their changes
      return
    }

    Object.keys(expressions)
      .forEach((name) => {
        watchFunc(name, expressions[name])
      })
  }
}

let watchExpressions = (dataExprsMap, watchCallback, elAttributes, scope) => {
  const expressions = dataExprsMap.props ? dataExprsMap.props : dataExprsMap.data

  if (!expressions) {
    return
  }

  const depth = elAttributes.watchDepth
  const watcher = watch(expressions)
  const callback = (propName, newVal) => {
    if (newVal) {
      watchCallback(propName, newVal)
    }
  }

  switch (depth) {
    case 'value':
      watcher((name, expression) => {
        scope.$watch(expression, callback.bind(null, name), true)
      })
      break
    case 'collection':
      watcher((name, expression) => {
        scope.$watchCollection(expression, callback.bind(null, name))
      })
      break
    case 'reference':
    default:
      watcher((name, expression) => {
        scope.$watch(expression, callback.bind(null, name))
      })
  }
}

let evaluateValues = (dataExprsMap, scope) => {
  const key = dataExprsMap.props ? 'props' : 'data'
  const expr = dataExprsMap[key]

  if (!expr) {
    return null
  }

  if (angular.isString(expr)) {
    return scope.$eval(expr)
  }

  const evaluatedValues = {}
  Object.keys(expr).forEach((key) => {
    evaluatedValues[key] = scope.$eval(expr[key])
  })

  return evaluatedValues
}

let getTypeOf = (value) => {
  return value.constructor.name
}

const transformers = {
  'Object': (value) => [value],
  'Array': (value) => value,
  'String': (value) => value.split(/\s*,\s*/g).filter(Boolean).map((name) => { return { name } })
}

let evaluateDirectives = (attributes, scope) => {
  const directivesExpr = attributes.vdirectives

  if (angular.isUndefined(directivesExpr)) {
    return null
  }

  const directives = scope.$eval(directivesExpr)
  const transformer = transformers[getTypeOf(directives)]

  return transformer ? transformer(directives) : null
}

let getVueComponent = (name, $injector) => {
  if (angular.isFunction(name)) {
    return name
  }
  return $injector.get(name)
}

let lowerFirst = (letter) => {
  const firstLetter = letter.charAt(0).toLowerCase()
  return firstLetter + letter.slice(1)
}

let extractExpressionName = (attrPropName, removedKey) => {
  const propName = attrPropName.slice(removedKey.length)
  return lowerFirst(propName)
}

let extractExpressions = (exprType, attributes) => {
  const objectExprKey = exprType === 'props' ? 'vprops' : 'vdata'
  const objectPropExprRegExp = exprType === 'props' ? /vprops/i : /vdata/i

  const objectExpr = attributes[objectExprKey]

  // 如果存在 vprops 或 vdata 直接返回
  if (angular.isDefined(objectExpr)) {
    return objectExpr
  }

  const expressions = Object.keys(attributes)
    .filter((attr) => objectPropExprRegExp.test(attr))

  if (expressions.length === 0) {
    return null
  }

  const exprsMap = {/* name : expression */}
  expressions.forEach((attrExprName) => {
    const exprName = extractExpressionName(attrExprName, objectExprKey)
    exprsMap[exprName] = attributes[attrExprName]
  })

  return exprsMap
}

let getExpressions = (attributes) => {
  return {
    data: extractExpressions('data', attributes),
    props: extractExpressions('props', attributes)
  }
}

let ngVueLinker = (componentName, jqElement, elAttributes, scope, $injector) => {
  const dataExprsMap = getExpressions(elAttributes)
  const Component = getVueComponent(componentName, $injector)
  const directives = evaluateDirectives(elAttributes, scope) || []
  const reactiveData = evaluateValues(dataExprsMap, scope) || {}
  const reactiveSetter = Vue.set.bind(Vue, reactiveData)
  const vueInstance = new Vue({
    data: reactiveData,
    methods: {
      handleChange (propName, val) {
        scope.$apply(() => {
          this[propName] = val
        })
      }
    },
    render (h) {
      return <Component {...{ directives }} {...{ props: reactiveData }} on-viaPropsChange={this.handleChange} />
    }
  })

  vueInstance.$mount(jqElement[0])

  watchExpressions(dataExprsMap, reactiveSetter, elAttributes, scope)

  scope.$on('$destroy', () => {
    vueInstance.$destroy(true)
  })
}

let ngVueComponentFactory = ($injector) => {
  return function (componentName, ngDirectiveConfig) {
    const config = {
      restrict: 'E',
      replace: true,
      link (scope, elem, attrs) {
        ngVueLinker(componentName, elem, attrs, scope, $injector)
      }
    }

    return angular.extend(config, ngDirectiveConfig)
  }
}

let ngVueComponentDirective = ($injector) => {
  return {
    restrict: 'E',
    replace: true,
    link (scope, elem, attrs) {
      const componentName = attrs.name
      ngVueLinker(componentName, elem, attrs, scope, $injector)
    }
  }
}

angular.module('via', [])
  .directive('via', ['$injector', ngVueComponentDirective])
  .factory('createVueComponent', ['$injector', ngVueComponentFactory])

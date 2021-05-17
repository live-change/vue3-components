import { reactive, computed, watch } from 'vue'

function createReactiveObject(...definitions) {
  let data = {}
  for(const definition of definitions) {
    if(definition.data)
      data = { ...data, ...(definition.data()) }
  }
  const object = reactive(data)

  object.$options = definitions.pop()

  for(const definition of definitions) {
    for(const key in definition.computed)
      object[key] = computed(definition.computed[key].bind(object))
  }
  for(const definition of definitions) {
    for(const key in definition.watch)
      watch(() => object[key], (n, o) => definition.watch[key].apply(object))
  }
  for(const definition of definitions)
    if(definition.beforeCreate) definition.beforeCreate.apply(object)

  for(const definition of definitions)
    if(definition.created) definition.created.apply(object)

  object.$destroy = function() {
    for(const definition of definitions)
      if(definition.beforeDestroy) definition.beforeDestroy.apply(object)
  }
  return object
}

export default createReactiveObject

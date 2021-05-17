import guid from "./utils/guid.js"
import { DaoProxy, DaoPrerenderCache, DaoCache, Path } from "@live-change/dao"
import createReactiveObject from "./utils/createReactiveObject.js"

class Api extends DaoProxy {
  constructor(source, settings = {}) {
    super()
    this.source = source
    this.settings = settings

    this.preFetchComponents = []
    this.afterPreFetch = []

    this.globalInstances = []

    this.setupCaches()
    this.setupMetadata()
  }

  setupCaches() {
    let dao = this.source
    if(this.settings.cache) {
      const cacheSettings = (typeof this.settings.cache) == 'object' ? this.settings.cache : {}
      this.dataCache = new DaoCache(dao, cacheSettings)
      dao = this.dataCache
    }
    if(this.settings.ssr) {
      this.prerenderCache = new DaoPrerenderCache(dao)
      dao = this.prerenderCache
      if(typeof window == 'undefined') {
        this.mode = 'save'
      } else {
        this.mode = 'load'
        this.prerenderCache.setCache(window[this.settings.ssrCacheGlobal || '__DAO_CACHE__'])
      }
    }
    this.setDao(dao)
  }

  setupMetadata() {
    const api = this
    api.metadata = createReactiveObject({
      reactive: {
        serviceDefinitions: ['metadata', 'serviceDefinitions'],
        version: ['version', 'version']
      },
      computed: {
        softwareVersion() {
          if(typeof window == 'undefined') return
          return window[this.settings.ssrVersionGlobal || '__VERSION__']
        },
        apiVersion() {
          return this.version
        },
        versionMismatch() {
          const software = this.softwareVersion
          const api = this.apiVersion
          if(!api) return
          if(!software) return
          return api != software
        }
      },
      reactivePreFetch() {
        return [
          { what: ['metadata', 'serviceDefinitions'] }
        ]
      },
      watch: {
        serviceDefinitions(definitions, oldDefinitions) {
          api.generateServicesApi()
        }
      }
    })
    this.preFetchComponents.push(api.metadata)
    this.afterPreFetch.push(() => api.generateServicesApi())
  }

  generateServicesApi() {
    const api = this
    let definitions = api.metadata.serviceDefinitions
    if(!definitions) {
      const cachePath = '["metadata","serviceDefinitions"]'
      if(typeof window != 'undefined') {
        const ssrCache = window[this.settings.ssrCacheGlobal || '__DAO_CACHE__']
        if(ssrCache) {
          for(const [daoPath, value] of ssrCache) {
            if(daoPath == cachePath) definitions = value
          }
        }
      } else {
        definitions = this.prerenderCache.cache.get(cachePath)
      }
    }
    if(JSON.stringify(definitions) == JSON.stringify(api.servicesApiDefinitions)) return
    if(!definitions) throw new Error("API DEFINITIONS NOT FOUND! UNABLE TO GENERATE API!")
    api.servicesApiDefinitions = definitions
    let globalViews = {}
    let globalFetch = (...args) => new Path(...args)
    let globalActions = {}
    for(const serviceDefinition of definitions) {
      let views = { }
      globalViews[serviceDefinition.name] = views
      for(const viewName in serviceDefinition.views) {
        views[viewName] = (params) => [serviceDefinition.name, viewName, params]
        views[viewName].definition = serviceDefinition.views[viewName]
      }
      let fetch = { }
      globalFetch[serviceDefinition.name] = fetch
      for(const viewName in serviceDefinition.views) {
        fetch[viewName] = (params) => new Path([serviceDefinition.name, viewName, params])
        fetch[viewName].definition = serviceDefinition.views[viewName]
      }
      let actions = { }
      globalActions[serviceDefinition.name] = actions
      for(const actionName in serviceDefinition.actions) {
        actions[actionName] = (params) => api.command([serviceDefinition.name, actionName], params)
        actions[actionName].definition = serviceDefinition.actions[actionName]
      }
    }
    api.views = globalViews
    api.fetch = globalFetch
    api.actions = globalActions
    for(let global of this.globalInstances) {
      this.installInstanceProperties(global)
    }
  }

  addGlobalInstance(globalProperties) {
    this.globalInstances.push(globalProperties)
    this.installInstanceProperties(globalProperties)
  }

  installInstanceProperties(globalProperties) {
    globalProperties.$api = this
    globalProperties.$views = this.views
    globalProperties.$actions = this.actions
  }

  async preFetch() {
    const api = this
    let preFetchPromises = []
    for(const component of this.preFetchComponents) {
      if(component.$options.reactivePreFetch) {
        const paths = component.$options.reactivePreFetch()
        const promise = api.get({ paths }).then(results => {
          for(let { what, data } of results) {
            this.prerenderCache.set(what, data)
          }
        })
        preFetchPromises.push(promise)
      }
    }
    await Promise.all(preFetchPromises)
    for(const afterPreFetch of this.afterPreFetch) {
      afterPreFetch()
    }
  }

  command(method, args) {
    const _commandId = args._commandId || guid()
    console.trace("COMMAND "+_commandId+":"+JSON.stringify(method))
    return this.request(method, { ...args, _commandId })
  }
}

export { Api }
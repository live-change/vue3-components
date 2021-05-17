import Loading from "./Loading.vue"
import LoadingZone from "./LoadingZone.vue"
import WorkingZone from "./WorkingZone.vue"
import Observe from "./Observe.vue"

export { Loading, LoadingZone, WorkingZone, Observe }

function registerLogicComponents(app) {
  app.component("loading", Loading)
  app.component("loading-zone", LoadingZone)
  app.component("working-zone", WorkingZone)
  app.component("observe", Observe)
}

export { registerLogicComponents }
export * from "./logic"
export * from "./form"
export * from "./view"

import { registerLogicComponents } from "./logic"
import { registerFormComponents } from "./form"
import { registerViewComponents } from "./view"

function registerComponents(app, settings = {}) {
  registerLogicComponents(app, settings)
  registerFormComponents(app, settings)
  registerViewComponents(app, settings)
}

export { registerComponents }

import createReactiveObject from "./utils/createReactiveObject.mjs"

export { createReactiveObject }

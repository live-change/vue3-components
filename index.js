export * from "./logic"
export * from "./form"

import { registerLogicComponents } from "./logic"
import { registerFormComponents } from "./form"

function registerComponents(app, settings = {}) {
  registerLogicComponents(app, settings)
  registerFormComponents(app, settings)
}

export { registerComponents }

import createReactiveObject from "./utils/createReactiveObject.mjs"

export { createReactiveObject }

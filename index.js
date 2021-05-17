import { Api } from "./Api.js"
export { Api }

export * from "./fields"
export * from "./logic"
export * from "./form"

import { registerFieldComponents } from "./fields"
import { registerLogicComponents } from "./logic"
import { registerFormComponents } from "./form"

function registerComponents(app, settings = {}) {
  registerLogicComponents(app, settings)
  registerFormComponents(app, settings)
  registerFieldComponents(app, settings)
}

export { registerComponents }


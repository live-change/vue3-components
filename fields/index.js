import FieldTemplate from "./FieldTemplate.vue"

export { FieldTemplate }

import BooleanField from "./BooleanField.vue"
import TextField from "./TextField.vue"
import TextAreaField from "./TextAreaField.vue"
import ListField from "./ListField.vue"
import MultiCheckboxField from "./MultiCheckboxField.vue"
import OptionsField from "./OptionsField.vue"
/*import PasswordField from "./PasswordField.vue"
import DoublePasswordField from "./DoublePasswordField.vue"*/

export { BooleanField, TextField, TextAreaField, ListField, MultiCheckboxField, OptionsField,
  /*PasswordField, DoublePasswordField*/ }

function registerFieldComponents(app, settings = {}) {
  app.component("field-template", settings.fieldTemplateComponent || FieldTemplate)

  app.component("boolean-field", BooleanField)
  app.component("text-field", TextField)
  app.component("text-area-field", TextAreaField)
  app.component("list-field", ListField)
  app.component("multi-checkbox-field", MultiCheckboxField)
  app.component("options-field", OptionsField)
/*  app.component("password-field", PasswordField)
  //app.component("double-password-field", DoublePasswordField)*/
}

export { registerFieldComponents }
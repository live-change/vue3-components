<template>
  <form-bind :name="name" v-slot="{ value, setValue, error }" class="form-field">
    <div class="checkbox-field">
      <span class="checkbox">
        <input type="checkbox" class="checkbox-input" :id="uid" :checked="value"
               @input="(ev) => setValue(ev.target.checked)" />
        <span class="checkbox-mark"></span>
      </span>
      <label class="custom-control-label" :for="uid">
        <slot name="label">{{ label }}</slot>
      </label>
    </div>
    <small class="field-error">
      {{ (errorText && errorText[error]) || i18n[error] || error }}
    </small>
  </form-bind>
</template>

<script>

  export default {
    name: "BooleanField",
    props: {
      name: {
        type: String,
        required: true
      },
      label: {
        type: String
      },
      errorText: {
        type: Object
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      uid() {
        return this._uid
      }
    }
  }

</script>

<style scoped>

</style>
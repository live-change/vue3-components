<template>
  <div :class="'form-field '+(groupClass||'')+(isRequired ? ' form-field-required' : '')">
    <label v-if="label!==''" :for="inputId">{{ label || name }}</label>
    <slot name="above"></slot>
    <slot></slot>
    <small class="field-error">
      {{ (errorText && ((typeof errorText == 'function') ? errorText(error) : errorText[error])) || error }}
    </small>
    <slot name="below"></slot>
  </div>
</template>

<script>
  export default {
    name: "FieldTemplate",
    inject: ['form'],
    props: {
      error: {
        type: String
      },
      label: {
        type: String
      },
      name: {
        type: String,
        required: true
      },
      errorText: {
        type: Object
      },
      groupClass: {
        type: String
      },
      inputId: {
        type: String
      }
    },
    data() {
      return {
        validators: []
      }
    },
    computed: {
      isRequired() {
        const validators = this.validators
        if(!validators) return false
        for(let validator of validators) {
          if(validator.isRequired && validator.isRequired({ props: this.form.getValue() })) return true
        }
        return false
      }
    },
    created() {
      this.validators = this.form.getFieldValidators(this.name)
    }
  }
</script>

<style scoped>

</style>
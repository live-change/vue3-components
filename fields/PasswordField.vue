<template>
  <form-bind :name="name" v-slot="{ value, setValue, error }" :valueFilter="n => n && n.trim()"
             class="form-field">
    <field-template :errorText="errorText" :error="error" :label="label" :name="name" :groupClass="groupClass">
      <div class="show-password-wrapper">
        <input :type="showPassword ? 'text' : 'password'" :class="'form-control '+inputClass" :id="''+_uid"
               :value="value" @input="e => setValue(e.target.value)" ref="field"
               class="{ 'is-invalid': !!error }" :placeholder="placeholder"/>
        <div class="show-password" v-if="enableTogglePassword && showPassword === false"
             @click="showPassword = true">
          <img src="/static/visibility.svg" class="show-password-icon" />
          <span class="show-password-text">{{ showPasswordText }}</span>
        </div>
        <div class="show-password" v-if="enableTogglePassword && showPassword === true"
             @click="showPassword = false">
          <img src="/static/visibility_off.svg" class="show-password-icon" />
          <span class="show-password-text">{{ hidePasswordText }}</span>
        </div>
      </div>
    </field-template>
  </form-bind>
</template>

<script>

  export default {
    name: "PasswordField",
    props: {
      name: {
        type: String,
        required: true
      },
      label: {
        type: String
      },
      placeholder: {
        type: String
      },
      errorText: {
        type: Object
      },
      inputClass: {
        type: String,
        default: ""
      },
      groupClass: {
        type: String,
        default: ""
      },
      enableTogglePassword: {
        type: Boolean,
        default: true
      },
      showPasswordText: {
        type: String,
        default: "show"
      },
      hidePasswordText: {
        type: String,
        default: "hide"
      }
    },
    data() {
      return {
        showPassword: false
      }
    },
    computed: {

    },
  }

</script>

<style scoped>

</style>
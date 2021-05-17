<template>
  <form-bind :name="name" v-slot="{ value, setValue, error, setError }"
                   :valueFilter="n => n && n.trim()" class="form-field">
    <field-template :errorText="errorText" :error="error" :label="label" :name="name" :groupClass="groupClass">
      <div class="show-password-wrapper">
        <input :type="showPassword ? 'text' : 'password'" :class="'form-control '+inputClass" :id="''+_uid"
               :value="value" @input="e => setValue(e.target.value)" ref="field"
               class="{ 'is-invalid': !!error }" :placeholder="placeholder"/>
        <div class="show-password" v-if="enableTogglePassword && showPassword === false"
             @click="showPassword = true">
          <img src="/static/visibility.svg" class="show-password-icon" />
          <span class="show-password-text">showPasswordText</span>
        </div>
        <div class="show-password" v-if="enableTogglePassword && showPassword === true"
             @click="showPassword = false">
          <img src="/static/visibility_off.svg" class="show-password-icon" />
          <span class="show-password-text">hidePasswordText</span>
        </div>

      </div>
      <div class="password-rules" v-if="passwordRules">
        <span>{{ passwordRules }}</span>
      </div>
    </field-template>


    <field-template :label="retypeLabel" :name="name" :groupClass="groupClass">
      <input :type="showPassword ? 'text' : 'password'" :class="'form-control '+inputClass" :id="'second'+_uid"
             v-model="second" ref="field2"
             class="{ 'is-invalid': !!error }" :placeholder="retypePlaceholder"/>
    </field-template>
  </form-bind>
</template>

<script>

  export default {
    name: "DoublePasswordField",
    inject: ['form'],
    props: {
      name: {
        type: String,
        required: true
      },
      label: {
        type: String
      },
      retypeLabel: {
        type: String
      },
      placeholder: {
        type: String
      },
      retypePlaceholder: {
        type: String
      },
      passwordRules: {
        type: String
      },
      errorText: {
        type: Object
      },
      showPasswordText: {
        type: String
      },
      hidePasswordText: {
        type: String
      },
      inputClass: {
        type: String
      },
      groupClass: {
        type: String
      },
      enableTogglePassword: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        showPassword: false,
        second: ''
      }
    },
    computed: {
    },
    methods: {},
    created() {
      this.validator = () => {
        let value = this.form.getFieldValue(this.name)
        console.log("PASSWORDS MATCH?", this.second, value)
        if (value != this.second.trim()) return "notMatch"
      }
      this.form.addValidator(this.name, this.validator)
    },
    beforeDestroy() {
      this.form.removeValidator(this.name, this.validator)
    }
  }

</script>

<style scoped>
  .showPasswordWrapper {
    float: right;
    margin-top: -32px;
  }

  .showPassword {
    font-size: 14px;
    color: #a730b0;
    margin-right: 5px;
  }
</style>

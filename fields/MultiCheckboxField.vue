<template>
  <form-bind :name="name" v-slot="{ value, setValue, error }" class="form-field">
    <field-template :errorText="errorText" :error="error" :label="label" :name="name" :groupClass="groupClass">
      <div v-for="(option, index) in options" class="checkbox-field form-field">
        <span class="checkbox">
          <input type="checkbox" class="checkbox-input" :id="uid+'_'+index"
                 :checked="value.includes(valueFunc(option))"
                 @input="(ev) => setValue(
                     value
                       .filter(o => o!=valueFunc(option))
                       .concat(ev.target.checked ? [valueFunc(option)] : [])
                     )" />
          <span class="checkbox-mark"></span>
        </span>
        <label class="custom-control-label" :for="uid+'_'+index">
          <slot name="label">{{ text(option) }}</slot>
        </label>
      </div>
    </field-template>
  </form-bind>
</template>

<script>

  export default {
    name: "MultiCheckboxField",
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
      groupClass: {
        type: String
      },
      options: {
        type: Array,
        required: true
      },
      text: {
        type: Function,
        default: (v) => v
      },
      valueFunc: {
        type: Function,
        default: (v) => v
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
  .checkbox-field {
    margin-top: 10px
  }
</style>
<template>
  <form-bind :name="name" v-slot="{ value, setValue, error }" :valueFilter="n => n && n.trim()"
             class="form-field">
    <field-template :errorText="errorText" :error="error" :label="label" :name="name">
      <textarea :id="''+_uid" :value="value" @input="(ev) => setValue(ev.target.value)"
                @focus="emitOpenOnFocus" @blur="emitClose"
                ref="field" :rows="rows" :placeholder="placeholder"
                class="form-control"></textarea>
      <template v-slot:below>
        <span class="field-tip" v-if="charsLeft >= 0">{{` ${i18n.characters} ${charsLeft}`}}</span>
      </template>
    </field-template>
  </form-bind>
</template>

<script>
  export default {
    name: "TextAreaField",
    inject: ['form'],
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
      rows: {
        type: Number
      }
    },
    computed: {
      i18n() { return i18n().validation },
      maxLength() {
        const validation = this.form.getFieldDefinition(this.name).validation
        return validation && validation.find(v => v.name && v.name === 'maxLength')
      },
      charsLeft() {
        if(this.maxLength) return this.maxLength.length - this.form.getFieldValue(this.name).length
        return -1
      }
    },
    methods: {
      emitOpenOnFocus() {
        this.$emit('focus')
      },
      emitClose() {
        this.$emit('blur')
      }
    }
  }

</script>

<style scoped>

</style>
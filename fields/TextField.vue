<template>
  <form-bind :name="name" v-slot="{ value, setValue, error }" :valueFilter="n => n && n.trim()"
             class="form-field">
    <field-template :errorText="errorText" :error="error" :label="label" :name="name"
                   :groupClass="groupClass" :inputId="uid">
      <template v-slot:above><slot name="above"></slot></template>
      <input :class="inputClass || ''" type="text" :id="uid" :placeholder="placeholder"
             :value="value" @input="e=>setValue(e.target.value)" ref="field" @focus="emit"
             :maxlength="(maxLength && maxLength.length) || definition.maxLength" :disabled="disabled" />
      <template v-slot:below>
        <span class="field-tip" v-if="charsLeft >= 0">{{` ${i18n.characters} ${charsLeft}`}}</span>
        <slot name="below"></slot>
      </template>
    </field-template>
  </form-bind>
</template>

<script>

  function setInputFilter(textbox, regexStr) {
    const regex = new RegExp(regexStr)
    const events = ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"]
    events.forEach(function(event) {
      textbox.addEventListener(event, function() {
        if(regex.test(this.value)) {
          this.oldValue = this.value
          this.oldSelectionStart = this.selectionStart
          this.oldSelectionEnd = this.selectionEnd
        } else if (this.hasOwnProperty("oldValue")) {
          this.value = this.oldValue
          this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd)
        } else {
          this.value = ""
        }
      })
    })
  }

  export default {
    name: "TextField",
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
      inputClass: {
        type: String
      },
      groupClass: {
        type: String
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      uid() { return ''+this._uid },
      i18n() { return i18n().validation },
      definition() {
        return this.form.getFieldDefinition(this.name)
      },
      maxLength() {
        const validation = this.definition.validation
        return validation && validation.find(v => v.name && v.name === 'maxLength')
      },
      charsLeft() {
        if(this.maxLength) return this.maxLength.length - this.form.getFieldValue(this.name).length
        return -1
      }
    },
    methods: {
      emit() { this.$emit('focus') }
    },
    mounted() {
      const defn = this.definition
      if(defn.inputFilter) setInputFilter(this.$refs.field, defn.inputFilter)
    }
  }

</script>

<style scoped>

</style>
<template>
  <form-bind :name="name" v-slot="{ value, setValue, error }" class="form-field">
    <field-template :errorText="errorText" :error="error" :label="label" :name="name">
      <br>
      <span v-for="option in options" @click="option == value ? setValue(undefined) : setValue(option)">
        <slot v-if="option == value" name="selected" :option="option"></slot>
        <slot v-else name="default" :option="option"></slot>
      </span>
    </field-template>
  </form-bind>
</template>

<script>

  export default {
    name: "OptionsField",
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
      options: {
        type: Array,
        required: true
      }
    },
    methods: {
    }

  }

</script>

<style scoped>

</style>

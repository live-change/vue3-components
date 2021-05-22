<template>
  <slot v-bind="{ value, error, setValue, setError }"></slot>
</template>

<script>
export default {
  name: "FormBind",
  props: {
    name: {
      type: String,
      required: true
    },
    valueFilter: {
      type: Function,
      default: (v) => v
    }
  },
  inject: ['form'],
  data() {
    return {
      value: null,
      error: null,
    }
  },
  computed: {
    definition() {
      return this.form.getFieldDefinition(this.name)
    }
  },
  methods: {
    setValue(value) {
      this.value = value
      const filtered = this.valueFilter(value)
      this.form.setFieldValue(this.name, filtered)
    },
    setError(error) {
      this.form.setFieldError(this.name, error)
    }
  },
  created() {
    this.valueObserver = (v) => {
      this.connected = false
      if(this.valueFilter(this.value) != v) this.value = v
      this.connected = true
    }
    this.errorObserver = (e) => {
      this.connected = false
      this.error = e
      this.connected = true
    }
    this.form.observe(this.name, this.valueObserver)
    this.form.observeError(this.name, this.errorObserver)
    this.connected = true
  },
  beforeUnmount() {
    this.form.unobserve(this.name, this.valueObserver)
    this.form.unobserveError(this.name, this.errorObserver)
    this.connected = false
  }
}
</script>

<style scoped>

</style>
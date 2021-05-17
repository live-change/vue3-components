<template>
  <form-bind :name="name" v-slot="{ value, error }" class="form-field">
    <b-form-group :label="label || name">
      <ul>
        <li v-for="(val, id) in value" :key="val">
          <slot :name="name+'.'+id">
            <component :is="editorComponent" :name="name + '.' + id"
                       :key="name + '.' + id" :label="''+id"></component>
          </slot>
          <button class="btn btn-danger" type="button" @click="remove(id)">×</button>
        </li>
      </ul>
      <small class="text-danger" v-if="error">
        {{ (errorText && errorText[error]) || error }}
      </small>
      <b-button @click="add">Add Element</b-button>
    </b-form-group>
  </form-bind>
</template>

<script>
  export default {
    name: "ListField",
    inject: ['form'],
    props: {
      name: {
        type: String,
        required: true
      },
      label: {
        type: String,
      }
    },
    data() {
      return {
        definition: null,
        value: []
      }
    },
    methods: {
      remove(id) {
        this.form.removeElementFromArray(this.name, id)
      },
      add() {
        console.log("F",this.form)
        this.form.addElementToArray(this.name)
      }
    },
    computed: {
      editorComponent() {
        let fieldDefinition = this.definition.of
        return this.$editors.byDefinition(fieldDefinition)
      }
    },
    created() {
      this.definition = this.form.getFieldDefinition(this.name)
      console.log("CF defn", this.definition)
    }
  }
</script>

<style scoped>

</style>
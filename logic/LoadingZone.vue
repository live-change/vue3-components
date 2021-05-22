<template>
  <div class="loading-zone">
    <div class="content" :class="{ loading: loading.length }">
      <slot></slot>
    </div>
    <div class="loader-main" v-if="loading.length || errors.length">
      <slot name="loading" v-if="loading.length && !errors.length">
        Loading...
      </slot>
      <slot name="error" v-if="errors.length" v-bind="{ errors }">
        <h1>Loading errors!</h1>
        <ol>
          <li v-for="error in errors" :key="error.task.name+':'+error.reason" class="error">
            Loading of <b>{{ error.task.name }}</b> failed because of error <b>{{ error.reason }}</b>
          </li>
        </ol>
      </slot>
    </div>
  </div>
</template>

<script>
  import debugLib from 'debug'

  const info = debugLib('loading:info')
  const debug = debugLib('loading:debug')

  export default {
    name: "LoadingZone",
    data() {
      return {
        loading: [],
        errors: [],
        loadingBlockId: 0,
        connectionProblem: false
      }
    },
    setup() {

    },
    computed: {
    },
    methods: {
      loadingStarted(task) {
        if(this.loading.length == 0) {
          if(this.$analytics && this.$analytics.loadingStarted)
            this.$analytics.loadingStarted({ task: task.name })
          info('LOADING STARTED!')

          const loadingBlockId = this.loadingBlockId
          this.loagindTimeout = setTimeout(() => {
            if(loadingBlockId == this.loadingBlockId && this.loading.length > 0) {
              this.connectionProblem = true
              if(this.$analytics && this.$analytics.loadingError)
                this.$analytics.loadingError({
                  task: "View loading", reason: "connection problem",
                  tasks: this.loading.map(t => t.name)
                })
            }
          }, 4000)
        }
        debug(`task started ${task.name}`)
        this.loading.push(task)
        if(this.$allLoadingTasks) this.$allLoadingTasks.push(task)
        return task
      },
      loadingFinished(task) {
        let id = this.loading.indexOf(task)
        debug(`task finished ${task.name}`)
        if(id == -1) throw new Error("Task not found")
        this.loading.splice(id, 1)

        if(this.$allLoadingTasks)
          this.$allLoadingTasks.splice(this.$allLoadingTasks.indexOf(task), 1)
        if(this.loading.length == 0) {
          this.loadingBlockId++
          clearTimeout(this.loadingTimeout)
          if(this.$analytics && this.$analytics.loadingDone)
            this.$analytics.loadingDone({ task: task.name })
          this.$nextTick(this.$router.loadingDone)
        }
      },
      loadingFailed(task, reason) {
        debug(`task failed ${task.name} because ${reason}`)
        this.loadingBlockId++
        clearTimeout(this.loadingTimeout)

        this.errors.push({ task, reason })
        if(this.$analytics && this.$analytics.loadingError) {
          this.$analytics.loadingError({ task: task.name, reason })
        }
        let id = this.loading.indexOf(task)
        if(id == -1) {
          this.errors.push({ task, reason: "unknown task "+task.name })
          throw new Error("Task not found")
        }
        this.loading.splice(id, 1)

        if(this.$allLoadingTasks)
          this.$allLoadingTasks.splice(this.$allLoadingTasks.indexOf(task), 1)
        if(this.$allLoadingErrors)
          this.$allLoadingErrors.push({ task, reason })
      },
      addLoadingPromise(name, promise) {
        let task = this.loadingStarted({ name, promise })
        promise
          .catch((reason) => {
            console.error("LOADING OF", name, "FAILED", reason)
            this.loadingFailed(task, reason)
          })
        promise
          .then((result) => this.loadingFinished(task))
        return promise
      }
    },
    provide() {
      return {
        loadingZone: {
          started: (task) => this.loadingStarted(task),
          finished: (task) => this.loadingFinished(task),
          failed: (task, reason) => this.loadingFailed(task, reason),
          addPromise: (name, promise) => this.addLoadingPromise(name, promise)
        }
      }
    },
    beforeUnmount() {
      for(let task of this.loading) {
        if(this.$allLoadingTasks)
          this.$allLoadingTasks.splice(this.$allLoadingTasks.indexOf(task), 1)
      }
    }
  }
</script>

<style scoped>

</style>

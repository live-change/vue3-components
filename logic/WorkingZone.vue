<template>
  <div class="working-zone">
    <div class="content" :class="{ working: working.length }">
      <slot></slot>
    </div>
    <div class="loader-main" v-if="working.length || errors.length">
      <slot name="working" v-if="working.length && !errors.length">
        Working...
      </slot>
      <slot name="error" v-if="errors.length">
        <InternalServerError taskType="Working" :errors="errors" />
      </slot>
    </div>
  </div>
</template>

<script>

import debugLib from 'debug'

const info = debugLib('working:info')
const debug = debugLib('workingnpm:debug')

export default {
  name: "WorkingZone",
  data() {
    return {
      working: [],
      errors: [],
      workingBlockId: 0,
      connectionProblem: false
    }
  },
  computed: {
  },
  methods: {
    workingStarted(task) {
      if(this.working.length == 0) {
        if(this.$analytics && this.$analytics.workingStarted)
          this.$analytics.workingStarted({ task: task.name })
        info('WORKING STARTED!')

        const workingBlockId = this.workingBlockId
        this.loagindTimeout = setTimeout(() => {
          if(workingBlockId == this.workingBlockId && this.working.length > 0) {
            this.connectionProblem = true
            this.$analytics.workingError({
              task: "View working", reason: "connection problem",
              tasks: this.working.map(t => t.name)
            })
          }
        }, 4000)
      }
      debug(`task started ${task.name}`)
      this.working.push(task)
      if(this.$allWorkingTasks) this.$allWorkingTasks.push(task)
      return task
    },
    workingFinished(task) {
      let id = this.working.indexOf(task)
      debug(`task finished ${task.name}`)
      if(id == -1) throw new Error("Task not found")
      this.working.splice(id, 1)

      if(this.$allWorkingTasks)
        this.$allWorkingTasks.splice(this.$allWorkingTasks.indexOf(task), 1)
      if(this.working.length == 0) {
        this.workingBlockId++
        clearTimeout(this.workingTimeout)
        if(this.$analytics && this.$analytics.workingDone)
          this.$analytics.workingDone({ task: task.name })
        this.$nextTick(this.$router.workingDone)
      }
    },
    workingFailed(task, reason) {
      debug(`task failed ${task.name} because ${reason}`)
      this.workingBlockId++
      clearTimeout(this.workingTimeout)

      this.errors.push({ task, reason })
      if(this.$analytics && this.$analytics.workingError)
        this.$analytics.workingError({ task: task.name, reason })

      let id = this.working.indexOf(task)
      if(id == -1) {
        this.errors.push({ task, reason: "unknown task "+task.name })
        throw new Error("Task not found")
      }
      this.working.splice(id, 1)

      if(this.$allWorkingTasks)
        this.$allWorkingTasks.splice(this.$allWorkingTasks.indexOf(task), 1)
      if(this.$allWorkingErrors)
        this.$allWorkingErrors.push({ task, reason })
    },
    addWorkingPromise(name, promise) {
      let task = this.workingStarted({ name, promise })
      promise
          .catch((reason) => {
            console.error("WORKING OF", name, "FAILED", reason)
            this.workingFailed(task, reason)
          })
      promise
          .then((result) => this.workingFinished(task))
      return promise
    }
  },
  provide() {
    return {
      workingZone: {
        started: (task) => this.workingStarted(task),
        finished: (task) => this.workingFinished(task),
        failed: (task, reason) => this.workingFailed(task, reason),
        addPromise: (name, promise) => this.addWorkingPromise(name, promise)
      }
    }
  },
  beforeDestroy() {
    for(let task of this.working) {
      if(this.$allWorkingTasks)
        this.$allWorkingTasks.splice(this.$allWorkingTasks.indexOf(task), 1)
    }
  }
}
</script>

<style scoped>

</style>

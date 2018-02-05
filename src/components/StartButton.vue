<template>
  <div class="startTracking" v-on:click="startTracking">
    <div class="text" v-if="currentlyRunning">
      Finish tracking of {{ currentTimeDiff | hourify }} ...
    </div>
    <div class="text" v-else>
      Start tracking ...
    </div>
  </div>
</template>

<script>
export default {
  name: 'StartButton',
  methods: {
    startTracking () {
      if (this.$store.state.currentlyRunning === null) {
        this.$store.commit('start', {
          'start': new Date()
        })
      } else {
        const [start, end] = [new Date(this.$store.state.currentlyRunning), new Date()].map((date) => {
          const month = date.getMonth() + 1
          const day = date.getDate()
          const hours = date.getHours()
          const minutes = date.getMinutes()
          return date.getFullYear() + '-' + (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day + ' ' + (hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : '') + minutes + ':00 UTC+1'
        })
        if (start !== end) {
          this.$store.commit('finish', {
            'start': start,
            'end': end
          })
        }
      }
    }
  },
  computed: {
    currentlyRunning () {
      return this.$store.state.currentlyRunning
    },
    currentTimeDiff () {
      const now = new Date()
      const diff = now - new Date(this.$store.state.currentlyRunning)
      return Math.floor(diff / (60 * 1000))
    }
  },
  filters: {
    hourify: minutes => {
      const passedMinutes = minutes % 60
      const passedHours = (minutes - passedMinutes) / 60
      return passedHours + ':' + ((passedMinutes < 10) ? '0' : '') + passedMinutes + 'h'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.startTracking:hover,
.startTracking:focus {
  box-shadow: 0 0 5px rgba(1, 97, 153, 0.3);
  background-color: rgba(1, 97, 153, 0.3);
  cursor: pointer;
}

.startTracking .text {
  width: 100%;
  text-align: center;
  line-height: 50px;
  font-size: 2em;
}

.startTracking {
  display: flex;
  height: 50px;
  box-sizing: content-box;
  background-color: rgba(1, 97, 153, 0.05);
  padding: 7px 16px;
  margin: 5px 0;
}
</style>

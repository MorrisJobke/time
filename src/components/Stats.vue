<template>
  <div class="stats">
    Today so far: {{ liveTimePassedDay() | hourify }}<br />
    This week so far: {{ liveTimePassedWeek() | hourify }}
  </div>
</template>

<script>
import Moment from 'moment'

export default {
  name: 'Stats',
  computed: {
    timePassedWeek () {
      const startedAtDateOrNow = (this.$store.state.currentlyRunning !== null) ? new Date(this.$store.state.currentlyRunning) : new Date()
      const currentMonth = startedAtDateOrNow.getMonth() + 1
      const currentDay = startedAtDateOrNow.getDate()
      const day = startedAtDateOrNow.getFullYear() + '-' + (currentMonth < 10 ? '0' : '') + currentMonth + '-' + (currentDay < 10 ? '0' : '') + currentDay

      let minutesThisWeek = 0

      const mondayThisWeek = Moment(startedAtDateOrNow).startOf('isoWeek')
      const currentWeekSlots = this.$store.state.timeSlots.filter(element => {
        return mondayThisWeek.isSameOrBefore(day.date, 'day')
      })
      if (currentWeekSlots.length > 0) {
        minutesThisWeek += currentWeekSlots.map(
          (slot) => Math.floor((new Date(slot.end) - new Date(slot.start)) / (60 * 1000))
        ).reduce(
          (previous, current) => current + previous, 0
        )
      }

      return minutesThisWeek
    },
    timePassedDay () {
      const startedAtDateOrNow = (this.$store.state.currentlyRunning !== null) ? new Date(this.$store.state.currentlyRunning) : new Date()
      const currentMonth = startedAtDateOrNow.getMonth() + 1
      const currentDay = startedAtDateOrNow.getDate()
      const day = startedAtDateOrNow.getFullYear() + '-' + (currentMonth < 10 ? '0' : '') + currentMonth + '-' + (currentDay < 10 ? '0' : '') + currentDay

      let minutesToday = 0

      const currentDaySlots = this.$store.state.timeSlots.filter(element => {
        return element.start.startsWith(day)
      })

      if (currentDaySlots.length > 0) {
        minutesToday += currentDaySlots.map(
          (slot) => Math.floor((new Date(slot.end) - new Date(slot.start)) / (60 * 1000))
        ).reduce(
          (previous, current) => current + previous, 0
        )
      }

      return minutesToday
    }
  },
  filters: {
    hourify: minutes => {
      const passedMinutes = minutes % 60
      const passedHours = (minutes - passedMinutes) / 60
      return passedHours + ':' + ((passedMinutes < 10) ? '0' : '') + passedMinutes + 'h'
    }
  },
  methods: {
    liveTimePassedWeek () {
      if (this.$store.state.currentlyRunning !== null) {
        const date = new Date(this.$store.state.currentlyRunning)
        const diff = new Date() - date
        const diffInMinutes = Math.floor(diff / (60 * 1000))

        return this.timePassedWeek + diffInMinutes
      }
      return this.timePassedWeek
    },
    liveTimePassedDay () {
      if (this.$store.state.currentlyRunning !== null) {
        const date = new Date(this.$store.state.currentlyRunning)
        const diff = new Date() - date
        const diffInMinutes = Math.floor(diff / (60 * 1000))

        return this.timePassedDay + diffInMinutes
      }
      return this.timePassedDay
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.stats {
  float: right;
  text-align: right;
  color: rgba(0, 0, 0, .4)
}
</style>

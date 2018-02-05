<template>
  <div class="daySlot">
    <div class="day">
      {{ name }}
      <span class="totalDuration">{{ total }}h</span>
    </div>
    <ul class="slotList">
      <li v-for="(slot, key) in elements" v-bind:key="key">
        <entry v-bind:entry="slot"/>
      </li>
    </ul>
  </div>
</template>

<script>
import Entry from '@/components/Entry'

export default {
  name: 'DaySlot',
  props: ['elements', 'day'],
  computed: {
    name () {
      const date = new Date(this.day)
      const now = new Date()
      const days = Math.floor((now - date) / (24 * 60 * 60 * 1000))

      if (days === 0) {
        return 'Today'
      } else if (days === 1) {
        return 'Yesterday'
      } else {
        return this.day
      }
    },
    total () {
      const totalMinutes = this.elements
        .map((slot) => {
          const startDate = new Date(slot.start)
          const endDate = new Date(slot.end)
          if (isNaN(startDate) || isNaN(endDate) || startDate > endDate) {
            return 0
          }

          return (endDate - startDate) / (60 * 1000)
        })
        .reduce((previous, current) => previous + current, 0)

      const passedMinutes = totalMinutes % 60
      const passedHours = (totalMinutes - passedMinutes) / 60

      return passedHours + ':' + ((passedMinutes < 10) ? '0' : '') + passedMinutes
    }
  },
  components: { Entry }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

ul {
  padding-left: 0;
  list-style: none;
}

.daySlot {
  padding: 10px 0;
}

.day {
  color: rgba(0, 0, 0, .7)
}

.daySlot .day .totalDuration {
  float: right;
}

</style>

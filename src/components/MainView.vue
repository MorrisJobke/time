<template>
  <div>
    <stats/><!--<Stats startedAt={this.state.startedAt} daySlots={this.state.daySlots} />-->
    <h1>Time</h1>
    <start-button/><!--<StartButtonContent startedAt={this.state.startedAt} onClick={() => this.handleClick()} />-->
    <ul className="dayList">
      <li v-for="(elements, day) in days" v-bind:key="day">
        <day-slot v-bind:elements="elements" v-bind:day="day" />
      </li>
    </ul>
  </div>
</template>

<script>
import DaySlot from '@/components/DaySlot'
import StartButton from '@/components/StartButton'
import Stats from '@/components/Stats'

export default {
  name: 'MainView',
  components: { StartButton, Stats, DaySlot },
  computed: {
    days () {
      let days = {}

      this.$store.state.timeSlots.forEach(element => {
        const d = new Date(element.start)
        const currentYear = d.getFullYear()
        const currentMonth = d.getMonth() + 1
        const currentDay = d.getDate()
        const id = currentYear + '-' + (currentMonth < 10 ? '0' : '') + currentMonth + '-' + (currentDay < 10 ? '0' : '') + currentDay
        if (!(id in days)) {
          days[id] = []
        }
        days[id].push(element)
      })
      return days
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
ul {
  padding-left: 0;
  list-style: none;
}
</style>

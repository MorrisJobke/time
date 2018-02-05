<template>
  <div class="slot">
    <div class="duration">{{ hours }}:{{ paddedMinutes }}h</div>
    <div class="details">
      {{ start }}<br/>
      {{ end }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'Entry',
  props: ['entry'],
  data () {
    const startDate = new Date(this.entry.start)
    const endDate = new Date(this.entry.end)
    if (isNaN(startDate) || isNaN(endDate) || startDate > endDate) {
      return {
        hours: 0,
        paddedMinutes: 0,
        start: '-',
        end: '-'
      }
    }
    const durationInMinutes = (endDate - startDate) / (60 * 1000)

    const minutes = durationInMinutes % 60
    const hours = (durationInMinutes - minutes) / 60
    const paddedMinutes = (minutes > 9) ? minutes : '0' + minutes

    const start = [startDate.getHours(), startDate.getMinutes()].map(
      (item) => item > 9 ? item : '0' + item
    ).join(':')
    const end = [endDate.getHours(), endDate.getMinutes()].map(
      (item) => item > 9 ? item : '0' + item
    ).join(':')

    return {
      hours: hours,
      paddedMinutes: paddedMinutes,
      start: start,
      end: end
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.slot {
  display: flex;
  height: 50px;
  box-sizing: content-box;
  background-color: rgba(1, 97, 153, 0.05);
  padding: 7px 16px;
  margin: 5px 0;
}

.slot:hover,
.slot:focus {
  box-shadow: 0 0 5px rgba(1, 97, 153, 0.3);
  background-color: rgba(1, 97, 153, 0.3);
}

.slot .duration,
.slot .details {
  width: 45%;
  height: 50px;
  margin: auto;
}

.slot .duration {
  line-height: 50px;
  font-size: 2em;
  text-align: right;
}

.slot .details {
  line-height: 25px;
  color: rgba(0, 0, 0, .4)
}

</style>

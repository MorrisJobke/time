// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import PouchDB from 'pouchdb'
import _ from 'lodash'
import App from './App'
import router from './router'

Vue.config.productionTip = false

const localDB = new PouchDB('timeTracker')
const pouchDBSync = store => {
  let finishedInit = false

  localDB.allDocs({
    include_docs: true,
    attachments: true
  }).then(function (result) {
    const rows = _.sortBy(result.rows, row => row.doc.createdAt)
    console.log('Importing ' + rows.length + ' rows ...')
    console.time('Importing mutations')

    rows.forEach(row => {
      if (row.doc.mutation) {
        store.commit(row.doc.type, row.doc.payload)
      }
    })
    console.timeEnd('Importing mutations')

    finishedInit = true
  }).catch(function (err) {
    console.log(err)
  })

  // called when the store is initialized
  store.subscribe((mutation, state) => {
    if (!finishedInit) {
      return
    }
    // called after every mutation.
    // The mutation comes in the format of `{ type, payload }`.
    console.log(mutation)
    mutation.mutation = true
    mutation.createdAt = (new Date()).toISOString()
    localDB.post(mutation)
  })
}

Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    timeSlots: [],
    currentlyRunning: null
  },
  mutations: {
    start (state, payload) {
      state.currentlyRunning = payload.start
    },
    finish (state, payload) {
      state.currentlyRunning = null
      state.timeSlots.push({
        'start': payload.start,
        'end': payload.end
      })
    }
  },
  plugins: [ pouchDBSync ]
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

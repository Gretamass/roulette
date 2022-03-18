<template>
  <div class="page">
    <div class="title">
      <h1>Aardvark Roulette Game</h1> 
    </div>
    <Api v-on:getUrl="getUrl" />
    <input type="text" name="url" v-model="url" />
    <h1>{{ url }}</h1>
    <Statistics :colspan="colspan" :stats="stats" :boardConfig="board" />
    <Spring-spinner
      v-if="loading"
      class="spinner"
      :animation-duration="3000"
      :size="60"
      :color="'#333'"
    />
    <div class="row">
      <div class="column">
        <Gameboard :boardConfig="board" :positionsConfig="positions"/>
        <Events :eventText="eventText" :messages="messages" />
      </div>
    <Log />
    </div> 
  </div>
</template>

<script>
import Api from '@/components/Api.vue';
import Gameboard from '@/components/Gameboard.vue';
import Statistics from '@/components/Statistics.vue';
import Events from '@/components/Events.vue';
import Log from '@/components/Log.vue';
import { SpringSpinner } from "epic-spinners";
import axios from 'axios';

export default {
  name: 'App',
  components: {
    Api,
    Gameboard,
    Statistics,
    Events,
    Log,
    SpringSpinner,
  },
  data() {
    return {
      board: {},
      positions: [],
      remainingTime: null,
      colspan: null,
      stats: [],
      data: {},
      eventText: "",
      messages: [],
      // info: '',
      loading: false,
      url: '',
    };
  },

  mounted () {

        console.log(this.url);
    this.getBoardValue();
    this.getDataValue()

    this.countDown = setInterval(() => {
      if (this.remainingTime === 0 && this.nextGame) {
        this.nextGame = false;
        this.loading = true;
        this.eventText = `The wheel is spinning...`;
        setTimeout(() => {
          console.log(`${this.url}/game/${this.data.id}`);
          axios.get(`${this.url}/game/${this.data.id}`)
            .then(response => {
              this.result = response.data;
            this.messages.push(
              `Game ${this.data.id} ended, result is ${this.result.result}`
            );
            this.eventText = `result is ${this.result.result}`;
            console.log(this.result.result);
            this.loading = false;
            setTimeout(() => {
                this.getStatsValue();
                this.getDataValue();
            }, 2000);
          }).catch(error => {
            console.log(error)
          });
        }, 1000);

      } else if (this.remainingTime > 0 && this.nextGame) {
        this.wheelId = this.data.id;
        this.remainingTime = this.remainingTime - 1;
        this.eventText = `Game ${this.wheelId} will start in ${this.remainingTime} sec`;
      }
    }, 1000);


  },

  methods: {
    getUrl(url){
      this.url = url;
    },

    getBoardValue(){
      axios.get(`${this.url}/configuration`)
      .then(response => {
        this.board = response.data;
        // this.info = response.data;
        this.positions = response.data.positionToId;
        this.numbers = response.data.results;
        this.colspan = this.board.slots - 10;4
        this.getStatsValue()
        console.log(response)
      }).catch(error => {
        console.log(error)
      })
    },

    getStatsValue(){
      axios.get(`${this.url}/stats?limit=200`)
      .then(response => {
        this.stats = response.data;
        console.log(response)
      }).catch(error => {
        console.log(error)
      })
    },

    getResultValue(){

    },

    getDataValue(){
      axios.get(`${this.url}/nextGame`)
      .then(response => {
        this.data = response.data;
        this.wheelId = this.data.id;
        this.remainingTime = this.data.fakeStartDelta;
        this.eventText = `Game ${this.wheelId} will start in ${this.data.fakeStartDelta} sec`;
        this.nextGame = true;
        console.log(response)
      }).catch(error => {
        console.log(error)
      })
    },
  },

  computed: {
    spinResult: {
      set(result) {
        this.$store.commit("SET_SPIN_RESULT", result);
      },
      get() {
        this.getStats(this.url);
        return this.$store.state.spinResult;
      },
    },
    displayText: {
      set(text) {
        this.$store.commit("SET_DISPLAY_TEXT", text);
      },
      get() {
        return this.$store.state.displayText;
      },
    },
  }
  
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #313131;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 1140px;
  padding: 0px 16px;
}
.title {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
}

.row {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
}

.column {
  display: flex;
  flex-direction: column;
  width: 50%;
  padding-right: 8px;
}

h3 {
  padding-bottom: 16px;
}

.spinner {
  position: absolute;
  left: 50%;
  top: 50%;
}
</style>

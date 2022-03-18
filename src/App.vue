<template>
  <div class="page">
    <div class="title">
      <h1>Aardvark Roulette Game</h1> 
    </div>
    <Api />
    <Statistics :colspan="colspan" :stats="stats" :boardConfig="board" />
    <Spring-spinner
      v-if="loadingStatus"
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
      errored: "",
      info: '',
      url: "https://dev-games-backend.advbet.com/v1/ab-roulette/1"
    };
  },
  //   beforeMount() {
  //   this.getBoard(this.url);
  //   this.getData(this.url);
  // },
  mounted () {
    axios
      .get(`${this.url}/configuration`)
      .then(response => {
        this.board = response.data;
        this.info = response.data;
        this.positions = response.data.positionToId;
        this.numbers = response.data.results;
        this.colspan = this.board.slots - 10;
        // getStats(`${this.url}/stats?limit=200`);
      })
      .catch(error => {
        console.log(error)
        this.errored = true
      })
      // .finally(() => this.loading = false)

    const getBoard = axios.get(`${this.url}/configuration`);
    const getStats = axios.get(`${this.url}/stats?limit=200`);
    const getData = axios.get(`${this.url}/nextGame`);


    getBoard.then(response => {
      console.log(response)
    }).catch(error => {
      console.err(error)
    })

    getStats.then(response => {
      this.stats = response.data;
      console.log(response)
    }).catch(error => {
      console.err(error)
    })

    getData.then(response => {
      this.data = response.data;
      this.wheelId = this.data.id;
      this.remainingTime = this.data.fakeStartDelta;
      this.eventText = `Game ${this.wheelId} will start in ${this.data.fakeStartDelta} sec`;
      this.nextGame = true;
      console.log(response)
    }).catch(error => {
      console.err(error)
    })

    // getResultData.then(response => {
    //  this.result = response.data;
    //   console.log(response)
    // }).catch(error => {
    //   console.err(error)
    // });


    this.countDown = setInterval(() => {
      if (this.remainingTime === 0 && this.nextGame) {
        this.nextGame = false;
        this.eventText = `The wheel is spinning...`;
        this.getResult(this.data.id);
      } else if (this.remainingTime > 0 && this.nextGame) {
        this.wheelId = this.data.id;
        this.remainingTime = this.remainingTime - 1;
        this.eventText = `Game ${this.wheelId} will start in ${this.remainingTime} sec`;
      }
    }, 1000);


  },

  methods: {
      getResult() {
        const getResultData = axios.get(`${this.api}/game/${0}`);
        getResultData.then(response => {
        this.result = response.data;
          console.log(response)
        }).catch(error => {
          console.err(error)
        });
      },


  }
  
  // methods: {
  //   async getBoard(api) {
  //     // this.$store.commit("SET_DISPLAY_TEXT", "Loading game board");
  //     let res = await fetch(`${api}/configuration`).then((res) => res.json());
  //     console.log(res);
  //     if (this.board === null) {
  //       // this.$store.commit("SET_DISPLAY_TEXT", "Loading was unsuccessful");
  //     }
  //     this.board = res;
  //     // this.$store.commit("SET_DISPLAY_TEXT", "GET ../configuration");
  //     this.positions = res.positionToId;
  //     this.numbers = res.results;
  //     this.colspan = this.board.slots - 10;
  //     this.getStats(api);
  //   },

  //   async getData(api) {
  //     do {
  //       let res = await fetch(`${api}/nextGame`).then((res) => res.json());
  //       this.data = res;
  //     } while (this.api === null);
  //     // this.$store.commit("SET_DISPLAY_TEXT", "GET ../nextGame");
  //     this.wheelId = this.data.id;
  //     this.remainingTime = this.data.fakeStartDelta;
  //     this.eventText = `Game ${this.wheelId} will start in ${this.data.fakeStartDelta} sec`;
  //     this.nextGame = true;
  //     this.sleepingTime();
  //   },

  //   async getStats(api) {
  //     // this.$store.commit("SET_DISPLAY_TEXT", "GET .../stats?limit=200");
  //     let stats = await fetch(`${api}/stats?limit=200`).then((stats) =>
  //       stats.json()
  //     );
  //     this.stats = stats;
  //   },

  //   async getResult(instanceId, api) {
  //     // this.$store.commit("SET_LOADING_STATUS", true);
  //     // this.$store.commit("SET_DISPLAY_TEXT", "Spinning the wheel");
  //     // this.$store.commit("SET_DISPLAY_TEXT", "GET .../game/" + instanceId);
  //     do {
  //       let res = await fetch(`${api}/game/${instanceId}`).then((res) =>
  //         res.json()
  //       );
  //       this.result = res;
  //     } while (this.result.result === null);
  //     this.messages.push(
  //       `Game ${instanceId} ended, result is ${this.result.result}`
  //     );
  //     // this.$store.commit("SET_SPIN_RESULT", this.result.result);
  //     // this.$store.commit("SET_DISPLAY_TEXT", "result is " + this.result.result);
  //     // this.$store.commit("SET_LOADING_STATUS", false);
  //     this.getStats(this.url);
  //     this.getData(api);
  //   },
  // },
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

<template>
  <div class="page">
    <div class="title">
      <h1>Aardvark Roulette Game</h1> 
    </div>
    <Api v-on:getUrl="getUrl" />
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
        <Gameboard ref="Gameboard" :boardConfig="board" :positionsConfig="positions"/>
        <Events :eventText="eventText" :messages="messages" />
      </div>
    <Log :logText="logText" />
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
      board: null,
      positions: [],
      remainingTime: null,
      colspan: null,
      stats: null,
      data: {},
      logText: [],
      eventText: undefined,
      messages: [],
      result: null,
      loading: false,
      url: '',
    };
  },
  beforeMount(){
    this.logText.push(
        `${this.getTime()} Loading game board`
    );
  },

  mounted () {
    this.countDown = setInterval(() => {
      if (this.remainingTime === 0 && this.nextGame) {
        this.nextGame = false;
        this.loading = true;
        this.eventText = `The wheel is spinning...`;
        this.logText.push(
          `${this.getTime()} Spinning the wheel `
        );
        this.getResultValue();

      } else if (this.remainingTime > 0 && this.nextGame) {
        this.wheelId = this.data.id;
        this.remainingTime = this.remainingTime - 1;
        this.eventText = `Game ${this.wheelId} will start in ${this.remainingTime} sec`;
      }
    }, 1000);
  },

  methods: {
    async getUrl(url){
      this.url = url;
      this.messages = [];

      await this.getBoardValue();
      await this.getStatsValue();
      await this.getDataValue();
    },

    getBoardValue(){ 
      this.logText.push(
        `${this.getTime()} GET .../configuration`
      );
      return axios.get(`${this.url}/configuration`)
        .then(response => {
          this.board = response.data;
          this.positions = response.data.positionToId;
          this.numbers = response.data.results;
          this.colspan = this.board.slots - 10;
          this.logText.push(
            `${this.getTime()} Checking for new game`
          );
        })
        .catch(() => {
          this.logText.push(
            `${this.getTime()} GET .../configuration failed, trying again in 1000`
          );
          setTimeout(() => {
            this.getBoardValue();
          }, 1000);
        })
    },

    getStatsValue(){
      this.logText.push(
        `${this.getTime()} GET .../stats?limit=200`
      );
      return axios.get(`${this.url}/stats?limit=200`)
      .then(response => {
        this.stats = response.data;
      })
      .catch(() => {
        this.logText.push(
          `${this.getTime()} GET .../stats?limit=200 failed, trying again in 1000`
        );
        setTimeout(() => {
          this.getStatsValue();
        }, 1000);
      })
    },

    getResultValue(){
      setTimeout(() => {
          this.logText.push(
            `${this.getTime()} GET .../game/${this.data.id} `
          );
          axios.get(`${this.url}/game/${this.data.id}`)
            .then(response => {
              this.result = response.data.result;
              if(this.result !== null){
                this.messages.push(
                  `Game ${this.wheelId} ended, result is ${this.result}`
                );
                this.logText.push(
                  `${this.getTime()} result is ${this.result} `
                );
                this.logText.push(
                  `${this.getTime()} Stopped spinning the wheel `
                );
                this.$refs.Gameboard.colorResult(this.result);
                this.loading = false;
                this.getInfo();
                
              } else {
                setTimeout(() => {
                  this.getResultValue();
                }, 1000);
              }
          })
          .catch(() => {
            this.logText.push(
              `${this.getTime()} Error getting results, continue spinning`
            );
            setTimeout(() => {
              this.getResultValue();
            }, 1000);
          });
        }, 2000);
    },

    async getInfo(){
      await this.getStatsValue();
      await this.getDataValue();
    },

    getTime() {
      return new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString();
    },

    getDataValue(){
      this.logText.push(
        `${this.getTime()} GET .../nextGame `
      );
      return axios.get(`${this.url}/nextGame`)
      .then(response => {
        this.data = response.data;
        this.wheelId = this.data.id;
        this.remainingTime = this.data.fakeStartDelta;
        if(this.remainingTime >= 0){
          this.eventText = `Game ${this.data.id} will start in ${this.data.fakeStartDelta} sec`;
          this.nextGame = true;
          this.logText.push(
            `${this.getTime()} sleeping for fakeStartDelta ${this.data.fakeStartDelta} sec `
          );
        } else {
          setTimeout(() => {
            this.getDataValue();
          }, 2000);
        }
      })
      .catch(() => {
        this.logText.push(
          `${this.getTime()} GET .../nextGame failed, trying again in 1000`
        );
        setTimeout(() => {
          this.getDataValue();
        }, 1000);
      })
    },
  },
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

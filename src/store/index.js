import { createStore } from 'vuex'

export default createStore({
  state: {
    // loadingStatus: false,
    // url: "https://dev-games-backend.advbet.com/v1/ab-roulette/1",
    spinResult: null,
    // displayText: [],
    board: [],
    positions: [],
    number: [],
  },
  mutations: {
    SET_SPIN_RESULT(state, result) {
        state.spinResult = result;
    },
    SET_DISPLAY_TEXT(state, text) {
        state.displayText.push(
            new Date(new Date().toString().split("GMT")[0] + " UTC").toISOString() +
            " " +
            text
        );
    },
  }
})

<template>
<div class="gameboard">
    <h3>Gameboard</h3>
    <div v-if="boardConfig" class="board">
      <div
        v-for="n in positionsConfig"
        :key="n"
        class="boardTile"
        :class="[
          [
            boardConfig.colors[n],
            [n === rez ? 'result' : ''],
            [rez === null ? 'revert' : ''],
          ],
        ]"
      >
        {{ boardConfig.results[n] }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Gameboard-item",
  props: ["boardConfig", "positionsConfig"],
  data() {
    return {
      rez: null,
    };
  },

  methods: {
    colorResult(value) {
      this.rez = value;
      setTimeout(() => {
        this.rez = null;
      }, 1000);
    },
  },
}
</script>

<style>
.gameboard {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.board {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  max-width: 450px;
}

.boardTile {
  display: flex;
  justify-content: center;
  color: white;
  width: 10px;
  padding: 6px 12px;
  margin-bottom: 0;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.42857143;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  border: 1px solid transparent;
  border-radius: 4px;
}

.red {
  background-color: #d9534f;
  border-color: #ac2925;
}

.green {
  background-color: #449d44;
  border-color: #398439;
}

.black {
  background-color: #000;
  border-color: #222;
}

.red:hover {
  background-color: #db726f;
  border-color: #ac2925;
  color: #333;
  text-decoration: none;
}

.green:hover {
  background-color: #65af65;
  border-color: #398439;
  color: #333;
  text-decoration: none;
}

.black:hover {
  background-color: rgb(17, 17, 17);
  border-color: #222;
  color: rgb(219, 219, 219);
  text-decoration: none;
}

.result {
  color: #000;
  opacity: 0.5;
  transition: opacity 1s ease-out;
}

.revert {
  opacity: 1;
  transition: opacity 1s ease-out;
  color: white;
}

.fade-enter-active {
  transition: opacity 1s ease-out;
  transition-delay: 1s;
}
.fade-enter {
  opacity: 0;
}
.fade-enter-to {
  opacity: 1;
}
.fade-move {
  transition: transform 1s;
}
</style>

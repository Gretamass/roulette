<template>
<div class="statistics">
    <h3>Statistics (last 200 spins)</h3>
    <div class="stats">
      <tbody v-if="stats" class="statBoard">
        <tr>
          <td></td>
          <th colspan="5" class="cold">Cold</th>
          <th :colspan="colspan" class="neutral">Neutral</th>
          <th colspan="5" class="hot">Hot</th>
        </tr>
        <tr>
          <th>Slot</th>
          <td
            v-for="n in stats"
            :key="n"
            class="statsSlot"
            :style="{ background: `${getNumbersBackground(n.result)}` }"
          >
            {{ boardConfig.results[n.result] }}
          </td>
        </tr>
        <tr>
          <th>Hits</th>
          <td
            v-for="(n, index) in stats"
            :key="n"
            class="hits"
            :style="{ background: `${getHitsBackground(index)}` }"
          >
            {{ n.count }}
          </td>
        </tr>
      </tbody>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Statistics-item',
  props: ["colspan", "stats", "boardConfig"],
    methods: {
    getNumbersBackground(number) {
      for (let i = 0; i < this.boardConfig.slots; i++) {
        if (number === this.boardConfig.positionToId[i]) {
          if (this.boardConfig.colors[number] === "red") {
            return "#d9534f";
          } else if (this.boardConfig.colors[number] === "black") {
            return "#000";
          } else {
            return "#449d44";
          }
        }
      }
    },
    getHitsBackground(index) {
      if (index > this.boardConfig.slots - 6) {
        return "#e9b6b6";
      } else if (index < 5) {
        return "#a6c8d9";
      } else {
        return "#f5f5f5";
      }
    },
  },
}
</script>

<style>
.statistics {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.stats {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-spacing: 0;
  border-collapse: collapse;
}
.statsBoard {
  display: table-row-group;
  vertical-align: middle;
  border-color: inherit;
}

tr {
  display: table-row;
  vertical-align: inherit;
  border-color: inherit;
}

td,
th {
  padding: 0;
}

th {
  text-align: left;
  padding-right: 8px;
  padding: 8px;
  line-height: 1.42857143;
  vertical-align: top;
  border-top: 1px solid #ddd;
}

.table > thead > tr > th,
.table > tbody > tr > th,
.table > tfoot > tr > th,
.table > thead > tr > td,
.table > tbody > tr > td,
.table > tfoot > tr > td {
  padding: 8px;
  line-height: 1.42857143;
  vertical-align: top;
  border-top: 1px solid #ddd;
}

.statsSlot {
  width: 24px;
  height: 32px;
  line-height: 1.42857143;
  vertical-align: center;
  border-top: 1px solid #ddd;
  border-right: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  color: white;
  text-align: center;
}

.hits {
  width: 24px;
  height: 32px;
  line-height: 1.42857143;
  vertical-align: center;
  color: rgb(0, 0, 0);
  text-align: center;
  border-top: 1px solid #ddd;
  border-right: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
}

.hot {
  background-color: #e9b6b6;
}

.cold {
  background-color: #a6c8d9;
}
</style>

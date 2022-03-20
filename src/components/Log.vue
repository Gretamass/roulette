<template>
  <div class="log">
    <h3>Log</h3>
    <div class="logs">
      <div v-for="log in logText" :key="log" class="logLine">
        {{ log }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Log-item',
  props: ["logText"]
}
</script>

<style>
.log {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  width: fit-content;
  padding-right: 32px;
}

.logs {
  display: block;
  padding: 9.5px;
  margin: 0 0 10px;
  font-size: 13px;
  line-height: 1.42857143;
  color: #333;
  word-break: break-all;
  word-wrap: break-word;
  background-color: #f5f5f5;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.logLine {
  font-size: 14px;
}
</style>

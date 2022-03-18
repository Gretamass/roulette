<template>
<div class="api">
    <h3>API base URL</h3>
    <input type="text" name="url" v-model="url1" />
  </div>
</template>

<script>
export default {
  name: 'Api-item',
  data(){
    return{
        url1: "https://dev-games-backend.advbet.com/v1/ab-roulette/1",
    }
  },
  beforeMount(){
      this.$emit('getUrl', this.url1)
  }
}
</script>

<style>
.api {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

h3 {
  max-width: 100%;
  margin-bottom: 5px;
  font-weight: 400;
  font-size: 16px;
}

input {
  display: block;
  width: 100%;
  height: 34px;
  padding: 6px 0px;
  font-size: 14px;
  line-height: 1.42857143;
  color: #555;
  background-color: #fff;
  background-image: none;
  border: 1px solid #ccc;
  border-radius: 4px;
}

</style>

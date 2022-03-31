<template>
  <div class="events">
    <h3>Events</h3>
    <div class="events">
      <div v-for="message in messages" :key="message" class="messages">
        <p>{{ message }}</p>
      </div>
      <div v-if="eventText" class="messages">
        <p>{{ eventText }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Events-item',
  props: ["eventText", "messages"],
}
</script>

<style>
.events {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: fit-content;
}

.messages {
  border-radius: 4px;
  -webkit-box-shadow: 0 1px 2px rgb(0 0 0 / 8%);
  box-shadow: 0 1px 2px rgb(0 0 0 / 8%);
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0px 8px;
  background-color: #fff;
  border: 1px solid #ddd;
  width: 100%;
  height: fit-content;
  line-height: 1rem;
}

</style>

<template>
  <div>
    <button @click="clickEvn">哈哈哈</button>
  </div>
</template>
<script>
  export default {
    name: "vueGridKeyfocus",
    data(){
      return {

      };
    },
    methods: {
      clickEvn(){
        console.log("这是点击事件")
        this.$emit("click");
      }
    }
  }

</script>

<template>
  <div id="app">
    <div v-gridkeyfocus="hhhh" :data-current="current3" data-prefix="table_">
      <table>
        <tr v-for="(item,index) in tbData" :key="item.id">
          <td><input v-model="item.text"  :ref="`table_${index}`" @focus="current3=`table_${index}[0]`"></td>
          <td><input v-model="item.text2" :ref="`table_${index}`" @focus="current3=`table_${index}[1]`"></td>
        </tr></table>
    </div>
  </div>
</template>

<script type="text/babel">
export default {
  name: 'app',
  data () {
    return {
      tbData:[{text:"",text2:"",id:1},{text:"",text2:"",id:2}],
      isPay: false,
      hhhh:false,
      current3:1
    }
  },
  mounted(){
    console.log("sss");
    setTimeout(()=>{
      console.log("sss");
      this.hhhh=!this.hhhh;
    },2000);
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

</style>

import vueGridKeyfocus from "./vue-grid-keyfocus.js";//导入表格快捷键组件
const gridKeyfocus = {
  install(Vue,options){
    Vue.directive("gridkeyfocus", vueGridKeyfocus);//自定义指令 v-keyfocus
  }
};
if(typeof  window !== 'undefined' && window.Vue){
  window.Vue.use(gridKeyfocus);//会自动执行 install方法
}
export default gridKeyfocus;//导出
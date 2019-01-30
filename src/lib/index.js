import vueGridKeyfocus from "./vue-grid-keyfocus.vue";//导入表格快捷键组件
const gridKeyfocus = {
  install(Vue,options){
    debugger
    Vue.component(vueGridKeyfocus.name, vueGridKeyfocus);
  }
};
if(typeof  window !== 'undefined' && window.Vue){
  window.Vue.use(gridKeyfocus);//会自动执行 install方法
}
export default gridKeyfocus;//导出
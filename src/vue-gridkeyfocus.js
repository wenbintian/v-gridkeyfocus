/**
 * Created by tianwenbin on 2019/1/30.
 */

export default {

  bind(el,binding,vnode){
    el.setAttribute('tabindex',-1);//给tabindex设置-1

    let keyRefs = getKeyRefs(el,vnode);

    //el节点上绑定的所有事件
    const onEvn = vnode.data.attrs;

    let onBeforeNext,onAfterNext,onBeforePrev,onAfterPrev;
    //将生成好的keyRefs帮到属性 keyrefs上
    el.setAttribute('keyrefs',JSON.stringify(keyRefs));
    if(onEvn){
      onBeforeNext = onEvn['before-next'];//顺向快捷键执行之前事件回调
      onAfterNext = onEvn['after-next'];//顺向快捷键执行之后事件回调
      onBeforePrev = onEvn['before-prev'];//逆向快捷键执行之前事件回调
      onAfterPrev = onEvn['after-prev'];//逆向快捷键执行之后事件回调
    }
    on(el,'keydown',function(e){
      //阻止默认 tab/enter/up/down
      if(e.keyCode==9 || e.keyCode==13 || e.keyCode == 38 || e.keyCode == 40){
        e.stopPropagation();
        e.preventDefault();
      }
    });
    on(el,'keyup',function(e){
      var keyCode = e.keyCode;

      //解决两个表格快捷键嵌套使用造成的混乱bug
      if(keyCode==9 || keyCode==13 || keyCode == 38 || keyCode == 40 || (e.ctrlKey && (keyCode == 9 || keyCode == 13))){
        e.stopPropagation();
      }
      //组合键 ctrl+tab / ctrl+enter
      if(e.ctrlKey && (keyCode == 9 || keyCode == 13)){
        tabEnterFn(el,vnode,"prev",function(curVm,theVm){
          let nowRowData = JSON.parse(el.getAttribute("rowdata"));
          //定位前事件 若返回false 则返回
          if(isFunction(onBeforePrev) && onBeforePrev(curVm,theVm,nowRowData,e)===false) return;
          if(theVm==null) return; //没找到则返回
          //焦点定位
          focusToVm(vnode,theVm);
          //定位后事件
          isFunction(onAfterPrev) && onAfterPrev(theVm,nowRowData,e);
        });

      }else if(keyCode == 9 || keyCode == 13){//tab、enter
        tabEnterFn(el,vnode,"next",function(curVm,theVm){
          let nowRowData = JSON.parse(el.getAttribute("rowdata"));
          //定位前事件 若返回false 则返回
          if(isFunction(onBeforeNext) && onBeforeNext(curVm,theVm,nowRowData,e)===false) return;
          if(theVm==null) return; //没找到则返回
          //焦点定位
          focusToVm(vnode,theVm);
          //定位后事件
          isFunction(onAfterNext) && onAfterNext(theVm,nowRowData,e);
        });
      }else if(keyCode ==38){
        upDownFn(el,vnode,true,function(curVm,theVm){
          let nowRowData = JSON.parse(el.getAttribute("rowdata"));
          //定位前事件 若返回false 则返回 by lhn
          if(isFunction(onBeforePrev) && onBeforePrev(curVm,theVm,nowRowData,e)===false) return;
          if(theVm==null) return; //没找到则返回
          focusToVm(vnode,theVm);
          //定位后事件by lhn
          isFunction(onAfterPrev) && onAfterPrev(theVm,nowRowData,e);
        });
      }else if(keyCode == 40){//down
        upDownFn(el,vnode,false,function(curVm,theVm){
          let nowRowData = JSON.parse(el.getAttribute("rowdata"));
          //定位前事件 若返回false 则返回 by lhn
          if(isFunction(onBeforeNext) && onBeforeNext(curVm,theVm,nowRowData,e)===false) return;
          if(theVm==null) return; //没找到则返回
          focusToVm(vnode,theVm);
          //定位后事件by lhn
          isFunction(onAfterNext) && onAfterNext(theVm,nowRowData,e);
        });
      }
    });
  },
  //在组件更新完成之后做操作，才能是获得的vnode准确
  componentUpdated(el,{value,oldValue},vnode){
    let vmData = vnode.data;
    //设置行数据到属性 rowdata上
    if(vmData && vmData.attrs && vmData.attrs["data-rowdata"] !== undefined){
      el.setAttribute('rowdata',JSON.stringify(vmData.attrs["data-rowdata"]));
    }
    if(value == oldValue) return;  //没有改变就返回
    let keyRefs = getKeyRefs(el,vnode);
    el.setAttribute('keyrefs',JSON.stringify(keyRefs));
  },
  unbind(el){
    //解绑
    on(el,'keydown');
    on(el,'keyup');
  }
}

/**
 * 添加事件监听
 * @param element 要监听的元素
 * @param event 要监听的事件
 * @param handler 要执行的函数
 */
const on = (function () {
  if (document.addEventListener) {// 浏览器环境，且非IE9以下版本
    return function (element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false);
      }
    }
  } else {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.attachEvent("on" + event, handler);
      }
    }
  }
})();
/**
 * 移除事件监听
 * @param element 监听的元素
 * @param event 监听的事件
 * @param handler 执行的函数
 */
const off = (function () {
  if (document.removeEventListener) {// 浏览器环境，且非IE9以下版本
    return function (element, event, handler) {
      if (element && event) {
        element.removeEventListener(event, handler, false);
      }
    }
  } else {
    return function (element, event, handler) {
      if (element && event) {
        element.detachEvent("on" + event, handler);
      }
    }
  }
})();

/**
 * 焦点定位到某一个组件
 * @param nextVm  下一个需要定焦点的控件
 * @param vnode   容器的虚拟节点
 */
const focusToVm = function (vnode,nextVm) {
  vnode.context.$refs[nextVm.rowRefName][nextVm.colIndex].focus();
};

/**
 *
 * @param keyRefs
 * @param current
 * @returns {*}
 */
const getTheRef = function(keyRefs,current){
  let keyL = keyRefs.length;
  let curVm = null;
  let refObj = getRefObj(current);
  if(refObj === null) return null;
  for(let j=0; j<keyL; j++){
    let item = keyRefs[j];
    if(item.ref == refObj.rowRefName && refObj.colIndex>-1 && refObj.colIndex<item.cols){
      curVm = refObj;
      curVm.keyIndex = j;
      curVm.cols = item.cols;
      curVm.index=item.index;//by lhn
      curVm.nextIndex=j+1>=keyL?-1:keyRefs[j+1].index;//by lhn
      curVm.prevIndex=j-1<0?-1:keyRefs[j-1].index;//by lhn
      break;
    }
  }
  return curVm;
};
const getRefObj = function(current){
  // "["符号的前面字符串
  let rowRefName = current.match(/(\S*)\[/);
  rowRefName = rowRefName && rowRefName[1];
  // "["与"]"符号的之间的字符串
  let colIndex = current.match(/\[([0-9]*)\]/);
  colIndex = colIndex && colIndex[1];

  if(rowRefName === null || colIndex === null) return null;

  return {
    rowRefName:rowRefName,
    colIndex:parseInt(colIndex)
  }
};

/**
 * 对数组加一或减一的查找
 * @param keyRefs 快捷键的ref集合
 * @param curVm  当前焦点的vm
 * @param vnode 容器的虚拟节点
 * @param isNext 是否顺向查找 (next/prev)
 * @returns {*}
 */
const nextOrPrevToRef = function(keyRefs,curVm,vnode,isNext){
  let keyL = keyRefs.length;
  let theVm = Object.assign({},curVm);
  delete theVm.nextIndex;
  delete theVm.prevIndex;
  if(isNext==="next"){
    //当前个就是最后一个了
    if(curVm.colIndex+1 >= keyRefs[curVm.keyIndex].cols){
      //已经到达最后一行了
      if(curVm.keyIndex+1 >= keyL){
        return null;
      }else {
        let next=keyRefs[curVm.keyIndex+1];
        theVm.rowRefName = next.ref;
        theVm.cols = next.cols;
        theVm.colIndex = 0;
        theVm.keyIndex = curVm.keyIndex+1;
        theVm.index=next.index;//by lhn
      }
    }else {
      theVm.colIndex = curVm.colIndex+1;

    }

  }else {
    //当前个是在第一列了
    if(curVm.colIndex<=0){
      //已经到达第一行了
      if(curVm.keyIndex <= 0){
        return null;
      }else {
        let prev=keyRefs[curVm.keyIndex-1]
        theVm.rowRefName = prev.ref;
        theVm.cols = prev.cols;
        theVm.colIndex = prev.cols-1;
        theVm.keyIndex = curVm.keyIndex-1;
        theVm.index=prev.index;//by lhn
      }
    }else {
      theVm.colIndex = curVm.colIndex-1;
    }

  }
  if(getDisabledStatus(vnode,theVm)){
    theVm = nextOrPrevToRef(keyRefs,theVm,vnode,isNext);
  }
  return theVm;
};

/**
 * 判断某一组件是否可以编辑的状态
 * return true 代表不能编辑 return false 代表可以编辑
 * @param vnode     容器的虚拟节点
 * @param theVm   ref的名称
 * @returns {boolean}
 */
const getDisabledStatus = function(vnode,theVm){
  let rowRefs = vnode.context.$refs[theVm.rowRefName];
  if(!rowRefs || !rowRefs[theVm.colIndex]) return true;
  //若存在disabled属性 则也返回true
  let disabled = rowRefs[theVm.colIndex].getAttribute && rowRefs[theVm.colIndex].getAttribute("disabled");
  if(disabled) return true;
  let disStatus = rowRefs[theVm.colIndex].getDisabled;
  return (disStatus && disStatus()===true) ? true : false;
};

/**
 * 通过vnode的$refs 拼接keyRefs
 * @param el   用于获取前缀
 * @param vnode
 * @returns {Array}
 */
const getKeyRefs = function(el,vnode){
  let prefix = el.dataset.prefix || "keyRef_"; //前缀属性 默认前缀 keyRef
  let prefixL=prefix.length;
  let keyRefs=[];
  let refs = vnode.context.$refs;
  for(let key in refs){
    //匹配跟前缀prefix相同的属性
    if(refs.hasOwnProperty(key) && key.indexOf(prefix)===0 && refs[key].length){
      keyRefs.push({ref:key,cols:refs[key].length,index:parseInt(key.substring(prefixL))});
    }
  }
  keyRefs.sort(function(item,index,c){
    if(item.index < index.index){
      return -1;
    }else if(item.index > index.index){
      return 1;
    }else {
      return 0;
    }
  });
  return keyRefs;
};

//快捷键切换的方法tab/enter
const tabEnterFn = function(el,vnode,isNext,fn){
  let keyRefs = JSON.parse(el.getAttribute("keyRefs"));
  let current = el.dataset.current; //当前焦点聚集的ref名称；
  //找到当前焦点所在的vm (不可编辑时没有焦点的)
  let curVm = getTheRef(keyRefs,current);
  //若没有找到当前的 则返回null;
  if(curVm === null) return null;

  let theVm = nextOrPrevToRef(keyRefs,curVm,vnode,isNext);
  if(isFunction(fn)){
    fn(curVm,theVm);
  }
};
//快捷键切换的方法 up/down
const upDownFn = function(el,vnode,isUp=true,fn){
  let keyRefs = JSON.parse(el.getAttribute("keyRefs"));
  let current = el.dataset.current; //当前焦点聚集的ref名称；
  //找到当前焦点所在的vm (不可编辑时没有焦点的)
  let curVm = getTheRef(keyRefs,current);
  //若没有找到当前的 则返回null;
  if(curVm === null) return null;

  let theVm = upDownToRef(keyRefs,curVm,vnode,isUp);
  if(isFunction(fn)){
    fn(curVm,theVm);
  }
};

//快捷键切换的方法 up/down 获取上下行的组件
const upDownToRef = function(keyRefs,curVm,vnode,isUp=true){
  let keyL = keyRefs.length;
  let theVm = Object.assign({},curVm);//浅拷贝
  delete theVm.nextIndex;
  delete theVm.prevIndex;
  if(isUp){//up
    if(curVm.keyIndex<=0){//到达第一行
      return null;
    }else {
      let prev=keyRefs[curVm.keyIndex-1];
      //上一行没有那么多可以编辑的，则定位到上一行最后一个可以编辑的
      let theCol = curVm.colIndex>=prev.cols ? prev.cols - 1 : curVm.colIndex;
      theVm.rowRefName = prev.ref;
      theVm.cols = prev.cols;
      theVm.colIndex = theCol;
      theVm.keyIndex = curVm.keyIndex-1;
      theVm.index=prev.index;//by lhn
    }
  }else { //down
    if(curVm.keyIndex>=keyL-1){//到达可以编辑的最后一行
      return null;
    }else {
      let next=keyRefs[curVm.keyIndex+1]
      //上一行没有那么多可以编辑的，则定位到上一行最后一个可以编辑的
      let theCol = curVm.colIndex>=next.cols ? next.cols - 1 : curVm.colIndex;
      theVm.rowRefName = next.ref;
      theVm.cols = next.cols;
      theVm.colIndex = theCol;
      theVm.keyIndex = curVm.keyIndex+1;
      theVm.index=next.index;//by lhn
    }
  }
  if(getDisabledStatus(vnode,theVm)){// by lhn
    if(isUp){
      theVm = nextOrPrevToRef(keyRefs,curVm,vnode,"prev");
    }else{
      theVm = nextOrPrevToRef(keyRefs,theVm,vnode,"next");
    }

  }
  return theVm;
};

//判断是否是函数
const isFunction = function(fun){
  return typeof fun === "function";
}

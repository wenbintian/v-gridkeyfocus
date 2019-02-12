# keyfocus

> A grid keyfocus project by Vue.js(一项基于vue.js实现的表格快捷键组件)

## Installation

npm install vue-gridkeyfocus

## Usage

### 引入指令

 import Gridkeyfocus from 'vue-gridkeyfocus'
 Vue.use(Gridkeyfocus)

 <!-- OR -->
 <script src="../node_modules/vue/dist/vue.js"></script>
 <script src="../dist/vue-gridkeyfocus.js"></script>

### 限制
 for循环里面要被定位的组件必须有 focus方法，否则定位会没有效果；同时可以设置 disabled属性

## Example
[例子](https://github.com/wenbintian/vue-gridkeyfocus/blob/master/example/index.html)

      <h3>源码</h3>
      <div class="padding_class font_big">
        <pre><code>
          &lt;div class=&quot;padding_class&quot; v-gridkeyfocus=&quot;gridKeyFlag&quot; :data-current=&quot;current3&quot; data-prefix=&quot;table_&quot;&gt;
          &lt;table&gt;
          &lt;tr v-for=&quot;(item,index) in tbData&quot; :key=&quot;item.id&quot;&gt;
          &lt;td&gt;&lt;input v-model=&quot;item.text&quot;  :ref=&quot;&#x60;table_${index}&#x60;&quot; @focus=&quot;current3=&#x60;table_${index}[0]&#x60;&quot;&gt;&lt;/td&gt;
          &lt;td&gt;&lt;input v-model=&quot;item.text2&quot; :ref=&quot;&#x60;table_${index}&#x60;&quot; @focus=&quot;current3=&#x60;table_${index}[1]&#x60;&quot;&gt;&lt;/td&gt;
          &lt;/tr&gt;&lt;/table&gt;
          &lt;/div&gt;
          data() {
            return {
              tbData:[{text:"",text2:"",text3:"",text3Disabeld:false,id:1},{text:"",text2:"",text3:"",text3Disabeld:true,id:2},{text:"",text2:"",text3:"",text3Disabeld:false,id:3}],
              gridKeyFlag:false,
              current3:1
            }
          },
        </code></pre>
      </div>
      <h3>原理</h3>
      <div class="padding_class">
        <p>1：通过 v-gridkeyfocus 绑定了该节点的 keyup事件</p>
        <p>2：通过 data-current的值 确定当前焦点的位置，同时通过 focus()方法对下一个进行定位</p>
        <p>3：提供了定位前的一些方法，通过这些方法可以控制 要从哪里定位到哪里，自定义式的进行跳转（默认是按顺序进行的）</p>
        <p>4：可以设置 disabled 属性，控制要不要跳过当前控件的定位</p>
      </div>
      <h3>属性</h3>
      <div class="padding_class">
        <table width="100%">
          <thead>
          <tr>
            <th>参数</th><th>说明</th><th>类型</th><th>可选值</th><th>默认</th>
          </tr>
          </thead>
          <tbody>
          <tr><td>v-gridkeyfocus="gridKeyFlag"</td><td>用于更新表格快捷键的（比如表格添加行后）</td><td>Boolean</td><td>true/false</td><td>-</td></tr>
          <tr><td>data-prefix</td><td>用于拼接ref名称时的前缀，默认为'keyRef_'</td><td>string</td><td>-</td><td>'keyRef_'</td></tr>
          <tr><td>:data-current</td><td>当前焦点的位置(必填)</td><td>string</td><td>-</td><td>-</td></tr>
          <tr><td>:before-next</td><td>顺向定位之前事件(注意：阻止默认，必须返回false)</td><td>function。返回参数：1.current代表还没有定位前的焦点的位置,2.vm代表即将定位的组件的vm；3.rowdata当前行数据（只有设置:data-rowdata属性才有效）；4.e</td><td>-</td><td>-</td></tr>
          <tr><td>:after-next</td><td>顺向定位之后事件</td><td>function。返回参数：1.vm代表即将定位的组件的vm；2.rowdata当前行数据（只有设置:data-rowdata属性才有效）；3.e</td><td>-</td><td>-</td></tr>
          <tr><td>:before-prev</td><td>逆向定位之前事件(注意：阻止默认必须返回false)</td><td>function.返回参数：1.current代表还没有定位前的焦点的位置；2.vm代表即将定位的组件的vm；3.rowdata当前行数据（只有设置:data-rowdata属性才有效）；4.e</td><td>-</td><td>-</td></tr>
          <tr><td>:after-prev</td><td>逆向定位之后事件</td><td>function。返回参数：1.vm代表即将定位的组件的vm；2.rowdata当前行数据（只有设置:data-rowdata属性才有效）；3.e</td><td>-</td><td>-</td></tr>
          </tbody>
        </table>
      </div>
    </div>



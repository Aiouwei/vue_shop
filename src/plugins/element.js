import Vue from 'vue'
import { Button, Form, FormItem, Input, Message } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
// Vue.use(Message)
// 采用上面的方式会在刷新的时候出现一次提示
Vue.component(Message.name, Message)
Vue.prototype.$message = Message

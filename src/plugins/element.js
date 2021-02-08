import Vue from 'vue'
import {
  Button,
  Form,
  FormItem,
  Input,
  Message,
  Container,
  Header,
  Aside,
  Main,
  Menu,
  Submenu,
  MenuItemGroup,
  MenuItem,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Row,
  Col,
  Table,
  TableColumn,
  Switch,
  Tooltip,
  Pagination,
  Dialog,

  MessageBox,
  Tag,
  Tree,

  Select,
  Option,
  Cascader
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
// Vue.use(Message)
// 采用上面的方式会在刷新的时候出现一次提示
Vue.component(Message.name, Message)
Vue.prototype.$message = Message

Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)

Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)

Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)

Vue.use(Card)
Vue.use(Row)
Vue.use(Col)

Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)

Vue.use(Dialog)

// Vue.use(MessageBox)
// 采用上面的方式会在刷新的时候出现一次提示
Vue.component(MessageBox.name, MessageBox)
Vue.prototype.$confirm = MessageBox.confirm

Vue.use(Tag)
Vue.use(Tree)

Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)

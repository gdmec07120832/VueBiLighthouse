import Vue from 'vue'

import {
  ConfigProvider,
  Button,
  Modal,
  Tag,
  Breadcrumb,
  message,
  notification,
  Empty,
  Tree,
  TreeSelect,
  Result,
  Input,
  Icon,
  Dropdown,
  Menu,
  Divider,
  Table,
  Switch,
  Select,
  FormModel,
  Checkbox,
  DatePicker,
  Tabs,
  Spin,
  Row,
  Col,
  Transfer,
  Upload,
  Radio,
  Popconfirm,
  Tooltip,
  Cascader,     //2021-10-17增加联动选框
  Drawer,
  Pagination,
  Badge,
  Popover,  //2022-05-19
} from 'ant-design-vue'

import Space from 'ant-design-vue/es/space/index'
import 'ant-design-vue/es/space/style/index'

Vue.use(Modal)
Vue.component(Space.name, Space)
Vue.use(ConfigProvider)
Vue.use(Button)
Vue.use(Tree)
Vue.use(Empty)
Vue.use(TreeSelect)
Vue.use(Result)
Vue.use(Input)
Vue.use(Icon)
Vue.use(Dropdown)
Vue.use(Menu)
Vue.use(Divider)
Vue.use(Table)
Vue.use(Switch)
Vue.use(Select)
Vue.use(FormModel)
Vue.use(Checkbox)
Vue.use(DatePicker)
Vue.use(Tabs)
Vue.use(Spin)
Vue.use(Row)
Vue.use(Col)
Vue.use(Transfer)
Vue.use(Upload)
Vue.use(Radio)
Vue.use(Popconfirm)
Vue.use(Tooltip)
Vue.use(Breadcrumb)
Vue.use(Tag)
Vue.use(Cascader)
Vue.use(Pagination)
Vue.use(Badge)
Vue.use(Drawer)
Vue.use(Pagination)
Vue.use(Badge)
Vue.use(Popover)

Vue.prototype.$confirm = Modal.confirm
message.config({
  maxCount: 1
})
Vue.prototype.$message = message
Vue.prototype.$notification = notification
Vue.prototype.$info = Modal.info
Vue.prototype.$success = Modal.success
Vue.prototype.$error = Modal.error
Vue.prototype.$warning = Modal.warning

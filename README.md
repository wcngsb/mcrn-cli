<h3 align="center"><a href="https://github.com/meicai-fe/mcrn-cli">mcrn-cli</a></h3>

<div align="center">
一个 React Native 快速创建工具，自带一个基于Redux、React-Navigation 的模板 <br /> <br /> <br />
    
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/meicai-fe/mcrn-cli/blob/master/LICENSE)
[![npm version](https://img.shields.io/npm/v/mcrn-cli.svg)](https://www.npmjs.com/package/mcrn-cli)
[![NPM downloads](http://img.shields.io/npm/dm/mcrn.svg?style=flat-square)](https://www.npmtrends.com/mcrn)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/meicai-fe/mcrn-cli/pulls)
</div>


## 安装(Installation)
```shell
$ npm install -g mcrn-cli
```

## 使用(Usage)

```shell
$ mcrn init [工程名称]

# example：

$ mcrn init testProject

```

## 更强大的基础模板

目录结构如下:

```shell
$ tree .
|____android
|____ios
|____src
| |____util 
| |____config
| | |____app.json #app 常用配置
| | |____Env
| | | |____index.js  #环境变量
| | |____Navigator
| | | |____index.js #路由配置
| |____component
| |____reducer
| |____image 
| |____action #存放 的 action alias MCAction
| |____service #存放网络相关操作  alias MCService
| |____scene #存放页面代码  alias MCScene
| | |____MineScene 
| | |____LoginScene
| | |____TenantSwitch
| | |____LaunchScene
| | |____HomeScene 
| | |____index.js
|____index.js
```

  `src/config/app.json`
```js
{
  "name": "Supplier_app", // 项目名称 默认为 init 文件夹名称
  "initialRouteName":"LaunchScene",  // 路由初始页面
  "displayName": "Supplier_app",  // app名称
  "storageExpireTime": 2592000000,  // storage 缓存时长
  "autoCacheModule_prd":["UserAccount"], // 生产模式缓存 store 模块 dev 默认缓存所有
  "js_version": 1,  //当前 js 版本用于热更新
  "sentry_dsn": "https://xxx@spruce-sentry.stage.yunshanmeicai.com/77"  // sentry dsn
}
```

## REDUX

####  action
` path: src/action/index.js`


```js
export { default as UserAccount } from './UserAccount';
export { default as Loading } from './Loading';
export { default as PriceList } from './PriceList';
export { default as TenantList } from './TenantList';
```


##### Before use mcrn

```js
import actions from 'MCAction';
import { connect } from "react-redux";
import { bindActionCreator } from 'redux';

const { login } = actions.UserAccount;

class LoginScene extends Component {
    ...
}
const mapDispatchToProps = (dispatch) => {
  return {
      ...bindActionCreator(login, dispatch),
      dispatch
  };
}
export default connect(null, mapDispatchToProps)(LoginScene);
```

##### After use mcrn
```js
import actions from 'MCAction';
const { login } = actions.UserAccount;

@mconnect(null, {login})   #将 login 方法 map 进 props
export default class LoginScene extends Component {
```


#### reducer

` path: src/reducer/index.js # 替代combineReducer 操作 自动创建 store`

```js
export { default as UserAccount } from './UserAccount';
export { default as Loading } from './Loading';
export { default as PriceList } from './PriceList';
export { default as TenantList } from './TenantList';
```

##### Before use mcrn
```js
import { connect } from "react-redux";
class LoginScene extends Component {
    ...
}

const mapStateToProps = state => {
  return {
    UserAccount: state.UserAccount,
  };
};
export default connect(mapStateToProps, null)(LoginScene);
```
##### After use mcrn
```js

@mconnect({'UserAccount'})   #将 UserAccount  map 进 props
export default class LoginScene extends Component {
```


## Route

##### 路由配置
` src/scene/index.js`

```js
export { default as LaunchScene } from './LaunchScene';
export { default as HomeScene } from './HomeScene';
export { default as LoginScene } from './LoginScene';

//将个人中心页面配置进 stack 路由
export { default as MineScene } from './MineScene';
```

##### 使用

```js
import navigation from '@MCRN/navigation'

//重置路由堆栈
 navigation.resetRoute('routeName') 

//打开一个页面
 navigation.push('routeName') 

// 返回
 navigation.pop() 

...更多方法有待整理
```
### CACHE

&#160; &#160; &#160; &#160; 怎么去设计app 缓存功能对于多数开发者来说是个头疼的问题，从最基本的用户基础信息、认证信息的存储，到部分功能的离线浏览功能，怎么做到数据的缓存变更新等等一系列问题是构建一个新的功能模块都需要花费大量的时间精力设计考虑的事情，然而当你使用了mcrn  之后这些问题统统可以忽略。例如：当你想让用户模块具有缓存功能的时候只需要在app.json 中配置上如下字段，
```js
  "autoCacheModule_prd":["UserAccount"],
```

### TRACK
&#160; &#160; &#160; &#160;  mcrn  自带基于友盟的页面pv 追踪，便于分析产品功能受欢迎程度。

### DEBUG
####  更强大的Debug 模式

![Debug模式](https://upload-images.jianshu.io/upload_images/13829288-5e1a89db3d5e3418.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
&#160; &#160; &#160; &#160;我们Rect-Native 开发人员甚至不需要了解原生编译运行过程，只需要摇一摇手机 在`MCRN-BundleSetting`  里面选中设置开发服务 的 `ip` 和`端口号`即可。图例:`见上图2屏`

  &#160; &#160; &#160; &#160;切换开发环境也需痛苦的重新打包，只需点击环境选项并重启即可。图例:`见上图3屏`

### 更多模块功能开发中。。。


如果你想使用自己的模板也可以按照模板规范新建模板并上传至npm

注意:
1. 包名必须为 react-native-template-[你的模板名称]
2. 如果对原生工程有改动mcrn-cli 只支持采用cocoapods 来管理三方依赖

## 自定义模板使用

```shell
$ mcrn init testProject -t [你的模板名称]

# if a template like react-native-template-MyTemplate， example：

$ mcrn init testProject -t MyTemplate

```

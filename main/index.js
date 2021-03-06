const { app, BrowserWindow } = require('electron')
const autoLaunch = require('./autoLaunch.js') // 开机自启动
const checkForUpdates = require('./autoUpdater.js') // 检测是否有版本更新

const utils = require('./util.js')
const fs = require('fs')

const entryFiles = fs.readdirSync(utils.resolve('../renderer/window'))

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let winList = {}

function createWindow() {
  entryFiles.forEach((name) => {
    winList[name] = new BrowserWindow({ width: 800, height: 600 })
    if (process.env.NODE_ENV === 'development') {
      winList[name].loadURL(`http://localhost:8080/${name}.html`)
    } else {
      winList[name].loadFile(`dist/${name}.html`) //相对于项目根目录而加载的，所以不需要上一级
    }
    winList[name].webContents.openDevTools()
    winList[name].on('closed', () => {
      // 取消引用 window 对象，如果你的应用支持多窗口的话，
      // 通常会把多个 window 对象存放在一个数组里面，
      // 与此同时，你应该删除相应的元素。
      winList[name] = null
    })
  })
}

// Electron 会在初始化后并准备
// 创建浏览器窗口时，调用这个函数。
// 部分 API 在 ready 事件触发后才能使用。
app.on('ready', () => {
  createWindow()
  // autoLaunch()
  // checkForUpdates()
})

// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
  // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
  // 否则绝大部分应用及其菜单栏会保持激活。
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // 在macOS上，当单击dock图标并且没有其他窗口打开时，
  // 通常在应用程序中重新创建一个窗口。
  if (win === null) {
    createWindow()
  }
})
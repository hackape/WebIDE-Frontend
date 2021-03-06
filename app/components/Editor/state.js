import uniqueId from 'lodash/uniqueId'
import is from 'utils/is'
import assignProps from 'utils/assignProps'
import { observable, computed, action, autorun, toJS } from 'mobx'
import CodeMirror from 'codemirror'
import FileStore from 'commons/File/store'
import TabStore from 'components/Tab/store'
import overrideDefaultOptions from './codemirrorDefaultOptions'
import { loadMode } from './components/CodeEditor/addons/mode'
import { findModeByFile, findModeByMIME, findModeByName } from './components/CodeEditor/addons/mode/findMode'

const defaultOptions = { ...CodeMirror.defaults, ...overrideDefaultOptions }

const state = observable({
  entities: observable.map({}),
  options: observable.shallow(defaultOptions),
})

state.entities.observe((change) => {
  if (change.type === 'delete') {
    const editor = change.oldValue
    if (editor.dispose) editor.dispose()
  }
})

class Editor {
  constructor (props = {}) {
    this.id = props.id || uniqueId('editor_')
    state.entities.set(this.id, this)
    this.update(props)
    this.createCodeMirrorInstance()
  }

  createCodeMirrorInstance () {
    this.cmDOM = document.createElement('div')
    Object.assign(this.cmDOM.style, { width: '100%', height: '100%' })
    const cm = CodeMirror(this.cmDOM, this.options)
    this.cm = cm
    cm._editor = this

    this.dispose = autorun(() => {
      const options = Object.entries(this.options)
      options.forEach(([option, value]) => {
        if (this.cm.options[option] === value) return
        this.cm.setOption(option, value)
      })
    })

    // 1. set value
    cm.setValue(this.content)
    cm.setCursor(cm.posFromIndex(this.content.length))
    // 2. set mode
    const modeInfo = findModeByFile(this.file)
    if (modeInfo) {
      loadMode(modeInfo.mode).then(() => this.options.mode = modeInfo.mime)
    }
    // 3. sync cursor state to corresponding editor properties
    cm.on('cursorActivity', () => {
      this.selections = cm.getSelections()
      this.cursorPos = cm.getCursor()
    })
  }

  @observable selections = []
  @observable cursorPos = { line: 0, ch: 0 }

  setCursor (...args) {
    if (!args[0]) return
    const lineColExp = args[0]
    if (is.string(lineColExp) && lineColExp.startsWith(':')) {
      const [line = 0, ch = 0] = lineColExp.slice(1).split(':')
      args = [line, ch]
    }
    this.cm.setCursor(...args)
  }

  @computed get mode () {
    if (!this.options.mode) return 'Null'
    const modeInfo = findModeByMIME(this.options.mode)
    return modeInfo.name
  }

  setMode (mode) {
    const modeInfo = is.string(mode) ? findModeByName(mode) : mode
    this.options.mode = modeInfo.mime
  }

  @action update (props = {}) {
    // simple assignments
    assignProps(this, props, {
      tabId: String,
      filePath: String,
      gitBlame: Object,
    })
    if (props.revision) this.revision = props.revision
    // file
    if (!this.file && props.content) {
      this._content = props.content
    }
    if (props.cm instanceof CodeMirror) this.cm = props.cm
  }

  @observable _options = observable.map({})
  @computed get options () {
    const options = { ...state.options, ...this._options.toJS() }
    const self = this
    const descriptors = Object.entries(options).reduce((acc, [key, value]) => {
      acc[key] = {
        enumerable: true,
        get () { return value },
        set (v) { self._options.set(key, v) },
      }
      return acc
    }, {})
    return Object.defineProperties({}, descriptors)
  }
  set options (value) {
    this._options = observable.map(value)
  }

  @observable tabId = ''
  @computed get tab () { return TabStore.getTab(this.tabId) }

  @observable filePath = undefined
  @computed get file () { return FileStore.get(this.filePath) }

  @observable _content = ''
  @computed get content () {
    return this.file ? this.file.content : this._content
  }
  set content (v) { return this._content = v }

  @observable gitBlame = {
    show: false,
    data: observable.ref([]),
  }

  destroy () {
    this.dispose && this.dispose()
    state.entities.delete(this.id)
  }
}

export default state
export { state, Editor }

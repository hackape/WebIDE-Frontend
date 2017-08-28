import React, { Component, PropTypes } from 'react'
import { observer } from 'mobx-react'
import state from '../state'
import * as Modal from 'components/Modal/actions'
import i18n from 'utils/createI18n'

@observer
class Step2 extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { wizard } = state
    return (
      <div>
        <h1>
          插件项目
        </h1>
        <hr />
        <p>请输入项目信息</p>
        <hr />
        <h2>属性:</h2>
        <div className="form-horizontal">
          <div className="form-group">
            <label className="col-sm-3 control-label">ID</label>
            <div className="col-sm-9">
              <input type="text"
                className="form-control"
                id="inputStashName"
                onChange={e => {
                  wizard.properties.id = e.target.value
                  e.preventDefault()
                  e.stopPropagation()
                }}
                value={wizard.properties.id}
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="inputStashName" className="col-sm-3 control-label">版本</label>
            <div className="col-sm-9">
              <input type="text"
                className="form-control"
                id="inputStashName"
                value={wizard.properties.version}
                onChange={e => {
                  wizard.properties.version = e.target.value
                  e.preventDefault()
                  e.stopPropagation()
                }}
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="inputStashName" className="col-sm-3 control-label">名字</label>
            <div className="col-sm-9">
              <input type="text"
                className="form-control"
                id="inputStashName"
                value={wizard.properties.name}
                onChange={e => {
                  wizard.properties.name = e.target.value
                  e.preventDefault()
                  e.stopPropagation()
                }}
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="inputStashName" className="col-sm-3 control-label">第三方库</label>
            <div className="col-sm-9">
              <input type="text"
                className="form-control"
                id="inputStashName"
                value={wizard.properties.vendor}
                onChange={e => {
                  wizard.properties.vendor = e.target.value
                  e.preventDefault()
                  e.stopPropagation()
                }}
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="inputStashName" className="col-sm-3 control-label">环境</label>
            <div className="col-sm-9 checkbox-inline">
              {wizard.properties.environment}
            </div>
          </div>
          <hr />
          <h2>选项:</h2>
          <div className="form-group">
            <div className="col-sm-11  checkbox-inline">
              <label>
                <input type='checkbox'
                  onChange={e => {
                    wizard.properties.genActivator = !wizard.properties.genActivator
                  }}
                  checked={wizard.properties.genActivator}
                />
                生成 Activator, 一个用来控制插件生命周期的 Java 类
              </label>
            </div>
          </div>

          {wizard.properties.genActivator && <div className="form-group">
            <label htmlFor="inputStashName" className="col-sm-3 control-label">Activator</label>
            <div className="col-sm-9">
              <input type="text"
                className="form-control"
                id="inputStashName"
                value={wizard.properties.activator}
                onChange={e => {
                  wizard.properties.activator = e.target.value
                  e.preventDefault()
                  e.stopPropagation()
                }}
              />
            </div>
          </div>}

          <div className="form-group">
            <div className="col-sm-11  checkbox-inline">
              <label>
                <input type='checkbox'
                  onChange={e => {
                    wizard.properties.makeContributions = !wizard.properties.makeContributions
                  }}
                  checked={wizard.properties.makeContributions}
                />
                该插件会修改 UI
              </label>
            </div>
          </div>

        </div>
      </div>
    )
  }
}

export default Step2

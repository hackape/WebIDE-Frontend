import React, { Component } from 'react'
import testLog from '../../../static/test.log'
const testLogText = testLog.replace(/ /g, '&nbsp;').split('\n').map((item, key) => {
  return `<span key=${key}>${item}<br/></span>`
}).join('')

const testList = [
  {
    name: 'testEnvList',
    time: '306ms'
  },
  {
    name: 'testSaveWhenNewEnvIsEmpty',
    time: '78ms'
  },
  {
    name: 'testGetEnvId',
    time: '51ms'
  },
  {
    name: 'testSaveWhenNewEnvIsDefault',
    time: '29ms'
  },
  {
    name: 'testReset',
    time: '23ms'
  },
  {
    name: 'testStart',
    time: '30ms'
  },
  {
    name: 'testSave',
    time: '24ms'
  },
  {
    name: 'testSaveWhenNewEnvIdExceeds',
    time: '31ms'
  },
  {
    name: 'testConnect',
    time: '37ms'
  },
  {
    name: 'testSwitchTo',
    time: '32ms'
  }
]

class RunView extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showList: true,
      currentIndex: 0
    }
    this.handleRootClick = this.handleRootClick.bind(this)
  }
  render() {
    let rootStyle = 'fa fa-angle-right'
    if (this.state.showList) {
      rootStyle = 'fa fa-angle-down'
    }
    return (
      <div className='run-view'>
        <div className='left-tools-bar'>
          <i className='fa fa-play' aria-hidden='true'></i>
          <i className='fa fa-stop disabled' aria-hidden='true'></i>
        </div>
        <div className='main-view'>
          <div className='top-tools-bar'>
            <div className='icons'>
              <i className='fa fa-check-circle checked' aria-hidden='true'></i>
              <i className='fa fa-minus-square' aria-hidden='true'></i>
              <i className='fa fa-arrow-up' aria-hidden='true'></i>
              <i className='fa fa-arrow-down' aria-hidden='true'></i>
              <i className='fa fa-cog' aria-hidden='true'></i>
            </div>
            <div className='infos'>
              <div className='progress'>
                <div className='p_1'>
                  <div className='p_2' styles='width:80%;'></div>
                </div>
                <div className='info-1'>
                  All 14 tests passed
                  <label> - 806ms</label>
                </div>
              </div>
            </div>
          </div>
          <div className='logs-view'>
            <div className='logs-view-left'>
              <div className='test-list'>
                <div className='test-item test-root' onClick={this.handleRootClick}>
                  <i className={`${rootStyle}`} />
                  <i className='fa fa-check-circle' aria-hidden='true'></i>
                  <div className='test-name'>
                    ControllorTest (com.nriet)
                  </div>
                  <div className='test-time'>
                    806ms
                  </div>
                </div>
                {this.state.showList && this.renderTests()}
              </div>
            </div>
            <div className='logs-view-right'>
              <div className='logs-list' dangerouslySetInnerHTML={{
                __html: testLogText
              }}>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  handleRootClick () {
    this.setState({
      showList: !this.state.showList,
      currentIndex: 0
    })
  }
  renderTests () {
    return (<div className='test-list-container'>
      {testList.map((item, i) => (
        <div className='test-item'>
          <i className='fa fa-check-circle' aria-hidden='true'></i>
          <div className='test-name'>{item.name}</div>
          <div className='test-time'>{item.time}</div>
        </div>
      ))}
    </div>)
  }
}

export default RunView

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { initializeFileTree } from '../components/FileTree/actions'
import PanelsContainer from '../components/Panel'
import Utilities from './Utilities'

import api from '../backendAPI'
import config from '../config'
import dispatchCommand from '../commands/dispatchCommand'

class IDE extends Component {
  constructor (props) {
    super(props)
    this.state = { isReady: false }
  }

  componentWillMount () {  // initLifecycle_3: IDE specific init
    initializeFileTree() // @fixme: this is related to the quirk in filetree state
    this.setState({ isReady: true })
  }

  componentDidMount () {
    dispatchCommand('file:open_help')
  }

  render () {
    if (!this.state.isReady) return null
    return (
      <div className='ide-container'>
        <div className='workspace-list-header'>
          <div className='logo'></div>
          <div className='title'>插件研试平台</div>
        </div>
        <PanelsContainer />
        <Utilities />
      </div>
    )
  }
}

export default connect()(IDE)

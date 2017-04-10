import React, { Component, PropTypes } from 'react'
import cx from 'classnames'
import TabLabel from './TabLabel'
import Menu from 'components/Menu'
import ContextMenu from 'components/ContextMenu'

class TabBar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showDropdownMenu: false,
      showContextMenu: false,
      contextMenuPos: {},
      contextMenuContext: null,
    }
  }

  static propTypes = {
    tabGroup: PropTypes.object,
    contextMenuItems: PropTypes.array.isRequired,
    isDraggedOver: PropTypes.bool,
    addTab: PropTypes.func,
    closePane: PropTypes.func,
  }

  render () {
    const {
      tabGroup,
      contextMenuItems,
      addTab,
      closePane,
      isDraggedOver
    } = this.props
    return (
      <div id={`tab_bar_${tabGroup.id}`}
        className='tab-bar'
        data-droppable='TABBAR'
        onDoubleClick={addTab}
      >
        <ul className='tab-labels'>
          {tabGroup.tabs.map(tab =>
            <TabLabel tab={tab} key={tab.id} openContextMenu={this.openContextMenu} />
          )}
        </ul>
        {isDraggedOver ? <div className='tab-label-insert-pos'></div>: null}
        <div className='tab-add-btn' onClick={addTab} >
          <svg viewBox='0 0 12 16' version='1.1' aria-hidden='true'>
            <path fillRule='evenodd' d='M12 9H7v5H5V9H0V7h5V2h2v5h5z'></path>
          </svg>
        </div>
        <div className='tab-show-list'
          onClick={e => { e.stopPropagation(); this.setState({ showDropdownMenu: true }) }}
        >
          <i className='fa fa-sort-desc' />
          {this.renderDropdownMenu()}
        </div>
        <ContextMenu
          items={contextMenuItems}
          isActive={this.state.showContextMenu}
          pos={this.state.contextMenuPos}
          context={this.state.contextMenuContext}
          deactivate={() => this.setState({ showContextMenu: false })}
        />
      </div>
    )
  }

  openContextMenu = (e, context) => {
    e.stopPropagation()
    e.preventDefault()

    this.setState({
      showContextMenu: true,
      contextMenuPos: { x: e.clientX, y: e.clientY },
      contextMenuContext: context,
    })
  }

  renderDropdownMenu () {
    if (!this.state.showDropdownMenu) return null
    const dropdownMenuItems = this.makeDropdownMenuItems()
    if (!dropdownMenuItems.length) return null
    return <Menu className='top-down to-left'
      items={dropdownMenuItems}
      style={{ right: '2px' }}
      deactivate={e=>this.setState({ showDropdownMenu: false })}
    />

  }

  makeDropdownMenuItems = () => {
    let baseItems = this.props.tabGroup.siblings.length === 0 ? []
      : [{
        name: 'Close Pane',
        command: this.props.closePane,
      }]
    const tabs = this.props.tabGroup.tabs
    const tabLabelsItem = tabs && tabs.map(tab => ({
      name: tab.title || 'untitled',
      command: e => tab.activate(),
    }))

    if (tabLabelsItem.length) {
      if (!baseItems.length) return tabLabelsItem
      return baseItems.concat({ name: '-' }, tabLabelsItem)
    } else {
      return baseItems
    }
  }
}

export default TabBar
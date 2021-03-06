import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import Menu from '../Menu'
import menuBarItems from './menuBarItems'
import api from 'backendAPI'
import { isFunction } from 'utils/is'
import config from '../../config'
import { inject } from 'mobx-react'
import i18n from 'utils/createI18n'
import store from './store'
import { addComToMenuBar } from './actions'
import PluginArea from 'components/Plugins/component'

@inject(() => ({
  extensionRight: store.labels.values()
  .filter(label => label.position === 'right')
}))
class MenuBar extends Component {
  static propTypes = {
    items: PropTypes.oneOf(PropTypes.array, PropTypes.object)
  }

  constructor (props) {
    super(props)
    this.state = { activeItemIndex: -1 }
  }

  activateItemAtIndex = (index, isTogglingEnabled) => {
    if (isTogglingEnabled && this.state.activeItemIndex == index) {
      this.setState({ activeItemIndex: -1 })
    } else {
      this.setState({ activeItemIndex: index })
    }
  }

  handleSwitch = () => {
    api.switchVersion()
  }

  activatePrevMenuItem = () => {
    let nextIndex = this.state.activeItemIndex - 1
    if (nextIndex < 0) nextIndex = 0
    this.activateItemAtIndex(nextIndex)
  }

  activateNextMenuItem = () => {
    let nextIndex = this.state.activeItemIndex + 1
    if (nextIndex >= this.props.items.length) nextIndex = this.props.items.length - 1
    this.activateItemAtIndex(nextIndex)
  }

  render () {
    const { items, extensionRight } = this.props
    // console.log('plugin', extensionRight, store.views)
    // const { extensions }
    return (
      <div className='menu-bar-container'>
        <ul className='menu-bar'>
          { items.map((menuBarItem, i) =>
            <MenuBarItem item={menuBarItem}
              isActive={this.state.activeItemIndex == i}
              shouldHoverToggleActive={this.state.activeItemIndex > -1}
              toggleActive={this.activateItemAtIndex}
              key={`menu-bar-${menuBarItem.key}`}
              index={i}
              onOpen={menuBarItem.onOpen}
              activatePrevTopLevelMenuItem={this.activatePrevMenuItem}
              activateNextTopLevelMenuItem={this.activateNextMenuItem}
            />) }
        </ul>
        <PluginArea className='menu-bar-right' position='MenuBar.Widget' />
      </div>
    )
  }
}

class MenuBarItem extends Component {
  constructor (props) {
    super(props)
    this.state = { menuContext: {} }
  }

  componentWillReceiveProps (nextProps) {
    if (!this.props.isActive && nextProps.isActive) {
      const onOpen = isFunction(nextProps.onOpen) ? nextProps.onOpen : () => null
      const onOpenPromise = onOpen()
      if (onOpenPromise && isFunction(onOpenPromise.then)) {
        onOpenPromise.then(menuContext => this.setState({ menuContext }))
      }
    }
  }


  render () {
    const {
      item: menuBarItem,
      isActive, shouldHoverToggleActive,
      toggleActive, index,
      activatePrevTopLevelMenuItem,
      activateNextTopLevelMenuItem,
    } = this.props

    return (
      <li className={cx('menu-bar-item', menuBarItem.className)}>
        <div className={cx('menu-bar-item-container',
            { active: isActive }
          )}
          onClick={(e) => {
            e.stopPropagation()
            toggleActive(index, true)
          }}
          onMouseEnter={(e) => { if (shouldHoverToggleActive) toggleActive(index) }}
        >
          {menuBarItem.name}
        </div>
        {isActive ?
          <Menu
            items={menuBarItem.items}
            className={cx('top-down to-right', { active: isActive })}
            deactivate={toggleActive.bind(null, -1)}
            activatePrevTopLevelMenuItem={activatePrevTopLevelMenuItem}
            activateNextTopLevelMenuItem={activateNextTopLevelMenuItem}
            context={this.state.menuContext}
          />
        : null}
      </li>
    )
  }
}


export default MenuBar

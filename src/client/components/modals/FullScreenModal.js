import React, { Component } from 'react'
import './FullScreenModal.css'

class FullScreenModal extends Component {
  render() {
    const { onClose, headerText, closeIcon } = this.props
    return (
      <div className="fullscreen-modal-wrapper">
        <div className="fullscreen-modal-container">
          <div className="fullscreen-modal-header">
            <h3 className="fullscreen-modal-header-text">{headerText}</h3>
            <h3 className="fullscreen-modal-header-close" onClick={onClose}>
              {closeIcon}
            </h3>
          </div>
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default FullScreenModal

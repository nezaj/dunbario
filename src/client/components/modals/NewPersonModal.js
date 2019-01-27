import React, { Component } from 'react'
import './NewPersonModal.css'

import FullScreenModal from './FullScreenModal.js'

class NewPersonModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      errors: {},
    }
  }

  onSubmit = e => {
    e.preventDefault()
    const { onSubmitPersonModal } = this.props

    const personName = e.target.personName.value
    const personCategory = e.target.personCategory.value

    let errors = {}
    if (personName === '') {
      errors['name'] = 'Please enter a name'
    }
    if (personCategory === '') {
      errors['category'] = 'Please enter a category'
    }

    if (Object.keys(errors).length > 0) {
      this.setState({ errors })
    } else {
      onSubmitPersonModal({
        personName,
        personCategory,
      })
    }
  }

  render() {
    const { onClose } = this.props
    const { errors } = this.state
    return (
      <FullScreenModal
        key={'newPersonModal'}
        onClose={onClose}
        headerText={'Add a new person'}
        closeIcon={'X'}
      >
        <form className="person-modal-form" onSubmit={this.onSubmit}>
          {errors['name'] && (
            <div className="person-modal-error">{errors['name']}</div>
          )}
          <input
            className="person-input"
            type="text"
            name="personName"
            placeholder="Name..."
          />
          {errors['category'] && (
            <div className="person-modal-error">{errors['category']}</div>
          )}
          <input
            className="person-input"
            type="text"
            name="personCategory"
            placeholder="Category..."
          />
          <button type="submit" className="submit-new-person">
            Submit
          </button>
        </form>
      </FullScreenModal>
    )
  }
}

export default NewPersonModal

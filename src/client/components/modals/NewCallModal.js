import React, { Component } from 'react'

import { format } from 'date-fns'

import FullScreenModal from './FullScreenModal'
import './NewCallModal.css'

class NewCallModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      errors: {},
      dateValue: format(Date.now(), 'YYYY-MM-DD'),
      selectValue: '-1',
      contentValue: '',
    }
  }

  onSubmit = (e) => {
    e.preventDefault()
    const {onSubmitCallModal} = this.props

    const personID = e.target.personID.value
    const date = e.target.date.value
    const content = e.target.content.value

    let errors = {}
    if (personID === '-1') {errors['personID'] = 'Please select a person'}

    if (Object.keys(errors).length > 0) {
      this.setState({errors})
    } else {
      onSubmitCallModal({
        personID,
        date,
        content,
      })
    }
  }

  handleDateChange = (e) => {
    this.setState({dateValue: e.target.value})
  }

  handleSelectChange = (e) => {
    this.setState({selectValue: e.target.value})
  }

  handleContentChange = (e) => {
    this.setState({contentValue: e.target.value})
  }

  render() {
    const {contentValue, dateValue, selectValue, errors} = this.state;
    const {onClose, people} = this.props;
    return (
      <FullScreenModal
        key={'newCallModal'}
        onClose={onClose}
        headerText={'Log a new call'}
        closeIcon={'X'}
      >
        <form className="call-modal-form" onSubmit={this.onSubmit}>
          {
            errors['personID'] &&
            <div className="call-modal-error">{errors['personID']}</div>
          }
          <div className='call-label'>Who did you talk with?</div>
          <select
            className="call-input"
            name='personID'
            value={selectValue}
            onChange={this.handleSelectChange}>
            <option key='null-select' value={'-1'}></option>
            {people.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <div className='call-label'>When did you talk?</div>
          <input
            className="call-input"
            type='date'
            name='date'
            value={dateValue}
            onChange={this.handleDateChange}
          />
          <div className='call-label'>What did you talk about?</div>
          <textarea
            className="call-input"
            name='content'
            rows={8}
            value={contentValue}
            onChange={this.handleContentChange}
          />
          <button type="submit" className="submit-new-call">Submit</button>
        </form>
      </FullScreenModal>
    )
  }
}

export default NewCallModal

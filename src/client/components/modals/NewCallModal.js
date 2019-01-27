import React, { Component } from 'react'

import { format } from 'date-fns'

import FullScreenModal from './FullScreenModal'
import './CallModal.css'

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

  onSubmit = e => {
    e.preventDefault()
    const { onSubmitNewCall } = this.props

    const personID = e.target.personID.value

    // date input display values in UTC timezone but returns back timezone
    // adjusted value. So we add back in our timezone offset so that the value
    // of date matches what we selected in our form
    const _dirty = new Date(e.target.date.value)
    const date = new Date(_dirty.getTime() + _dirty.getTimezoneOffset() * 60000)
    // console.log('_dirty', _dirty)
    // console.log('date', date)

    const content = e.target.content.value

    let errors = {}
    if (personID === '-1') {
      errors['personID'] = 'Please select a person'
    }

    if (Object.keys(errors).length > 0) {
      this.setState({ errors })
    } else {
      onSubmitNewCall({
        personID,
        date,
        content,
      })
    }
  }

  handleDateChange = e => {
    this.setState({ dateValue: e.target.value })
  }

  handleSelectChange = e => {
    this.setState({ selectValue: e.target.value })
  }

  handleContentChange = e => {
    this.setState({ contentValue: e.target.value })
  }

  render() {
    const { contentValue, dateValue, selectValue, errors } = this.state
    const { onClose, peopleArr } = this.props
    return (
      <FullScreenModal
        key={'newCallModal'}
        onClose={onClose}
        headerText={'Log a new call'}
        closeIcon={'X'}
      >
        <form className="call-modal-form" onSubmit={this.onSubmit}>
          {errors['personID'] && (
            <div className="call-modal-error">{errors['personID']}</div>
          )}
          <div className="call-label">Who did you talk with?</div>
          <select
            className="call-input"
            name="personID"
            value={selectValue}
            onChange={this.handleSelectChange}
          >
            <option key="null-select" value={'-1'} />
            {peopleArr.map(p => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <div className="call-label">When did you talk?</div>
          <input
            className="call-input"
            type="date"
            name="date"
            value={dateValue}
            onChange={this.handleDateChange}
          />
          <div className="call-label">What did you talk about?</div>
          <textarea
            className="call-input"
            name="content"
            rows={8}
            value={contentValue}
            onChange={this.handleContentChange}
          />
          <button type="submit" className="submit-call-modal">
            Submit
          </button>
        </form>
      </FullScreenModal>
    )
  }
}

export default NewCallModal

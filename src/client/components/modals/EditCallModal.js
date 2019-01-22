import React, { Component } from 'react'

import { format } from 'date-fns'

import FullScreenModal from './FullScreenModal'
import { friendlyCall } from '../../utils'
import './CallModal.css'

class EditCallModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dateValue: format(props.call.date, 'YYYY-MM-DD'),
      contentValue: props.call.content,
    }
  }

  onSubmit = (e) => {
    e.preventDefault()
    const {onSubmitEditCall, call} = this.props
    const personID = call.personID

    // date input display values in UTC timezone but returns back timezone
    // adjusted value. So we add back in our timezone offset so that the value
    // of date matches what we selected in our form
    const _dirty = new Date(e.target.date.value)
    const date = new Date(_dirty.getTime() + _dirty.getTimezoneOffset() * 60000)
    // console.log('_dirty', _dirty)
    // console.log('date', date)

    const content = e.target.content.value
    const editedCall = {...call, date, content}
    onSubmitEditCall({personID, editedCall})
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
    const {contentValue, dateValue} = this.state;
    const {onClose, call} = this.props;
    const {personName, date} = call
    const friendlyDate = friendlyCall(date)
    return (
      <FullScreenModal
        key={'editCallModal'}
        onClose={onClose}
        headerText={`Edit Call`}
        closeIcon={'X'}
      >
        <h5 style={{'margin-bottom': '10px'}}>
          Edting call with {personName} from {friendlyDate}
        </h5>
        <form className="call-modal-form" onSubmit={this.onSubmit}>
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
          <button type="submit" className="submit-call-modal">Submit</button>
        </form>
      </FullScreenModal>
    )
  }
}

export default EditCallModal

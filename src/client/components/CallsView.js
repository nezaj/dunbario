import React, {Component} from 'react';
import './CallsView.css';
import { friendlyCall } from '../utils'

function renderEmptyCallsText(name, category) {
  return `Log some calls with ${name} (${category})`
}

function renderCallsHeader(name, category) {
  return `Calls with ${name} (${category})`
}

class CallsView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isEditingName: false,
      editName: props.person.name,
    }
  }

  startEdit = () => {
    this.setState({isEditingName: true})
  }

  onEditChange = (e) => {
    const editName = e.target.value
    this.setState({editName})
  }

  onSubmitEdit = (e) => {
    e.preventDefault()
    const {onEditPersonName, person} = this.props
    const newName = e.target.editName.value
    onEditPersonName(person.id, newName)
    this.setState({isEditingName: false})
  }

  render() {
    const {
      isVisible,
      person,
      onClickArchive, onClickCallEdit, onCallDelete
    } = this.props
    const {isEditingName, editName} = this.state
    const {name, category, calls} = person
    const renderedCalls = Object.values(calls)
      .sort((a, b) => b.date - a.date)
      .map(call =>
        <Call
          key={call.id}
          name={call.personName}
          date={call.date}
          content={call.content}
          onClickCallEdit={() => onClickCallEdit(call.id)}
          onCallDelete={() => onCallDelete(person.id, call.id)}
        />
      )

    return (
      <div
        className='calls-view-container'
        style={{'visibility': isVisible ? 'visible' : 'hidden'}}
      >
        {!isEditingName
          ?
            <div className='calls-view-header'>
              <h1>{renderCallsHeader(name, category)}</h1>
              <button
                className='edit-field edit-button'
                onClick={this.startEdit}>
                Edit
              </button>
            </div>
          :
            <div className="edit-form">
              <form onSubmit={this.onSubmitEdit}>
                <input
                  className='edit-field'
                  type="text"
                  name='editName'
                  value={editName}
                  onChange={this.onEditChange}>
                </input>
                <input
                  className='edit-field edit-button'
                  type="submit"
                  value="Confirm">
                </input>
              </form>
              <button
                className='edit-field edit-button'
                onClick={() => this.setState({isEditingName: false})}>
                Cancel
              </button>
            </div>
        }
        <div className='calls-container'>
          {renderedCalls.length > 0
            ? renderedCalls
            : <div className='empty-calls'>
                {renderEmptyCallsText(name, category)}
              </div>
          }
        </div>
        <button
          className='archive-person'
          onClick={() => onClickArchive(person.id)}>
          Archive Person
        </button>
      </div>
    )
  }
}

class Call extends Component {
  constructor(props) {
    super(props)
    this.state = {
      confirmDelete: false,
    }
  }

  hideConfirmDelete = () => {
    this.setState({confirmDelete: false})
  }

  displayConfirmDelete = () => {
    this.setState({confirmDelete: true})
  }

  render() {
    const {name, date, content, onCallDelete, onClickCallEdit} = this.props
    const {confirmDelete} = this.state
    return (
      <div className='call-container'>
        <div className='call-header' onMouseLeave={this.hideConfirmDelete}>
          <h3>Called {name} {friendlyCall(date)}</h3>
          <div className='call-buttons'>
            {!confirmDelete
              ?
                <>
                  <button
                    className='call-button'
                    onClick={this.displayConfirmDelete}>
                    Delete
                  </button>
                  <button
                    className='call-button'
                    onClick={onClickCallEdit}>
                    Edit
                  </button>
                </>
              :
                <>
                  <button
                    className='call-button confirm-delete-call-button'
                    onClick={onCallDelete}>
                    Confirm Delete
                  </button>
                  <button
                    className='call-button'
                    onClick={this.hideConfirmDelete}>
                    Cancel
                  </button>
                </>
            }
          </div>
        </div>
        <div className='call-content'>
          {content}
        </div>
      </div>
    )
  }
}

export default CallsView

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
    const {isVisible, person, calls, onClickArchive} = this.props
    const {isEditingName, editName} = this.state
    const {name, category} = person
    const renderedCalls = calls
      .sort((a, b) => b.date - a.date)
      .map(call =>
        <Call
          key={call.id}
          name={call.personName}
          date={call.date}
          content={call.content}
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

const Call = ({name, date, content}) => (
  <div className='call-container'>
    <h3 className='call-header'>Called {name} {friendlyCall(date)}</h3>
    <div className='call-content'>
      {content}
    </div>
  </div>
)

export default CallsView

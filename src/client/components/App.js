import React, { Component } from 'react';
import './App.css';

import PeopleView from './PeopleView'
import CallsView from './CallsView'
import { capitalize } from '../utils'

/* Generated Data */

let MAX_PERSON_ID = 0
let MAX_CALL_ID = 0

const mom = createPerson('Mom', '01/01/19', 'family')
const gary = createPerson('Gary', '01/03/19', 'family')
const stepan = createPerson('stepan', '12/26/18', 'friends')
const people = [mom, gary, stepan].sort((a, b) => a.lastCall - b.lastCall)

const momCall_1 = createCall(
  mom.id, mom.name, '12/26/18', 'Chill call, nothing special'
)
const momCall_2 = createCall(
  mom.id, mom.name, '12/29/18', 'Talked for an hour'
)
const momCall_3 = createCall(
  mom.id, mom.name, '01/01/19', 'New years chat!'
)

const calls = {
  [mom.id]: [momCall_1, momCall_2, momCall_3],
  [gary.id]: [],
  [stepan.id]: [],
}

/* Factory functions */

function createPerson(name, date, category) {
  return {
    id: ++MAX_PERSON_ID,
    name: capitalize(name),
    lastCall: new Date(date).getTime(),
    category: capitalize(category),
  }
}

function createCall(personID, personName, date, content) {
  return {
    id: ++MAX_CALL_ID,
    personID,
    personName,
    date: new Date(date),
    content,
  }
}

/* Helpers */

function getPerson(personID, people) {
  return people.find(p => p.id === personID)
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      displayNewPersonModal: false,
      callsVisible: false,
      displayID: 1,
    }
  }

  onClickPersonRow = (displayID) => {
    this.setState({callsVisible: true, displayID})
  }

  onClickNewPerson = () => {
    this.setState({displayNewPersonModal: true})
  }

  onClosePersonModal = () => {
    this.setState({displayNewPersonModal: false})
  }

  render() {
    const {displayID, displayNewPersonModal, callsVisible} = this.state
    const displayName = getPerson(displayID, people).name
    const displayCalls = calls[displayID]
    return (
      <div className="app-container">
        <div className="view-container">
          <PeopleView
            people={people}
            onClickPersonRow={this.onClickPersonRow}
            onClickNewPerson={this.onClickNewPerson}
          />
          <CallsView
            isVisible={callsVisible}
            name={displayName}
            calls={displayCalls}
          />
        </div>
        { displayNewPersonModal &&
          <NewPersonModal onClose={this.onClosePersonModal} />
        }
      </div>
    );
  }
}

class NewPersonModal extends Component {
  render() {
    const {onClose} = this.props;
    return (
      <div className="person-modal-wrapper">
        <div className="person-modal-container">
          <div className="person-modal-header">
            <h3 className="person-modal-header-text">
              Add a new person!
            </h3>
            <h3 className="person-modal-header-close" onClick={onClose}>
              X
            </h3>
          </div>
          <div className="person-modal-form">
            <input
              className="person-input"
              type="text"
              name="personName"
              placeholder="Name..."></input>
            <input
              className="person-input"
              type="text"
              name="personCategory"
              placeholder="Category..."></input>
            <input
              className="person-input"
              type="text"
              name="lastCall"
              placeholder="Last time called..."></input>
            <button className="submit-new-person">Submit</button>
          </div>
        </div>
      </div>
    )
  }
}

export default App;

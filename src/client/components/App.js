import React, { Component } from 'react';
import './App.css';

import PeopleView from './PeopleView'
import CallsView from './CallsView'
import { NewCallModal, NewPersonModal } from './modals'
import { CATEGORY_ORDER } from '../data'
import { capitalize } from '../utils'

/* Generated Data */
let MAX_PERSON_ID = 0
let MAX_CALL_ID = 0

const mom = createPerson('Mom', 'family')
const gary = createPerson('Gary', 'family')
const stepan = createPerson('stepan', 'friends')

const initialPeople = [mom, gary, stepan]
const initialArchive = []

const DEFAULT_CALL_CONTENT = 'No logged info on this call'
const DUMMY_PERSON = {calls: []}

// Add some intial calls
const momCall_1 = createCall(
  initialPeople, mom.id, '12/26/18', 'Chill call, nothing special'
)
const momCall_2 = createCall(
  initialPeople, mom.id, '12/29/18', 'Talked for an hour'
)
const momCall_3 = createCall(
  initialPeople, mom.id, '01/01/19', 'New years chat!'
)
mom.calls = [momCall_1, momCall_2, momCall_3]

/* Creators */
function getOrCreateCategory(name) {
  const clean = capitalize(name)
  if (!CATEGORY_ORDER[clean]) { CATEGORY_ORDER[clean] = Object.keys(CATEGORY_ORDER).length + 1 }
  return clean
}

function createPerson(name, category) {
  return {
    id: ++MAX_PERSON_ID,
    name: capitalize(name),
    category: getOrCreateCategory(category),
    calls: [],
  }
}

function createCall(people, personID, date, content) {
  const personName = getPerson(personID, people).name
  return {
    id: ++MAX_CALL_ID,
    personID,
    personName,
    date: (date && new Date(date)) || new Date(),
    content: content || DEFAULT_CALL_CONTENT,
  }
}

/* Updators */
function updatePeople(people, idx, updatedPerson) {
  return []
    .concat(people.slice(0, idx))
    .concat(updatedPerson)
    .concat(people.slice(idx + 1))
}

function updatePerson(person, options) {
  return {...person, ...options}
}

/* Deletors */
function archivePeople(people, personIdx) {
  return []
    .concat(people.slice(0, personIdx))
    .concat(people.slice(personIdx + 1))
}

/* Helpers */

function getPerson(personID, people) {
  return people.find(p => p.id === personID)
}

/* TODOS
 * (Handle loading/success/fail) Add enum for handling loading state on initial data fetch
*/

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      archived: initialArchive,
      people: initialPeople,
      displayNewPersonModal: false,
      displayNewCallModal: false,
      callsVisible: false,
      displayID: null,
    }
  }

  /* UI Handlers */

  onClickNewPerson = () => {
    this.setState({displayNewPersonModal: true})
  }

  onClickNewCall = () => {
    this.setState({displayNewCallModal: true})
  }

  onClosePersonModal = () => {
    this.setState({displayNewPersonModal: false})
  }

  onCloseCallModal = () => {
    this.setState({displayNewCallModal: false})
  }

  onClickPersonRow = (displayID) => {
    this.setState({callsVisible: true, displayID})
  }

  /* Actions */

  onArchive = (id) => {
    const {archived, people} = this.state
    const personIdx = people.map(p => p.id).indexOf(id)
    const person = people[personIdx]

    const newPeople = archivePeople(people, personIdx)

    this.setState({
      archived: archived.concat(person),
      callsVisible: false,
      displayID: null,
      people: newPeople,
    })
  }

  onEditPersonName = (id, newName) => {
    const {people} = this.state
    const idx = people.map(p => p.id).indexOf(id)
    const person = people[idx]

    const updatedPerson = updatePerson(person, {name: newName})
    const newPeople = updatePeople(people, idx, updatedPerson)

    this.setState({people: newPeople})
  }

  onSubmitPersonModal = ({personName, personCategory}) => {
    const {people} = this.state
    const newPerson = createPerson(personName, null, personCategory)
    this.setState({
      displayNewPersonModal: false,
      people: people.concat(newPerson),
    })
  }

  onSubmitCallModal = ({personID, date, content}) => {
    const {people} = this.state
    const personIdx = people.map(p => p.id).indexOf(parseInt(personID))
    const person = people[personIdx]

    const newCall = createCall(people, person.id, date, content)
    const updatedPerson = updatePerson(
      person,
      {
        calls: person.calls.concat(newCall),
      }
    )
    const updatedPeople = updatePeople(people, personIdx, updatedPerson)

    this.setState({
      people: updatedPeople,
      displayNewCallModal: false,
    })
  }

  onCallDelete = (personID, callID) => {
    const {people} = this.state
    const personIdx = people.map(p => p.id).indexOf(parseInt(personID))
    const person = people[personIdx]
    const callIdx = person.calls.map(c => c.id).indexOf(parseInt(callID))

    // remove call from personCalls
    const newCalls = []
      .concat(person.calls.slice(0, callIdx))
      .concat(person.calls.slice(callIdx + 1))

    // update person
    const updatedPerson = updatePerson(person, {calls: newCalls})
    const updatedPeople = updatePeople(people, personIdx, updatedPerson)

    this.setState({
      displayDeleteCallModal: false,
      people: updatedPeople,
    })
  }

  render() {
    const {
      callsVisible,
      displayID, displayNewPersonModal, displayNewCallModal,
      people
    } = this.state
    const displayedPerson = getPerson(displayID, people) || DUMMY_PERSON
    return (
      <div className="app-container">
        <button
          className="log-call"
          onClick={this.onClickNewCall}
        >
          + Log Call
        </button>
        <div className="view-container">
          <PeopleView
            people={people}
            onClickNewPerson={this.onClickNewPerson}
            onClickPersonRow={this.onClickPersonRow}
          />
          <CallsView
            key={displayID}
            isVisible={callsVisible}
            person={displayedPerson}
            onClickArchive={this.onArchive}
            onEditPersonName={this.onEditPersonName}
            onCallDelete={this.onCallDelete}
          />
        </div>
        { displayNewCallModal &&
          <NewCallModal
            onSubmitCallModal={this.onSubmitCallModal}
            onClose={this.onCloseCallModal}
            people={people}
          />
        }
        { displayNewPersonModal &&
          <NewPersonModal
            onSubmitPersonModal={this.onSubmitPersonModal}
            onClose={this.onClosePersonModal}
          />
        }
      </div>
    );
  }
}

export default App

export {
  CATEGORY_ORDER
}

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

const mom = createPerson('Mom', '01/01/19', 'family')
const gary = createPerson('Gary', null, 'family')
const stepan = createPerson('stepan', '12/26/18', 'friends')

const initialPeople = [mom, gary, stepan]
const initialArchive = []

const DEFAULT_CALL_CONTENT = 'No logged info on this call'

const momCall_1 = createCall(
  mom.id, mom.name, '12/26/18', 'Chill call, nothing special'
)
const momCall_2 = createCall(
  mom.id, mom.name, '12/29/18', 'Talked for an hour'
)
const momCall_3 = createCall(
  mom.id, mom.name, '01/01/19', 'New years chat!'
)

const initialCalls = {
  [mom.id]: [momCall_1, momCall_2, momCall_3],
  [gary.id]: [],
  [stepan.id]: [],
}

/* Creators */
function getOrCreateCategory(name) {
  const clean = capitalize(name)
  if (!CATEGORY_ORDER[clean]) { CATEGORY_ORDER[clean] = Object.keys(CATEGORY_ORDER).length + 1 }
  return clean
}

function createPerson(name, date, category) {
  return {
    id: ++MAX_PERSON_ID,
    name: capitalize(name),
    lastCall: date ? new Date(date).getTime() : null,
    category: getOrCreateCategory(category),
  }
}

function createCall(personID, personName, date, content) {
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

function updateCalls(calls, options) {
  return {...calls, ...options}
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
      calls: initialCalls,
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
    const {calls, people} = this.state

    const newPerson = createPerson(personName, null, personCategory)

    this.setState({
      displayNewPersonModal: false,
      people: people.concat(newPerson),
      calls: {...calls, [newPerson.id]: []},
    })
  }

  onSubmitCallModal = ({personID, date, content}) => {
    const {calls, people} = this.state
    const personIdx = people.map(p => p.id).indexOf(parseInt(personID))
    const person = people[personIdx]

    // update calls
    const newCall = createCall(person.id, person.name, date, content)
    const newPersonCalls = calls[person.id].concat(newCall)
    const newCalls = updateCalls(calls, {[person.id]: newPersonCalls})

    // update lastCall on person
    const updatedPerson = updatePerson(
      person,
      {lastCall: new Date(date).getTime()}
    )
    const updatedPeople = updatePeople(people, personIdx, updatedPerson)

    this.setState({
      people: updatedPeople,
      displayNewCallModal: false,
      calls: newCalls,
    })
  }

  onCallDelete = (personID, callID) => {
    const {calls, people} = this.state
    const personIdx = people.map(p => p.id).indexOf(parseInt(personID))
    const person = people[personIdx]
    const personCalls = calls[person.id]
    const callIdx = personCalls.map(c => c.id).indexOf(parseInt(callID))

    // remove call from personCalls
    const newPersonCalls = []
      .concat(personCalls.slice(0, callIdx))
      .concat(personCalls.slice(callIdx + 1))
    const newCalls = updateCalls(calls, {[person.id]: newPersonCalls})

    // update lastCall on person
    const lastCall = newPersonCalls[0]
      ? newPersonCalls[0].date
      : null
    const updatedPerson = updatePerson(person, {lastCall})
    const updatedPeople = updatePeople(people, personIdx, updatedPerson)

    this.setState({
      displayDeleteCallModal: false,
      calls: newCalls,
      people: updatedPeople,
    })
  }

  render() {
    const {
      calls, callsVisible,
      displayID, displayNewPersonModal, displayNewCallModal,
      people
    } = this.state
    const displayedPerson = getPerson(displayID, people) || {}
    const displayedCalls = calls[displayID] || []
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
            calls={displayedCalls}
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

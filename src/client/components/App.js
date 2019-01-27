// @format
import React, { Component } from 'react'
import './App.css'

import PeopleView from './PeopleView'
import CallsView from './CallsView'
import { NewCallModal, EditCallModal, NewPersonModal } from './modals'
import { CATEGORY_ORDER } from '../data'
import { capitalize } from '../utils'

/* Generated Data */
let MAX_PERSON_ID = 0
let MAX_CALL_ID = 0

// Create some people
const mom = createPerson('Mom', 'family')
const gary = createPerson('Gary', 'family')
const stepan = createPerson('stepan', 'friends')
const initialPeople = [mom, gary, stepan].reduce((obj, p) => {
  obj[p.id] = p
  return obj
}, {})

// Create some calls
const momCall_1 = createCall(
  initialPeople,
  mom.id,
  new Date('12/26/18'),
  'Chill call, nothing special'
)
const momCall_2 = createCall(
  initialPeople,
  mom.id,
  new Date('12/29/18'),
  'Talked for an hour'
)
const momCall_3 = createCall(
  initialPeople,
  mom.id,
  new Date('01/01/19'),
  'New years chat!'
)
mom.calls = [momCall_1, momCall_2, momCall_3].reduce((obj, c) => {
  obj[c.id] = c
  return obj
}, {})

// Store it all
const initialData = {
  people: initialPeople,
  archive: {},
}

/* Defaults */
const DEFAULT_CALL_CONTENT = 'No logged info on this call'
const DUMMY_PERSON = { calls: {} }

/* Creators */
function getOrCreateCategory(name) {
  const clean = capitalize(name)
  if (!CATEGORY_ORDER[clean]) {
    CATEGORY_ORDER[clean] = Object.keys(CATEGORY_ORDER).length + 1
  }
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
  const personName = getPerson(people, personID).name
  return {
    id: ++MAX_CALL_ID,
    personID,
    personName,
    date,
    content: content || DEFAULT_CALL_CONTENT,
  }
}

/* Updators */
function updateArchive(archive, updatedPerson) {
  return { ...archive, [updatedPerson.id]: updatedPerson }
}

function updatePeople(people, updatedPerson) {
  return { ...people, [updatedPerson.id]: updatedPerson }
}

function updatePerson(person, options) {
  return { ...person, ...options }
}

function updateCalls(calls, updatedCall) {
  return { ...calls, [updatedCall.id]: updatedCall }
}

/* Deletors */
function archivePeople(people, personID) {
  const clone = { ...people }
  delete clone[personID]
  return clone
}

function deleteCall(calls, callID) {
  const clone = { ...calls }
  delete clone[callID]
  return clone
}

/* Helpers */
function getPerson(people, personID) {
  return people[personID]
}

function getCall(people, personID, callID) {
  return people[personID].calls[callID]
}

/* TODOS
 * (Handle loading/success/fail) Add enum for handling loading state on initial data fetch
 */

class App extends Component {
  constructor(props) {
    super(props)
    const { people, archive } = initialData
    this.state = {
      people,
      archive,
      displayNewPersonModal: false,
      displayNewCallModal: false,
      callsVisible: false,
      displayID: null,
      editCallID: null,
    }
  }

  /* UI Handlers */

  onClickNewPerson = () => {
    this.setState({ displayNewPersonModal: true })
  }

  onClickNewCall = () => {
    this.setState({ displayNewCallModal: true })
  }

  onClosePersonModal = () => {
    this.setState({ displayNewPersonModal: false })
  }

  onCloseCallModal = () => {
    this.setState({ displayNewCallModal: false })
  }

  onCloseEditCall = () => {
    this.setState({ editCallID: null })
  }

  onClickPersonRow = displayID => {
    this.setState({ callsVisible: true, displayID })
  }

  onClickCallEdit = editCallID => {
    this.setState({ editCallID })
  }

  /* Actions */

  onArchive = personID => {
    const { archive, people } = this.state

    const person = people[personID]
    const newPeople = archivePeople(people, personID)
    const newArchive = updateArchive(archive, person)

    this.setState({
      archive: newArchive,
      callsVisible: false,
      displayID: null,
      people: newPeople,
    })
  }

  onEditPersonName = (personID, newName) => {
    const { people } = this.state

    const person = people[personID]
    const updatedPerson = updatePerson(person, { name: newName })
    const newPeople = updatePeople(people, updatedPerson)

    this.setState({ people: newPeople })
  }

  onSubmitPersonModal = ({ personName, personCategory }) => {
    const { people } = this.state
    const newPerson = createPerson(personName, personCategory)
    const newPeople = updatePeople(people, newPerson)
    this.setState({
      displayNewPersonModal: false,
      people: newPeople,
    })
  }

  onSubmitNewCall = ({ personID, date, content }) => {
    const { people } = this.state

    const person = getPerson(people, personID)
    const newCall = createCall(people, person.id, date, content)
    const calls = updateCalls(person.calls, newCall)
    const updatedPerson = updatePerson(person, { calls })
    const updatedPeople = updatePeople(people, updatedPerson)

    this.setState({
      people: updatedPeople,
      displayNewCallModal: false,
    })
  }

  onSubmitEditCall = ({ personID, editedCall }) => {
    const { people } = this.state

    const person = getPerson(people, personID)
    const calls = updateCalls(person.calls, editedCall)
    const updatedPerson = updatePerson(person, { calls })
    const updatedPeople = updatePeople(people, updatedPerson)

    this.setState({
      people: updatedPeople,
      editCallID: null,
    })
  }

  onCallDelete = (personID, callID) => {
    const { people } = this.state

    const person = getPerson(people, personID)
    const calls = deleteCall(person.calls, callID)
    const updatedPerson = updatePerson(person, { calls })
    const updatedPeople = updatePeople(people, updatedPerson)

    this.setState({
      displayDeleteCallModal: false,
      people: updatedPeople,
    })
  }

  render() {
    const {
      callsVisible,
      displayNewPersonModal,
      displayNewCallModal,
      displayID,
      editCallID,
      people,
    } = this.state

    const peopleArr = Object.values(people)
    const displayedPerson = getPerson(people, displayID) || DUMMY_PERSON
    return (
      <div className="app-container">
        <button className="log-call" onClick={this.onClickNewCall}>
          + Log Call
        </button>
        <div className="view-container">
          <PeopleView
            peopleArr={peopleArr}
            onClickNewPerson={this.onClickNewPerson}
            onClickPersonRow={this.onClickPersonRow}
          />
          <CallsView
            key={displayID}
            isVisible={callsVisible}
            person={displayedPerson}
            onClickArchive={this.onArchive}
            onEditPersonName={this.onEditPersonName}
            onClickCallEdit={this.onClickCallEdit}
            onCallDelete={this.onCallDelete}
          />
        </div>
        {displayNewCallModal && (
          <NewCallModal
            peopleArr={peopleArr}
            onSubmitNewCall={this.onSubmitNewCall}
            onClose={this.onCloseCallModal}
          />
        )}
        {editCallID && (
          <EditCallModal
            call={getCall(people, displayID, editCallID)}
            onSubmitEditCall={this.onSubmitEditCall}
            onClose={this.onCloseEditCall}
          />
        )}
        {displayNewPersonModal && (
          <NewPersonModal
            onSubmitPersonModal={this.onSubmitPersonModal}
            onClose={this.onClosePersonModal}
          />
        )}
      </div>
    )
  }
}

export default App

export { CATEGORY_ORDER }

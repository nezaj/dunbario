import React, { Component } from 'react';
import './App.css';

import PeopleView from './PeopleView'
import CallsView from './CallsView'
import NewPersonModal from './NewPersonModal'
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

/* Factory functions */
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
    date: new Date(date),
    content,
  }
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
      callsVisible: false,
      displayID: null,
    }
  }

  onClickPersonRow = (displayID) => {
    this.setState({callsVisible: true, displayID})
  }

  onClickNewPerson = () => {
    this.setState({displayNewPersonModal: true})
  }

  onArchive = (id) => {
    const {archived, people} = this.state
    const idx = people.map(p => p.id).indexOf(id)
    const person = this.state[idx]

    this.setState({
      archived: archived.concat(person),
      callsVisible: false,
      displayID: null,
      people: people.slice(0, idx).concat(people.slice(idx + 1))
    })
  }

  onEditPersonName = (id, newName) => {
    const {people} = this.state
    const idx = people.map(p => p.id).indexOf(id)
    const person = people[idx]
    const edited = {...person, name: newName}
    this.setState({
      people: people.slice(0, idx)
        .concat(edited)
        .concat(people.slice(idx + 1))
    })
  }

  onClosePersonModal = () => {
    this.setState({displayNewPersonModal: false})
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

  render() {
    const {
      calls, callsVisible,
      displayID, displayNewPersonModal,
      people
    } = this.state
    const displayedPerson = getPerson(displayID, people) || {}
    const displayedCalls = calls[displayID] || []
    return (
      <div className="app-container">
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
          />
        </div>
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

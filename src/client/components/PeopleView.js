import React from 'react'
import './PeopleView.css'

import { CATEGORY_ORDER } from '../data'
import { friendlyCall } from '../utils'

const NO_CALLS_TEXT = 'N/A'

/* Helpers */

function categorySort(a, b) {
  const catA = CATEGORY_ORDER[a]
  const catB = CATEGORY_ORDER[b]
  if (catA == null || catB == null) {
    throw Error('Unexpected category!')
  }
  return catA - catB
}

function groupByOrderedCategory(data) {
  const grouped = data.reduce((cats, item) => {
    const c = item.category
    cats[c] = cats[c] || []
    cats[c].push(item)
    return cats
  }, {})

  return Object.keys(grouped)
    .sort(categorySort)
    .map(cat => [cat, grouped[cat]])
}

function getLastCall(callsMap) {
  const clone = { ...callsMap }
  const calls = Object.values(clone)
  const last = calls.sort((a, b) => b.date.getTime() - a.date.getTime())[0]
  return (last && last.date) || null
}

/* Components */

const PeopleView = ({ peopleArr, onClickPersonRow, onClickNewPerson }) => {
  // We display people in the order:
  // least recently contacted -> most recently contacted
  const sortedPeople = peopleArr
    .map(p => {
      const clone = { ...p }
      clone.lastCall = getLastCall(clone.calls)
      return clone
    })
    .sort((a, b) => a.lastCall - b.lastCall)
  const grouped = groupByOrderedCategory(sortedPeople)
  const categories = grouped.map(([category, categoryPeople], idx) => (
    <CategoryPeople
      key={idx}
      category={category}
      people={categoryPeople}
      onClickPersonRow={onClickPersonRow}
    />
  ))

  return (
    <div className="people-view-container">
      {categories}
      <button className="new-person" onClick={onClickNewPerson}>
        + Add New Person
      </button>
    </div>
  )
}

const CategoryPeople = ({ category, people, onClickPersonRow }) => {
  const rows = people.map(person => (
    <PersonRow
      key={person.id}
      onClickRow={() => onClickPersonRow(person.id)}
      name={person.name}
      lastCall={person.lastCall}
    />
  ))

  return (
    people.length > 0 && (
      <div className="category-container">
        <h1 className="category-header">{category}</h1>
        <div className="people-container">{rows}</div>
      </div>
    )
  )
}

const PersonRow = ({ name, lastCall, onClickRow }) => {
  return (
    <div className="person-row-container" onClick={onClickRow}>
      <div className="person-name">{name}</div>
      <div className="person-last-call">
        {lastCall ? friendlyCall(lastCall) : NO_CALLS_TEXT}
      </div>
    </div>
  )
}

export default PeopleView

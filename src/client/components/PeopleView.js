import React from 'react';
import './PeopleView.css';

import { friendlyCall } from '../utils'

const CATEGORY_ORDER = {
  'Family': 1,
  'Friends': 2,
}

/* Helpers */

function categorySort(a, b) {
  const catA = CATEGORY_ORDER[a]
  const catB = CATEGORY_ORDER[b]
  if (catA == null || catB == null) { throw Error('Unexpected category!') }
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
    .map(cat => [ cat, grouped[cat] ])
}

/* Components */

const PeopleView = ({people, onClickPersonRow, onClickNewPerson}) => {
  const grouped = groupByOrderedCategory(people)
  const categories = grouped
    .map(([category, categoryPeople], idx) =>
      <CategoryPeople
        key={idx}
        category={category}
        people={categoryPeople}
        onClickPersonRow={onClickPersonRow}
      />
    )
  return (
    <div className="people-view-container">
      {categories}
      <button className="new-person" onClick={onClickNewPerson}>
        Add New Person
      </button>
    </div>
  )
}

const CategoryPeople = ({category, people, onClickPersonRow}) => {
  const rows = people
    .map(person =>
      <PersonRow
        key={person.id}
        onClick={() => onClickPersonRow(person.id)}
        name={person.name}
        lastCall={person.lastCall}
      />
    )

  return (
    <div className='category-container'>
      <h1 className='category-header'>{category}</h1>
      <div className='people-container'>{rows}</div>
    </div>
  )
}

const PersonRow = ({name, lastCall, onClick}) => (
  <div className='person-row-container' onClick={onClick}>
    <div className='person-name'>{name}</div>
    <div className='person-last-call'>
      {friendlyCall(lastCall)}
    </div>
  </div>
)

export default PeopleView

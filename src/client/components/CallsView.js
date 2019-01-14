import React from 'react';
import './CallsView.css';
import { friendlyCall } from '../utils'

function renderEmptyCallsText(name, category) {
  return `Log some calls with ${name} (${category})`
}

function renderCallsHeader(name, category) {
  return `Calls with ${name} (${category})`
}

const CallsView = ({isVisible, name, category, calls}) => {
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
      <h1 className='calls-view-header'>{renderCallsHeader(name, category)}</h1>
      <div className='calls-container'>
        {renderedCalls.length > 0
          ? renderedCalls
          : <div className='empty-calls'>
              {renderEmptyCallsText(name, category)}
            </div>
        }
      </div>
    </div>
  )
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

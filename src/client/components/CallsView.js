import React from 'react';
import './CallsView.css';

import { friendlyCall } from '../utils'

const CallsView = ({isVisible, name, calls}) => {
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
      <h1 className='calls-view-header'>Calls with {name}</h1>
      <div className='calls-container'>
        {renderedCalls.length > 0
          ? renderedCalls
          : <div className='empty-calls'>
              Log some calls with your loved one!
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

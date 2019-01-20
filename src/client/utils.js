/* Collection of util functions used throughout the project */
import { differenceInDays } from 'date-fns'

// Returns a date object representing today's date w/o any aditional timestamp info
function today() {
  const dateStr = new Date().toISOString().split('T')[0]
  return new Date(dateStr)
}

function capitalize(aStr = '') {
  if (!aStr) { return aStr }
  return aStr[0].toUpperCase() + aStr.slice(1)
}

function friendlyCall(date) {
  const numDays = differenceInDays(today(), date)
  if (numDays === 0) { return 'today' }
  else if (numDays === 1) { return '1 day ago' }
  else { return `${numDays} days ago` }
}

export {
  capitalize,
  friendlyCall,
  today,
}

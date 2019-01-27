/* Collection of util functions used throughout the project */
import { differenceInDays } from 'date-fns'

function capitalize(aStr = '') {
  if (!aStr) {
    return aStr
  }
  return aStr[0].toUpperCase() + aStr.slice(1)
}

function friendlyCall(date) {
  const numDays = differenceInDays(new Date(), date)
  if (numDays === 0) {
    return 'today'
  } else if (numDays === 1) {
    return '1 day ago'
  } else {
    return `${numDays} days ago`
  }
}

export { capitalize, friendlyCall }

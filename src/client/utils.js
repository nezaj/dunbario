/* Collection of util functions used throughout the project */
import { distanceInWordsToNow } from 'date-fns'

function capitalize(aStr = '') {
  if (!aStr) { return aStr }
  return aStr[0].toUpperCase() + aStr.slice(1)
}

function friendlyCall(date) {
  return distanceInWordsToNow(date, {addSuffix: true})
}

export {
  capitalize,
  friendlyCall,
}

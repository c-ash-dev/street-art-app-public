export const createKeyByArtworkId = (aId) => {
  const currentDate = new Date()
  const midnightTimestamp = currentDate.setUTCHours(0, 0, 0, 0)
  return `${aId}-${midnightTimestamp}`
}

/*
given long record id, create short version
*/
export const extractShortKey = (longId) => {
  const parts = longId.split('-')
  return `${parts[1]}-${parts[2]}`
}

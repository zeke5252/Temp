const updateUID = function (uidData) {
  return ({
    type: 'UPDATE_UID',
    payload: uidData
  })
}

const updateDisplayName = function (name) {
  return ({
    type: 'UPDATE_NAME',
    payload: name
  })
}

const createViewPreference = function (settings) {
  return ({
    type: 'CREATE_VIEW_PREFERENCE',
    payload: settings
  })
}

const addTempContent = function (bookContent) {
  return ({
    type: 'ADD_TEMP_CONTENT',
    payload: bookContent
  })
}

export { updateUID, updateDisplayName, createViewPreference, addTempContent }

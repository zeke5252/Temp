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

const cleanStoreData = function () {
  return ({
    type: 'CLEAN_STORE_DATA',
  })
}

const saveViewPreference = function (preference) {
  return({
    type: 'SAVE_VIEW_PREFERENCE',
    payload: preference
  })
}

const changeViewFontType = function (value) {
  return({
    type: 'CHANGE_VIEW_FONT_TYPE',
    payload: value
  })
}

const changeViewBG = function (value) {
  return({
    type: 'CHANGE_VIEW_BG',
    payload: value
  })
}

const changeViewFontSize = function (value) {
  return({
    type: 'CHANGE_VIEW_FONT_SIZE',
    payload: value
  })
}

const changeViewLineHeight = function (value) {
  return({
    type: 'CHANGE_VIEW_LINE_HEIGHT',
    payload: value
  })
}

export { updateUID, updateDisplayName, createViewPreference, addTempContent, cleanStoreData, saveViewPreference, changeViewFontType, changeViewBG, changeViewFontSize, changeViewLineHeight }

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

const addTempTitle = function (bookTitle) {
  return ({
    type: 'ADD_TEMP_TITLE',
    payload: bookTitle
  })
}

const addTempContent = function (bookContent) {
  return ({
    type: 'ADD_TEMP_CONTENT',
    payload: bookContent
  })
}

const addTempNote = function (bookNote) {
  return ({
    type: 'ADD_TEMP_NOTE',
    payload: bookNote
  })
}

const cleanStoreData = function () {
  return ({
    type: 'CLEAN_STORE_DATA',
  })
}

const savePrefToRedux = function (preference) {
  return({
    type: 'SAVE_PREF_TO_REDUX',
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

const changeDictionary = function (value) {
  return({
    type: 'CHANGE_DICTIONARY',
    payload: value
  })
}

export { updateUID, updateDisplayName, addTempContent, cleanStoreData, savePrefToRedux, changeViewFontType, changeViewBG, changeViewFontSize, changeViewLineHeight, changeDictionary, addTempTitle, addTempNote }

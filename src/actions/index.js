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

export { updateUID, updateDisplayName, addTempContent, cleanStoreData, savePrefToRedux, changeViewFontType, changeViewBG, changeViewFontSize, changeViewLineHeight }

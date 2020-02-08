const initState = {
  userUID: '',
  userName: 'My friend',
  viewPreference: {
    background_color: '#eeeeee',
    font_size: 19,
    font_type: `"Muli", sans-serif`,
    line_height: 2
  },
  bookContent: ''
}

function reducer (state = initState, action) {
  switch (action.type) {
    case 'UPDATE_UID':
      return Object.assign({}, state, { userUID: action.payload })
    case 'UPDATE_NAME':
      return Object.assign({}, state, { userName: action.payload })
    case 'CREATE_VIEW_PREFERENCE':
      return Object.assign({}, state, { userName: action.payload })
    case 'ADD_TEMP_CONTENT':
      return Object.assign({}, state, { bookContent: action.payload })
    case 'CLEAN_STORE_DATA':
      return Object.assign({}, state, initState)
    case 'SAVE_VIEW_PREFERENCE':
      return Object.assign({}, state, { viewPreference: action.payload })
    case 'CHANGE_VIEW_FONT_TYPE':
      let tempObj = Object.assign({}, JSON.parse(JSON.stringify(state)))
      tempObj.viewPreference.font_type = action.payload
      console.log('font_type tempObj =', tempObj)
      return tempObj
    case 'CHANGE_VIEW_FONT_SIZE':
      let tempObj2 = Object.assign({}, JSON.parse(JSON.stringify(state)))
      tempObj2.viewPreference.font_size = action.payload
      console.log('font_size tempObj =', tempObj2)
      return tempObj2
    case 'CHANGE_VIEW_BG':
      let tempObj3 = Object.assign({}, JSON.parse(JSON.stringify(state)))
      tempObj3.viewPreference.background_color = action.payload
      console.log('backgroung_color tempObj2 =', tempObj3)
      return tempObj3
    case 'CHANGE_VIEW_LINE_HEIGHT':
      let tempObj4 = Object.assign({}, JSON.parse(JSON.stringify(state)))
      tempObj4.viewPreference.line_height = action.payload
      console.log('line_height tempObj4 =', tempObj4)
      return tempObj4
    default:
      return state
  }
}

export default reducer

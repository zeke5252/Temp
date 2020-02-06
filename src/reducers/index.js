const initState = {
  userUID: '',
  userName: 'My friend',
  viewPreference: {
    background_color: '#eeeeee',
    font_size: 16,
    font_type: '"Muli", sans-serif',
    line_height: 25
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
    default:
      return state
  }
}

export default reducer

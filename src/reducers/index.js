const initState = {
    userUID: '',
    userName:'My friend',
    viewPreference: {
        background_color:'#eeeeee',
        font_size: 16,
        font_type: '"Muli", sans-serif',
        line_height: 25
    }
  }

  function reducer (state = initState, action) {
    switch(action.type){
        case 'UPDATE_UID':
            return Object.assign({}, state, {userUID:action.payload})
        case 'UPDATE_NAME':
            return Object.assign({}, state, {userName:action.payload})
        case 'CREATE_VIEW_PREFERENCE':
            return Object.assign({}, state, {userName:action.payload})
        default:
            return state
    }
  }

  export default reducer
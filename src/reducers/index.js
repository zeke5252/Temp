const initState = {
    userUID: '',
    userName:'My friend'
  }

  function reducer (state = initState, action) {
      console.log('action=', action)
    switch(action.type){
        case 'UPDATE_UID':
            console.log( 'return=', Object.assign({}, state, {userUID:action.payload}))
            return Object.assign({}, state, {userUID:action.payload})
        case 'UPDATE_NAME':
            console.log( 'return=', Object.assign({}, state, {userName:action.payload}))
            return Object.assign({}, state, {userName:action.payload})
        default:
            return state
    }
  }

  export default reducer
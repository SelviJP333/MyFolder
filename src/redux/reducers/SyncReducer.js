 

const initialState = {
  called: false
  };


  export default SyncReducer = (state = initialState, action) => { 
    switch (action.type) {
      case 'CALL_FUNCTION':
        return {
          ...state,
          called: !action.payload
        };
      default:
        return state;
    } 
}
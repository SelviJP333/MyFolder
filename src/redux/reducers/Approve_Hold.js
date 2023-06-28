const initialState = {
    data: false
  };


  export default Approve_Hold = (state = initialState, action) => {


    switch (action.type) {
        case 'Approve_Hold': {
            return {
                ...state,
                data:action.payload
              };
        }

        default:
            return state;
}


}
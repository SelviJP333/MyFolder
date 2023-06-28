const initialState = {
    data: null
  };


  export default menu_save_time = (state = initialState, action) => {


    switch (action.type) {
        case 'menu_save_time': {
            return {
                ...state,
                data:action.payload
              };
        }

        default:
            return state;
}


}
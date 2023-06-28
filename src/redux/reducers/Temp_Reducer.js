const initialState = {
  data: [],
};

export default Temp_Reducer = (state = initialState, action) => {
  //

  switch (action.type) {
    case 'Addedd': {
      if (state.data.length !== 0) {
        // Find index about already element in array
        let index;
        state.data &&
          state.data.forEach((e, i) => {
            if (Object.keys(e)[0] === Object.keys(action.payload)[0]) {
              index = i;
            }
          });

        // remove element if already exist.
        if (index !== undefined) {
          state.data.splice(index, 1, action.payload);
        } else {
          state.data.push(action.payload);
        }
      } else {
        state.data.length = 0;

        action.payload ? state.data.push(action.payload) : null;
      }
      return {
        ...state,
        data: [...state.data],
      };
    }

    case 'Removee': {
      let index = state.data.findIndex(
        e => Object.keys(e)[0] === action.payload,
      );

      //
      state.data.splice(index, 1);
      return state;
    }
    case 'deletee': {
      return {
        ...state,
        data: [],
      };
    }
    default:
      return state;
  }
};

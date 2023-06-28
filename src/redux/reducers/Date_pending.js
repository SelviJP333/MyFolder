const initialState = {
    data: [],
  };

  export default Date_pending=(state = initialState, action) => {




    switch (action.type) {

      case "Add_Date":{

        return {
          ...state,
          data: [action.payload],
        };
      }

        case "Remove_Date":
          {

            return {
                ...state,
                data: [],
              };
           }

      default:
        return state;
    }
  };

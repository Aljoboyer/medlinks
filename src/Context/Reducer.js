import { ACTIONS } from "./Actions";

const reducers = (state, action) => {
  switch (action.type) {
    case ACTIONS.NOTIFY:
      return {
        ...state,
        notify: action.payload,
      };

    case ACTIONS.AUTH:
      return {
        ...state,
        auth: action.payload,
      };
    case ACTIONS.USER:
      return {
        ...state,
        user: action.payload,
      };
    case ACTIONS.SEARCH_JOB:
      return {
        ...state,
        searchJob: action.payload,
      };
    case ACTIONS.FLOW:
      return {
        ...state,
        flow: action.payload,
      };
      case ACTIONS.IMAGE: 
      return {
        ...state,
        image: action.payload
      }
    default:
      return state;
  }
};

export default reducers;

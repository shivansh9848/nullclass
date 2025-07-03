const initialState = {
  users: [],
  leaderboard: [],
  searchResults: [],
  userPoints: null,
  transferMessage: null,
  transferError: null,
};

const usersreducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_USERS":
      return {
        ...state,
        users: action.payload,
      };
    case "UPDATE_CURRENT_USER":
      return {
        ...state,
        users: state.users.map((user) =>
          user._id === action.payload._id ? action.payload : user
        ),
      };
    case "FETCH_LEADERBOARD":
      return {
        ...state,
        leaderboard: action.payload,
      };
    case "SEARCH_USERS":
      return {
        ...state,
        searchResults: action.payload,
      };
    case "FETCH_USER_POINTS":
      return {
        ...state,
        userPoints: action.payload,
      };
    case "TRANSFER_POINTS_SUCCESS":
      return {
        ...state,
        transferMessage: action.payload.message,
        transferError: null,
      };
    case "TRANSFER_POINTS_ERROR":
      return {
        ...state,
        transferMessage: null,
        transferError: action.payload,
      };
    case "VOTE_ANSWER":
      return state; // The question will be updated in the question reducer
    default:
      return state;
  }
};

export default usersreducer;

const currentuserreducer = (state = null, action) => {
  switch (action.type) {
    case "FETCH_CURRENT_USER":
      // Validate payload structure
      if (action.payload && typeof action.payload === "object") {
        // Make sure it has the expected structure
        if (action.payload.result && action.payload.token) {
          return action.payload;
        }
        // Handle direct result objects (legacy compatibility)
        if (action.payload.name && action.payload.email) {
          return { result: action.payload };
        }
      }
      return action.payload; // Return whatever was passed (including null)
    default:
      return state;
  }
};

export default currentuserreducer;

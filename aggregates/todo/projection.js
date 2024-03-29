const {
  types: { CREATED, DELETED, GENERIC },
} = require("./events");

module.exports = {
  Init: () => ({}),
  [CREATED]: (state, { payload }) => ({
    ...state,
    ...payload,
  }),

  [DELETED]: (state, { payload }) => ({
    ...state,
    ...payload,
  }),

  [GENERIC]: (state, { payload }) => ({
    ...state,
    ...payload,
  }),
};

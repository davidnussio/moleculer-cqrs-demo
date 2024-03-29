const {
  types: { CREATED, DELETED },
} = require("./events");

module.exports = {
  Init: () => ({}),
  [CREATED]: (state, { payload }) => ({
    ...state,
    ...payload,
  }),

  [DELETED]: (state, { payload }) => ({
    ...state,
    removedAt: payload.removedAt,
  }),
};

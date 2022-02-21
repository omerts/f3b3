export const createAction = <T>(type: string, payload?: T) => {
  if (!type) {
    throw new Error('An action must have a type')
  }

  // This destructuring is a combina for conditionaly adding the payload key
  // we could add it on a different line, but we would like to keep payload as
  // a readonly prop
  return { type, ...(payload && { payload }) }
}

export default createAction

import Actions from '../actions'
import { Route } from '../types'
import useCreateAction from './useCreateAction'

export const useNavigate = () => {
  const createAction = useCreateAction()

  return (path: string | Partial<Route>) =>
    createAction(Actions.NAVIGATED_TO, path)
}

export default useNavigate

import Actions from "../actions";
import { useDispatch } from "react-redux";

export const useCreateAction = () => {
  const dispatch = useDispatch();

  return <T extends unknown>(type: string, payload?: T) =>
    dispatch(Actions.createAction<T>(type, payload));
};

export default useCreateAction;

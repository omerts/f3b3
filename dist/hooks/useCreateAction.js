import Actions from "../actions";
import { useDispatch } from "react-redux";
export var useCreateAction = function () {
    var dispatch = useDispatch();
    return function (type, payload) {
        return dispatch(Actions.createAction(type, payload));
    };
};
export default useCreateAction;

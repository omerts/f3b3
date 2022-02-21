import Actions from '../actions';
import useCreateAction from './useCreateAction';
export var useNavigate = function () {
    var createAction = useCreateAction();
    return function (path) {
        return createAction(Actions.NAVIGATED_TO, path);
    };
};
export default useNavigate;

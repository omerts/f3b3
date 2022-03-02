export declare const Actions: {
    ROUTE_UPDATED: "ROUTE_UPDATED";
    ROUTE_CHANGED: "ROUTE_CHANGED";
    NAVIGATED_TO: "NAVIGATED_TO";
    NAVIGATED_BACK: "NAVIGATED_BACK";
    OPERATION_FAILED: "OPERATION_FAILED";
    createAction: <T>(type: string, payload?: T | undefined) => import("../types").EmptyAction | import("..").Action<any>;
    default: <T>(type: string, payload?: T | undefined) => import("../types").EmptyAction | import("..").Action<any>;
};
export default Actions;
//# sourceMappingURL=index.d.ts.map
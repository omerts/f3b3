export declare const Actions: {
    ROUTE_UPDATED: "ROUTE_UPDATED";
    ROUTE_CHANGED: "ROUTE_CHANGED";
    NAVIGATED_TO: "NAVIGATED_TO";
    NAVIGATED_BACK: "NAVIGATED_BACK";
    NAVIGATION_REGISTERED: "NAVIGATION_REGISTERED";
    OPERATION_FAILED: "OPERATION_FAILED";
    createAction: <T>(type: string, payload?: T | undefined) => {
        payload?: T | undefined;
        type: string;
    };
    default: <T>(type: string, payload?: T | undefined) => {
        payload?: T | undefined;
        type: string;
    };
};
export default Actions;
//# sourceMappingURL=index.d.ts.map
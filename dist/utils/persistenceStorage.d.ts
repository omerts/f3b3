export declare const save: (key: string, data: string, isSession?: boolean) => void;
export declare const load: (key: string, isSession?: boolean) => string | false | null | undefined;
export declare const remove: (key: string, isSession?: boolean) => void;
export declare const clearUserData: () => void;
declare const _default: {
    save: (key: string, data: string, isSession?: boolean) => void;
    load: (key: string, isSession?: boolean) => string | false | null | undefined;
    remove: (key: string, isSession?: boolean) => void;
    clearUserData: () => void;
};
export default _default;
//# sourceMappingURL=persistenceStorage.d.ts.map
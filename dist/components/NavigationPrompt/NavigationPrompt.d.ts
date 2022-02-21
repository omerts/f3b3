import { FC } from 'react';
export interface NavigationPromptProps {
    shouldPrompt: boolean;
    promptRender: (retry: () => void, cancel: () => void) => JSX.Element;
}
export declare const NavigationPrompt: FC<NavigationPromptProps>;
export default NavigationPrompt;
//# sourceMappingURL=NavigationPrompt.d.ts.map
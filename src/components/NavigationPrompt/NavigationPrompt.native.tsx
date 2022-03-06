import { FC, useEffect, useState } from 'react';

export interface NavigationPromptProps {
  shouldPrompt: boolean
  promptRender: (retry: () => void, cancel: () => void) => JSX.Element
}

export const NavigationPrompt: FC<NavigationPromptProps> = ({
  shouldPrompt,
  promptRender
}) => {
  // TODO implement this
  return null
}

export default NavigationPrompt

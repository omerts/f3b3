import { Transition } from 'history'
import { FC, useEffect, useState } from 'react'
import history from '../../utils/getHistory'

export interface NavigationPromptProps {
  shouldPrompt: boolean
  promptRender: (retry: () => void, cancel: () => void) => JSX.Element
}

export const NavigationPrompt: FC<NavigationPromptProps> = ({
  shouldPrompt,
  promptRender
}) => {
  const [retry, setRetry] = useState<(() => void) | null>()

  useEffect(() => {
    if (shouldPrompt) {
      const unblock = history.block((tx: Transition) => {
        setRetry(() => () => {
          unblock()
          tx.retry()
        })
      })

      return unblock
    }
  }, [shouldPrompt])

  if (!retry) {
    return null
  }

  return promptRender(retry, () => setRetry(null))
}

export default NavigationPrompt

import { FC } from 'react';

import {
  NavigationContainer as InnerNavigationContainer, NavigationContainerProps
} from '@react-navigation/native';

import Actions from '../../actions';
import { useCreateAction } from '../../hooks';

export const NavigationContainer: FC<NavigationContainerProps> = ({
  children,
  ...rest
}) => {
  const createAction = useCreateAction()

  return (
    <InnerNavigationContainer
      {...rest}
      ref={navigator => {
        // navigator is null in first few renders, since it isn't intialized until the NavigatorContainer finished loading
        if (navigator) {
          // Need to set timeout so by the time it registers there is already a route
          // ready, and then we can load the correct data by route, without setTimeout
          // sometimes the route isn't ready yet and then we miss on loading the needed data
          setTimeout(() => {
            createAction(Actions.NAVIGATION_REGISTERED, { navigator })
          }, 0)
        }
      }}
    >
      {children}
    </InnerNavigationContainer>
  )
}

export default NavigationContainer

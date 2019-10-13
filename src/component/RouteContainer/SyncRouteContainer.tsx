import { Route, Switch, useLocation, RouteProps } from 'react-router-dom'
import { SwitchTransition, CSSTransition } from "react-transition-group"
import handleTransitionEnd from './transitionend-event'
import React = require('react')

export interface SyncRouteContainerProps {
  routes: RouteProps[]
  transition: string | boolean
  children: JSX.Element
}

export function SyncRouteContainer({ 
  children, 
  routes = [],
  transition = false
}: Partial<Readonly<SyncRouteContainerProps>> = {}) {
  const location = useLocation()

  let component = (
    <Switch location={location}>
      {routes.map((routeProps, index) => (
      <Route key={index.toString()} {...routeProps} />
      ))}
    </Switch>
  )

  if(transition) component = (
    <SwitchTransition>
      <CSSTransition 
        key={location.key} 
        classNames={'string' === typeof transition ? transition : 'fade'}
        addEndListener={handleTransitionEnd} 
        timeout={366}
      >
        {component}
      </CSSTransition>
    </SwitchTransition>
  )
  
  if(children) component = (
    <>
      {children}
      {component}
    </>
  )

  return component
}
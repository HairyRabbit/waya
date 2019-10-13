import { Suspense, lazy, ComponentType } from 'react'
import { Route, Switch, useLocation, RouteProps } from 'react-router-dom'
import { SwitchTransition, CSSTransition } from "react-transition-group"
import handleTransitionEnd from './transitionend-event'
import React = require('react')

export interface AsyncRouteContainerProps {
  loading: JSX.Element | null
  routes: (Omit<RouteProps, 'component'> & { component: Promise<{ default: ComponentType<any> }> })[]
  transition: string | boolean
  children: JSX.Element
}

export function AsyncRouteContainer({ 
  children, 
  routes = [],
  loading = null,
  transition = false
}: Partial<Readonly<AsyncRouteContainerProps>> = {}) {
  const location = useLocation()

  let component = (
    <Switch location={location}>
      {routes.map(({ component, ...restRouteProps}, index) => (
      <Route key={index.toString()} component={lazy(() => component)} {...restRouteProps} />
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

  component = (
    <Suspense fallback={loading}>
      {children}
      {component}
    </Suspense>
  )

  return component
}

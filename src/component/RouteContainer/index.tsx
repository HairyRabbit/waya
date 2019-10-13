import { AsyncRouteContainer, AsyncRouteContainerProps } from './AsyncRouteContainer'
import { SyncRouteContainer, SyncRouteContainerProps } from './SyncRouteContainer'
import React = require('react')

export type RouteContainerProps = 
  | { async: true } & AsyncRouteContainerProps
  | { async: false } & SyncRouteContainerProps

export function RouteContainer(props: Partial<Readonly<RouteContainerProps>> = {}) {
  if(props.async) return <AsyncRouteContainer {...props} />
  return <SyncRouteContainer {...props} />
}

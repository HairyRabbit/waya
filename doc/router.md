# Router

The router have two major features:

1. render view base on location
2. code split, reduce bundle size and lazy load modules

waya use the most popular router library [react-router](react-router) by default.

To enable router fature, you need to create a route.json file at  root directory.

When a `route.json` file exists at root directory. waya will enable router features. At first, waya inject `react-router-dom` Provider to `<Main>` component:

```tsx main.tsx
import { BrowserRouter as Router } from 'react-router-dom'

function Main() {
  return (
    <Router>
      <App />
    </Router>
  )
}
```

## Basic usage

you can require in your root `App` component, e.g.

```
@
|- App.tsx
|- route.json
```

```tsx
import RootRouterContainer from './router.json'

function App() {
  return <RootRouterContainer />
}
```

the route.json can config as below:

```json route.json
{
  "/": "Dashboard",
  "/user": "User"
}
```

then the App will transform to:

```tsx
function App() {
  return (
    <Switch>
      <Route path="/" component={require('./Dashboard').default}>
      <Route path="/" component={require('./user').default}>
    </Switch>
  )
}
```

## Code split and async route

route can defined as async mode:

```json route.json
{
  "async": true,
  "routes": {
    "/": "Dashboard",
    "/user": "User"
  }
}
```

after, code transform to:

```tsx
<Suspense fallback={loadingComponent}>
  <Switch>
    <Route path="/" component={lazy(() => import('./Dashboard'))}>
    <Route path="/" component={lazy(() => import('./user'))}>
  </Switch>
</Suspense>
```

webpack will split code as main, dashboard and user chunk. If you wouldn't want some code split out, you can override self.async to false:

```json route.json
{
  "async": true,
  "routes": {
    "/": "Dashboard",
    "/user": {
      "async": false,
      "component": "User"
    }
  }
}
```

now the user chunk not split out.

### enable via config or env

Async mode was disabled by default as `{ "async": false }`, If you want enable, you can enable via config: 

```yaml
router:
  async: yes
```

or via env variable:

```sh
set WAYA_ROUTER_ASYNC=1
```

## Default router configs and env

| name | description | env | default |
|--|--|--|--|
| async | enable/disable async router mode | WAYA_ROUTER_ASYNC | false |
| trans | enable/disable page transition | WAYA_ROUTER_TRANS | false |
| nav | enable/disable resolve nav component | WAYA_ROUTER_NAV | false |

```yaml
router:
  async: false
  trans: false
  nav: false
```

## Runtime components

router require `<PageRouter>` component to generate wrapper code.

[react-router]: https://github.com/ReactTraining/react-router
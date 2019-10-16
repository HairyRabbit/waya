<br/>

<div align=center>

<br />
<img src="./logo.svg" alt="logo" title="logo" width="240" />
<br />
<br />

# waya

_Yet another builder_

_VSCode . TypeScript . React/Redux . Sass . Chrome_

[![npm version](https://badge.fury.io/js/waya.svg)](https://badge.fury.io/js/waya)
[![dependencies](https://david-dm.org/hairyrabbit/waya.svg)](https://david-dm.org/hairyrabbit/waya) [![Greenkeeper badge](https://badges.greenkeeper.io/HairyRabbit/waya.svg)](https://greenkeeper.io/)

_`npm i -g waya `_

</div>

<br />
<br />

## Index

- [Features](#features)
- [Getting Start](#getting-start)
- [Script](#script)
  - [Router](#router)
  - [Actions](#actions)
- [Style](#style)
  - [Themes](#themes)
  - [Variables](#variables)
- [Static](#static)
  - [Logo](#logo)
  - Icon
  - Image
  - Others
- [VSCode](#vscode)
- [Chrome](#chrome)
- [Cli](#cli)

<br />
<br />


## Features

[[ Back to index ]](#index)

<br />
<br />

## Getting Start

```sh
mkdir app && cd app
waya
```

[[ Back to index ]](#index)

<br />
<br />

## Script

`<root>/App.tsx` will auto load when exists

[[ Back to index ]](#index)

### Router

[[ Back to index ]](#index)

### Actions

`<root>/store.ts` will auto load when exists

[[ Back to index ]](#index)

<br />
<br />

## style

`<root>/style.scss` will auto load when exists

[[ Back to index ]](#index)

### Themes

[[ Back to index ]](#index)

#### light/dark theme

```json style.json
[{
  "name": "light",
  "vars": {
    "color-primary": "white"
  }
},{
  "name": "dark",
  "vars": {
    "color-primary": "black"
  }
}]
```

Or short for:

```json style.json
[{
  "color-primary": "white"
},{
  "color-primary": "black"
}]
```

[[ Back to index ]](#index)

#### multi themes

```json style.json
[{
  "name": "red",
  "vars": {
    "color-primary": "red"
  }
},{
  "name": "blue",
  "vars": {
    "color-primary": "blue"
  }
}]
```

[[ Back to index ]](#index)

### Variables

If `<root>/style.json` provide, inject the `root` selector to entrypoint and transform to json data to css properties. Like:

```json style.json
{
  "color-primary": "lightblue"
}
```

Will transform to:

```css
:root {
  --color-primary: lightblue;
}
```
[[ Back to index ]](#index)

<br />
<br />


## Static

Static resource files can provide under `/static` directory. Like:

```
/static
  - /logo   # logo file
  - /icon   # icons
  - /font   # web fonts
  - /image  # images
  - /media  # medias, like video and radio
  - /other  # other static files
```

[[ Back to index ]](#index)


### Logo

Add logo can easy add a `logo.svg` file to `<root>` directory. At development, the file can used as favico, they will inject a simple `<link>` tag to `<head>`:

```html
<head>
  <link rel="icon" type="image/png" href="[DATAURL..]" />
</head>
```

At production, Use [favicons][favicon] to generate more kinds of favicons, output to `<outroot>/static/logo` directory. It also inject `<link>` for generated file to html.

```html
<link rel="apple-touch-icon" sizes="60x60" href="/assets/apple-touch-icon-SIZE.png">
<link rel="apple-touch-startup-image" media="SIZE" href="/assets/apple-touch-startup-image-SIZE.png">
<link rel="icon" type="image/png" sizes="SIZE" href="/assets/favicon-SIZE.png">
<link rel="manifest" href="/assets/manifest.json">
<link rel="shortcut icon" href="/assets/favicon.ico">
<link rel="yandex-tableau-widget" href="/assets/yandex-browser-manifest.json">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title">
<meta name="application-name">
<meta name="mobile-web-app-capable" content="yes">
<meta name="msapplication-TileColor" content="#fff">
<meta name="msapplication-TileImage" content="/assets/mstile-SIZE.png">
<meta name="msapplication-config" content="/assets/browserconfig.xml">
<meta name="theme-color" content="#fff">
```

The logo entrypoint default resolved by `/<root>\/logo.(svg|png|jpg)$/`, If not found, keep to find `<root>/favicon.ico`. If also not found, fallback to use waya logo. 

I recommend to use `logo.svg`, If you want to display for yor app. 
The logo svg file will transform to tsx based component. Other formats transform to base64 data url. For example:

```ts svg-demo.ts
import Logo from '@/logo.svg'

function Header() {
  return <Logo />
}
```

```ts png-demo.ts
import Logo from '@/logo.png'

function Header() {
  return <img src={Logo} />
}
```

> Hot reload was supported.

#### Badges

If you want can set badges to favico at runtime. The `BadgeContext` provide a context help to setup badges. You can use `BadgeProvider` and `useBadge` hook to update badges value. For example:

```tsx
import { useEffect } from 'react'
import { BadgeProvider, useBadge } from 'react-extra/runtime/badge'

function App() {
  return (
    <BadgeProvider value={initBadge}>
      <Component />
    </BadgeProvider>
  )
}

function Component() {
  const [ badge, setBadge ] = useBadge()
  setBadge(badge + 1)
  return <span>unread messages: {badge}</span>
}
```

Interface:

```ts
interface BadgeProvider {
  readonly value: boolean | number
}

type badgeValue = BadgeProvider['value']
type setBadge = (value: BadgeProvider['value']) => void
function useBadge(): [ badgeValue, setBadge ]
```

#### preview

<todo>


[[ Back to index ]](#index)

<br />
<br />

## VSCode

[[ Back to index ]](#index)

<br />
<br />


## Chrome

[[ Back to index ]](#index)

<br />
<br />

## cli

[[ Back to index ]](#index)


[favicon]: https://github.com/itgalaxy/favicons
[favico.js]: https://github.com/ejci/favico.js
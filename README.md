<br/>

<div align=center>

<br />
<img src="./logo.svg" alt="logo" title="logo" width="240" />
<br />
<br />

# waya

_Yet another builder_

_VSCode . TypeScript . React/Redux . Sass . Chrome_

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

Add logo can easy add a `favicon.ico` file to `/static/logo` directory. At development, this file use as favico for webpage, it inject a `<link>` tag to html `<head>`:

```html
<head>
  <link id="logo" rel="shortcut icon" href="assets/icon/logo.svg" />
</head>
```

At production will generate more formats by [favicons][favicon].

The logo entrypoint default resolved by `static/favicon.ico`, and fallback to search matched `/logo\.(svg|png|jpg)$/`. If also not found, back to waya logo. 🙃

Hot reload was supported.

#### Badges

```ts
function Component() {
  const [ incBadge ] = useBadge({ /* options */ })
  incBadge()
}
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
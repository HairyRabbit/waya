<br/>

<div align=center>

<br />
<img src="./logo.svg" alt="logo" title="logo" width="240" />
<br />
<br />

# waya

_Yet another way to build web app_

_TypeScript . React/Redux . Sass_

_`npm i -g waya `_

</div>

<br />
<br />

## Index

- [Features](#Features)
- [Getting Start](#Getting_Start)
- [Script](#Script)
  - [Router](#Router)
  - [Actions](#Actions)
- [Style](#Style)
  - [Themes](#Themes)
  - [Variables](#Variables)
- Static
  - Logo
  - Icon
  - Image
  - Others
- [Cli](#Cli)

<br />
<br />


## Features

[[ Back to index ]](#Index)

<br />
<br />

## Getting Start

```sh
mkdir app && cd app
waya
```

[[ Back to index ]](#Index)

<br />
<br />

## Script

`<root>/App.tsx` will auto load when exists

[[ Back to index ]](#Index)

### Router

[[ Back to index ]](#Index)

### Actions

`<root>/store.ts` will auto load when exists

[[ Back to index ]](#Index)

<br />
<br />

## style

`<root>/style.scss` will auto load when exists

[[ Back to index ]](#Index)

### Themes

[[ Back to index ]](#Index)

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

[[ Back to index ]](#Index)

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

[[ Back to index ]](#Index)

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
[[ Back to index ]](#Index)

<br />
<br />

## cli

[[ Back to index ]](#Index)

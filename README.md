<br/>

<div align=center>

<br />
<img src="https://user-images.githubusercontent.com/5752902/64232713-1421a680-cf25-11e9-9a09-e2c6da83c5a7.png" alt="logo" title="logo" width="260" />
<br />

# webin

_Yet another way to build web app_

_TypeScript . React/Redux . Sass_

_`npm i -g webin `_

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

[[ back to index ]](#Index)

<br />
<br />

## Getting Start

```sh
mkdir app && cd app
webin
```

[[ back to index ]](#Index)

<br />
<br />

## Script

`<root>/App.tsx` will auto load when exists

[[ back to index ]](#Index)

### Router

[[ back to index ]](#Index)

### Actions

`<root>/store.ts` will auto load when exists

[[ back to index ]](#Index)

<br />
<br />

## style

`<root>/style.scss` will auto load when exists

[[ back to index ]](#Index)

### Themes

[[ back to index ]](#Index)

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

[[ back to index ]](#Index)

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

[[ back to index ]](#Index)

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
[[ back to index ]](#Index)

<br />
<br />

## cli

[[ back to index ]](#Index)
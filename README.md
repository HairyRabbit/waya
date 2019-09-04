<br/>

<div align=center>

# webin

_Yet another way to build web app_

_TypeScript . React/Redux . Sass_

_`npm i -g webin`_

</div>

<br />


## script

`<root>/App.tsx` will auto load when exists

## router

## store

`<root>/store.ts` will auto load when exists

## style

`<root>/style.scss` will auto load when exists

### root css variables

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

### themes

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

## cli
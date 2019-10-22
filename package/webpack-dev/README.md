## Default

### `const DEFAULT_EXTENSIONS`

```ts
const DEFAULT_EXTENSIONS: string[]
```

default file extensions for webpack resolver, default to:

- `js`, `mjs`
- `ts`, `tsx`
- `json`


### `function createDefaultConfig`

```ts
function createDefaultConfig(
  options: DefaultConfigOptions
): webpack.Configuration
```

create default config for dev mode. includes:

- set `mode` to `development`
- set `context` to project root
- set `@` alias for project root
- set `ts` / `tsx` for extension free resolve
- set `devtool` to `inline-source-map` for sourcemap debug
- append `modulesContext` for modules search path
- add `webpack.HotModuleReplacementPlugin` plugin to enable HMR feature
- set `output.publicPath` to `/` for history fallback.


### `interface DefaultConfigOptions`

```ts
interface DefaultConfigOptions {
  context: string
  name?: string
  modulesContext?: string
}
```

- `name` was the compiler name, default to `app`

## Script

### `function createScriptConfig`

```ts
function createScriptConfig(): webpack.Configuration
```

create script config for dev mode, use `ts-loader` only.


### `const DEFAULT_IMAGE_EXTENSIONS`

```ts
const DEFAULT_IMAGE_EXTENSIONS: string[]
```

image extensions for resolver. default to:

- jpg, jpeg
- png
- gif
- webp
- svg

### `function createImageLoaderUse`

```ts
function createImageLoaderUse(): webpack.RuleSetUse
```

just apply url-loader for load image resources.

### `function createImageConfig`

```ts
function createImageConfig(options: ImageConfigOptions): webpack.Configuration
```

setup image loader rules.

### `interface ImageConfigOptions`

```ts
interface ImageConfigOptions {
  context: string
}
```

- `context` - image resources directory, only can load image file under this context.


## Icon

### `function createIconConfig`

```ts
function createIconConfig(options: IconConfigOptions): webpack.Configuration
```

create icon config. icon was set of svg files.

### `interface IconConfigOptions`

```ts
interface IconConfigOptions {
  context: string
}
```

- `context` - svg sources directory, only can load svg file under this context directory.

## I18n

### `function createI18nConfig`

```ts
function createI18nConfig(options: I18nConfigOptions): webpack.Configuration
```

create i18n config. locales file was set of yaml files.

### `interface I18nConfigOptions`

```ts
interface I18nConfigOptions {
  context: string
}
```

- `context` - i18n locales directory, only can load locales file under the context directory.
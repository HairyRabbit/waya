/**
 * smooth-code/webpack
 * @see https://github.com/smooth-code/svgr
 * @version 4.3.3
 */
declare module '@svgr/webpack' {
  export interface Options {
    /**
     * Specify a custom config file.
     * @default null
     */
    configFile?: string | null
    /**
     * Specify a custom extension for generated files.
     * @default 'js''
     */
    ext?: string
    /**
     * Modify all SVG nodes with uppercase and use a specific template with react-native-svg imports. All unsupported nodes will be removed.
     * 
     * Override using the API with `native: { expo: true }` to template SVG nodes with the ExpoKit SVG package. This is only necessary for 'ejected' ExpoKit projects where import 'react-native-svg' results in an error.
     * @default false
     */
    native?: boolean
    /**
     * Remove width and height from root SVG tag.
     * @default true
     */
    dimensions?: boolean
    /**
     * All properties given to component will be forwarded on SVG tag. Possible values: "start", "end" or false.
     * @default 'end'
     */
    expandProps?: 'start' | 'end' | false
    /**
     * Use [Prettier](https://github.com/prettier/prettier) to format JavaScript code output.
     * @default true
     */
    prettier?: boolean
    /**
     * Specify Prettier config. [See Prettier options](https://prettier.io/docs/en/options.html).
     * @default null
     */
    prettierConfig?: object | null
    /**
     * Use [SVGO](https://github.com/svg/svgo) to optimize SVG code before transforming it into a component.
     * @default true
     */
    svgo?: boolean
    /**
     * Specify SVGO config. [See SVGO options](https://gist.github.com/pladaria/69321af86ce165c2c1fc1c718b098dd0).
     * @default null
     */
    svgoConfig?: object | null
    /**
     * Setting this to true will forward ref to the root SVG tag.
     * @default false
     */
    ref?: boolean
    /**
     * Replace an attribute value by an other. The main usage of this option is to change an icon color to "currentColor" in order to inherit from text color.
     * @default {}
     */
    replaceAttrValues?: { [key: string]: string }
    /**
     * Add props to the root SVG tag.
     * @default {}
     */
    svgProps?: { [key: string]: string }
    /**
     * Add title tag via title property. If titleProp is set to true and no title is provided (title={undefined}) at render time, this will fallback to existing title element in the svg if exists.
     * @default false
     */
    titleProp?: boolean
    /**
     * Specify a template file (CLI) or a template function (API) to use. For an example of template, see the default one.
     * @default Function
     */
    template?: Function
  }
}
/**
 * webpack-contrib/style-loader
 * @see https://github.com/webpack-contrib/style-loader
 * @version 1.0.0
 */

declare module "style-loader" {
  /**
   * Allows to setup how styles will be injected into the DOM.
   */
  export const enum InjectType {
    /** 
     * Automatically injects styles into the DOM using multiple `<style></style>`. It is default behaviour. 
     */
    StyleTag = 'styleTag',
    /**
     * Automatically injects styles into the DOM using one `<style></style>`.
     */
    SingletonStyleTag = 'singletonStyleTag',
    /**
     * Injects styles into the DOM using multiple `<style></style>` on demand. We recommend following `.lazy.css` naming convention for lazy styles and the `.css` for basic `style-loader` usage (similar to other file types, i.e. `.lazy.less` and `.less`). When you `lazyStyleTag` value the `style-loader` injects the styles lazily making them useable on-demand via `style.use()` / `style.unuse()`.
     */
    LazyStyleTag = 'lazyStyleTag',
    /**
     * Injects styles into the DOM using one `<style></style>` on demand. We recommend following `.lazy.css` naming convention for lazy styles and the `.css` for basic `style-loader` usage (similar to other file types, i.e. `.lazy.less` and `.less`). When you `lazySingletonStyleTag` value the `style-loader` injects the styles lazily making them useable on-demand via `style.use()` / `style.unuse()`.
     */
    LazySingletonStyleTag = 'lazySingletonStyleTag',
    /**
     * Injects styles into the DOM using multiple `<link rel="stylesheet" href="path/to/file.css">` .
     */
    LinkTag = 'linkTag'
  }

  export interface Options {
    /**
     * Allows to setup how styles will be injected into the DOM
     * @default InjectType.StyleTag
     */
    injectType?: InjectType
    /**
     * Adds custom attributes to tag
     * @default {}
     */
    attributes?: { [key: string]: string }
    /**
     * Inserts tag at the given position into the DOM
     * @default HTMLHeadElement
     */
    insert?: string | ((element: HTMLElement) => void)
    /**
     * Sets module ID base (DLLPlugin)
     * @default true
     */
    base?: number | boolean
  }
}
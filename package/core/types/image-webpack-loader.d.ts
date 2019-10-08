///<reference path="./imagemin-webp.d.ts" />
///<reference path="./imagemin-mozjpeg.d.ts" />

import { Options as GifsicleOptions } from 'imagemin-gifsicle'
import { Options as SvgoOptions } from 'imagemin-svgo'
import { Options as PngquantOptions } from 'imagemin-pngquant'
import { Options as OptipngOptions } from 'imagemin-optipng'
import { Options as MozJPEGOptions } from 'imagemin-mozjpeg'
import { Options as WebpOptions } from 'imagemin-webp'

declare namespace ImageWebpackLoader {
  type AddonOptions<T> = T & { enabled: boolean }

  export interface Options {
    readonly bypassOnDebug?: boolean
    readonly disable?: boolean
    readonly gifsicle?: AddonOptions<GifsicleOptions>
    readonly mozjpeg?: AddonOptions<MozJPEGOptions>
    readonly pngquant?: AddonOptions<PngquantOptions>
    readonly optipng?: AddonOptions<OptipngOptions>
    readonly svgo?: AddonOptions<SvgoOptions>
    /**
     * @default null
     */
    readonly webp?: AddonOptions<WebpOptions>
  }
}


export = ImageWebpackLoader
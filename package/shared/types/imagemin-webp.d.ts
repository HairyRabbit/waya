import { Plugin } from 'imagemin'

declare function imageminWebp(options?: imageminWebp.Options): Plugin

declare namespace imageminWebp {
  /**
   * Preset
   */
  const enum Preset { 
    Default = 'default', 
    Photo = 'photo', 
    Picture = 'picture', 
    Drawing = 'drawing', 
    Icon = 'icon', 
    Text = 'text' 
  }

  type Crop = { x: number, y: number, width: number, height: number }
  type Resize = { width: number, height: number }
  const enum Metadata {
    All = 'all',
    None = 'none',
    Exif = 'exif',
    Icc = 'icc',
    Xmp = 'xmp'
  }

  interface Options {
    /**
     * Preset setting, one of default, photo, picture, drawing, icon and text.
     * @default Preset.Default
     */
    readonly preset?: Preset
    /**
     * Set quality factor between 0 and 100.
     * @default 75
     */
    readonly quality?: number
    /**
     * Set transparency-compression quality between 0 and 100.
     * @default 100
     */
    readonly alphaQuality?: number
    /**
     * Specify the compression method to use, between 0 (fastest) and 6 (slowest). This 
     * parameter controls the trade off between encoding speed and the compressed file size and quality.
     * @default 4
     */
    readonly method?: 0 | 1 | 2 | 3 | 4 | 5 | 6
    /**
     * Set target size in bytes.
     */
    readonly size?: number
    /**
     * Set the amplitude of spatial noise shaping between 0 and 100.
     * @default 80
     */
    readonly sns?: number
    /**
     * Set deblocking filter strength between 0 (off) and 100.
     */
    readonly filter?: number
    /**
     * Adjust filter strength automatically.
     * @default false
     */
    readonly autoFilter?: boolean
    /**
     * Set filter sharpness between 0 (sharpest) and 7 (least sharp).
     * @default 0
     */
    readonly sharpness?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
    /**
     * Encode images losslessly.
     * @default false
     */
    readonly lossless?: boolean
    /**
     * Encode losslessly with an additional lossy pre-processing step, with a 
     * quality factor between 0 (maximum pre-processing) and 100 (same as lossless).
     * @default 100
     */
    readonly nearLossless?: number
    /**
     * Crop the image.
     */
    readonly crop?: Crop
    /**
     * Resize the image. Happens after crop.
     */
    readonly resize?: Resize
    /**
     * A list of metadata to copy from the input to the output if present.
     * @default Metadata.None
     */
    readonly metadata?: Metadata | Metadata[]
    /**
     * Buffer to optimize.
     */
    readonly buffer?: Buffer
  }

  
}

export = imageminWebp

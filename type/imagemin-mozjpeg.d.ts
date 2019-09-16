import { Plugin } from 'imagemin'

declare function imageminMozJPEG(options?: imageminMozJPEG.Options): Plugin

declare namespace imageminMozJPEG {
  /**
   * DC scan optimization mode.
   */
  const enum DCScanOptimizationMode { 
    /** One scan for all components */
    All, 
    /** One scan per component */
    Every, 
    /** Optimize between one scan for all components and one scan for 1st component plus one scan for remaining components */
    Between 
  }
  /**
   * DCT method
   */
  const enum DCT { Int = 'int', Fast = 'fast', Float = 'float' }
  /**
   * Trellis optimization method
   */
  const enum Tune { PSNR = 'psnr', HVS_PSNR = 'hvs-psnr', SSIM = 'ssim', MS_SSIM = 'ms-ssim' }
  /**
   * Predefined quantization table
   */
  const enum QuantTable { 
    /** JPEG Annex K */
    JPEG_Annex_K, 
    /** Flat */
    Flat, 
    /**  Custom, tuned for MS-SSIM */
    Custom_MS_SSIM, 
    /** ImageMagick table by N. Robidoux */
    ImageMagick,
    /** Custom, tuned for PSNR-HVS */
    Custom_PSNR_HVS,
    /** Table from paper by Klein, Silverstein and Carney */
    FromPaperSilversteinCarney 
  }

  interface Options {
    /**
     * Compression quality, in range 0 (worst) to 100 (perfect).
     */
    readonly quality?: number
    /**
     * false creates baseline JPEG file.
     * @default true
     */
    readonly progressive?: boolean
    /**
     * Input file is Targa format (usually not needed).
     * @default false
     */
    readonly targa?: boolean
    /**
     * Revert to standard defaults instead of mozjpeg defaults.
     * @default false
     */
    readonly revert?: boolean
    /**
     * Disable progressive scan optimization.
     * @default false
     */
    readonly fastCrush?: boolean
    /**
     * Set DC scan optimization mode.
     *  - 0 One scan for all components
     *  - 1 One scan per component
     *  - 2 Optimize between one scan for all components and one scan for 1st component plus one scan for remaining components
     * @default DCScanOptimizationMode.Every
     */
    readonly dcScanOpt?: DCScanOptimizationMode
    /**
     * [Trellis optimization](https://en.wikipedia.org/wiki/Trellis_quantization).
     * @default true
     */
    readonly trellis?: boolean
    /**
     * Trellis optimization of DC coefficients.
     * @default true
     */
    readonly trellisDC?: boolean
    /**
     * Set Trellis optimization method. Available methods: psnr, hvs-psnr, ssim, ms-ssim
     * @default Tune.HVS_PSNR
     */
    readonly tune?: Tune
    /**
     * Black-on-white deringing via overshoot.
     * @default true
     */
    readonly overshoot?: boolean
    /**
     * Use [arithmetic coding](https://en.wikipedia.org/wiki/Arithmetic_coding).
     * @default false
     */
    readonly arithmetic?: boolean
    /**
     * Set DCT method:
     *  - int Use integer DCT
     *  - fast Use fast integer DCT (less accurate)
     *  - float Use floating-point DCT
     * @default DCT.Int
     */
    readonly dct?: DCT
    /**
     * Use 8-bit quantization table entries for baseline JPEG compatibility.
     * @default false
     */
    readonly quantBaseline?: boolean
    /**
     * Use predefined quantization table.
     * - 0 JPEG Annex K
     * - 1 Flat
     * - 2 Custom, tuned for MS-SSIM
     * - 3 ImageMagick table by N. Robidoux
     * - 4 Custom, tuned for PSNR-HVS
     * - 5 Table from paper by Klein, Silverstein and Carney
     */
    readonly quantTable?: QuantTable
    /**
     * Set the strength of smooth dithered input. (1...100)
     */
    readonly smooth?: boolean
    /**
     * Set the maximum memory to use in kilobytes.
     */
    readonly maxMemory?: number
    /**
     * Set component sampling factors. Each item should be in the format HxV, for example 2x1.
     */
    readonly sample?: string[]
    /**
     * Buffer to optimize.
     */
    readonly buffer?: Buffer
  }
}

export = imageminMozJPEG
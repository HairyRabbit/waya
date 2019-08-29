import * as webpack from 'webpack'
import * as tsLoader from 'ts-loader'

export default function makeScriptRules(): webpack.RuleSetRule[] {
  return [{
    test: /\.tsx?/,
    use: [{
      loader: require.resolve('ts-loader'),
      options: makeTSLoaderOptions()
    }]
  }]
}

export function makeTSLoaderOptions(): Partial<tsLoader.Options> {
  return {

  }
}
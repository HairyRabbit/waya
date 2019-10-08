/// <reference path="../types/postcss-scss.d.ts" />
/// <reference path="../types/postcss-preset-env.d.ts" />
/// <reference types="webpack-dev-server" />
import * as webpack from 'webpack';
interface Options {
    readonly context: string;
    readonly globals: string;
    readonly cssvar: string;
}
export default function createStyleConfig({ globals, cssvar }: Options): webpack.Configuration;
export {};

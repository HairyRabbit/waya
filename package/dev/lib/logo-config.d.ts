/// <reference types="webpack-dev-server" />
import * as webpack from 'webpack';
interface Options {
    readonly context: string;
    readonly logo: string;
}
export default function createLogoConfig({ logo }: Options): webpack.Configuration;
export {};

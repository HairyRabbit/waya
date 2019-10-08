/// <reference types="webpack-dev-server" />
import * as webpack from 'webpack';
interface Options {
    readonly context: string;
    readonly name: string;
    readonly libraryContext: string;
}
export default function createDefaultConfig({ context, name, libraryContext }: Options): webpack.Configuration;
export {};

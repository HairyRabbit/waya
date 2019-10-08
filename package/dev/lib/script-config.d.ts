/// <reference types="webpack-dev-server" />
import * as webpack from 'webpack';
interface Options {
    readonly context: string;
}
export default function createScriptConfig({ context }: Options): webpack.Configuration;
export {};

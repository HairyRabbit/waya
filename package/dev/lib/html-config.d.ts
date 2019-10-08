/// <reference types="webpack-dev-server" />
import * as webpack from 'webpack';
interface Options {
    readonly name: string;
    readonly description?: string;
    readonly metas?: {
        content: string;
        name: string;
    }[];
    readonly lang?: string;
    readonly window?: string;
    readonly styles?: string[];
    readonly scripts?: string[];
}
export default function createHtmlConfig({ name: title, description, metas, lang, window, scripts, styles: links }: Options): webpack.Configuration;
export {};

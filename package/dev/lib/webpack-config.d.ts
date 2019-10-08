/// <reference types="webpack-dev-server" />
import * as webpack from 'webpack';
import * as normalizeData from 'normalize-package-data';
import { WebpackResolveFallbackPluginOptions } from 'waya-core';
export interface CreateWebpackOptions {
    readonly context: string;
    readonly project: string;
    readonly pkg: normalizeData.Package;
    readonly entry: {
        style: (string | undefined)[];
        script: (string | undefined)[];
    };
    readonly fallbacks: {
        fileName: string;
        options?: Partial<WebpackResolveFallbackPluginOptions>;
    }[];
    readonly style: {
        readonly globals: string;
        readonly cssvar: string;
    };
    readonly logo: string;
    readonly library: {
        readonly context: string;
        readonly include: {
            style: string[];
            script: string[];
        };
    };
    readonly url: URL;
}
export declare function createWebpackConfig({ context, project, library, entry, fallbacks, pkg, style: { globals, cssvar }, logo, url }: CreateWebpackOptions): webpack.Configuration;

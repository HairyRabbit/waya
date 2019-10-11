import * as WebpackDevServer from 'webpack-dev-server';
export interface CreateServerOptions {
    readonly url: URL;
    readonly contents?: string[];
}
export declare function createServerConfig({ url, contents }: CreateServerOptions): WebpackDevServer.Configuration;

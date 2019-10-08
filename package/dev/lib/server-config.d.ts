import * as WebpackDevServer from 'webpack-dev-server';
export interface CreateServerOptions {
    readonly url: URL;
}
export declare function createServerConfig({ url }: CreateServerOptions): WebpackDevServer.Configuration;

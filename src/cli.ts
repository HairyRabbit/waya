import * as yargs from "yargs";
import main, { build } from "./index";
export default function cli(args: string[] = process.argv.slice(2)): void {
  yargs
    .strict()
    .command(
      "build", 
      "Build project", 
      yargs => {
        return yargs;
      },
      args => {
        const {  } = args;
        build();
      }
    )
    .command(
      "*",
      "Serve",
      yargs => {
        return yargs;
      },
      args => {
        const {  } = args;
        main();
      }
    )
    .help()
    .alias("help", "h")
    .version()
    .parse(args);
}

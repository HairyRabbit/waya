import * as yargs from "yargs";
import main from "./index";
export default function cli(args: string[] = process.argv.slice(2)): void {
  yargs
    .strict()
    .command(
      "$0",
      "",
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

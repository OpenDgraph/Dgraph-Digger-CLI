
  import { GluegunToolbox } from 'gluegun'
  import mergeByKey = require('array-merge-by-key');
  import chalk from 'chalk'


const HELP = `
${chalk.bold('digger tools JSON_merge')} [options]
Options:
  -h, --help                    Show usage information.
  --key                         Define the key to be merged.
  --json                        The path to your JSON file. e.g: --json tmp/testMerge.json
`

  module.exports = {
    name: 'JSON_merge',
    alias: ['mgj'],
    run: async (toolbox: GluegunToolbox) => {
      const {
        filesystem,
        print: { info, error },
      } = toolbox
      let {
        key,
        json,
        help
      } = toolbox.parameters.options

      json = json || false
      key = key || false

      let UserPath = json

      let noAuto = Object.keys(toolbox.parameters.options).length;

      if (help || !noAuto) {
        if (!noAuto) {
        error("No options was typed")
      }
        info(HELP)
        return
      }
      if (!json) {
        error("Set the path to your JSON file is mandatory")
        return
      }

      let array21 = filesystem.read(`${process.cwd()}/${UserPath}`, 'json')|| {}
      // @ts-ignore
      let result: any
      if (!key){
        key = "uid";
        result = mergeByKey(key, array21);
      } else {
        console.log("else")
        result = mergeByKey(key, array21);
      }

      filesystem.writeAsync("./output/mergedJson.json", result)

      info(`Merged by the key "${key}"`)

    },
  }
  
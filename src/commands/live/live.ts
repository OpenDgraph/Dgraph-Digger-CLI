
import { GluegunToolbox } from 'gluegun'
import chalk from 'chalk'


const HELP = `
${chalk.bold('digger live')} [options]
Options:
  -h, --help                    Show usage information
`

module.exports = {
  name: 'live',
  run: async (toolbox: GluegunToolbox) => {
    const { filesystem, print, conn } = toolbox
    // Parse CLI parameters
    let {
      h,
      help,
      dp,
      drop,
      json,
      addr,
      d
    } = toolbox.parameters.options
        // Support both short and long option variants
        help = help || h || false
        drop = drop || dp || false
        addr = addr || d || false
        json = json || false

        let noAuto = Object.keys(toolbox.parameters.options).length;
        // console.log(noAuto, "options")

        if (help || !noAuto) {
          if (!noAuto) {
          print.error("No options was typed")
        }
          print.info(HELP)
          return
        }

        if (help || drop || !json  ) {
          print.error("Unknown option")
          return
        }

        let inDP = drop ? JSON.parse(drop) : false
        let UserPath = json

       if (typeof json !== 'string'){
          let filesHere = toolbox.filesystem.find(`./`, { matching: './*.json' })
          var JZ = Object.keys(filesHere).length;
            print.info(filesHere);
            print.info(`Found: ${JZ} JSON files to process...`);

            filesHere.forEach(element => {
            print.info(element);
            print.info('Sendding your JSONs...')
            conn(addr, false, filesystem.read(`${process.cwd()}/${element}`, 'json') || {})
            });
      }

    if (drop && inDP == true) {
      print.info('Dropping Database...')
      conn(addr, true)
    }

    if (typeof json === 'string') {
      const MyJSON =
      filesystem.read(`${process.cwd()}/${UserPath}`, 'json') || {}
      var JSONsize = Object.keys(MyJSON).length;
        if (JSONsize < 1) {
          print.error(`No JSON file found please set a file with --json /yourpath/json.json`)
          } else {
            print.info('Sendding your JSON...')
            conn(addr, false, MyJSON)
          }
    }
    
    print.info('Thank you for using Dgraph!')
  },
}

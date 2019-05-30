
import { GluegunToolbox } from 'gluegun'
import chalk from 'chalk'


const HELP = `
${chalk.bold('digger live')} [options]
Options:
  -h, --help                    Show usage information.
  -dp, --drop                   Dropping Database set 'true'.
  --json                        The path to your JSON files. You can set a path to a folder or to a file.
  --d , --addr                  Setup the Alpha connection it accepts multiple address separated by comma.
                                e.g: localhost:9080,localhost:9081
`

module.exports = {
  name: 'live',
  run: async (toolbox: GluegunToolbox) => {
    const { filesystem, print: { info, error }, conn } = toolbox
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
        // Support both short and long option letiants
        help = help || h || false
        drop = drop || dp || false
        addr = addr || d || false
        json = json || false

        let comma: string = ',';
        let addrArray: any;
        let addrTotal: any;

        // Alterar a posição desse campo para depois de --json
        if (addr && typeof addr === 'string') {
          addrArray = addr.split(comma);
          addrTotal = Object.keys(addrArray).length;
          info(addrArray)
        }

        let noAuto = Object.keys(toolbox.parameters.options).length;
        // console.log(noAuto, "options",toolbox.parameters.options)

        if (help || !noAuto) {
          if (!noAuto) {
          error("No options was typed")
        }
          info(HELP)
          return
        }

        if (addr && typeof addr !== 'string'|| drop && typeof drop !== 'string') {
          error("Unknown param: addr flag can't be empty. If you need default addr just remove the flag.")
          return
        }

        // if (!help ) {
        //   print.error("Unknown option")
        //   return
        // }


        let inDP = drop ? JSON.parse(drop) : false
        let UserPath = json

       if (json && typeof json !== 'string'){
          let filesHere = toolbox.filesystem.find(`./`, { matching: './*.json' })
          let JZ = Object.keys(filesHere).length;
            info(`Found: ${JZ} JSON files to process...`);
            info(filesHere);

            // console.log('addrTotal', addrTotal);
            filesHere.forEach((element, index, array) => {
              let x = 0;
              let turn = 1;
              let offset = 0;
              while (x < index) {
                x = ++x;
                offset = ++offset;
                if (x === addrTotal) {
                  offset = 0
                  turn = ++turn
                   continue;
                } else if (x === addrTotal*turn){
                  offset = 0
                  turn = ++turn
                }
             }
           //  console.log(addrArray[offset],'x', x, "offset", offset, "turn", turn, "index", index);

            info('Sendding your JSONs...')
            conn(addrArray[offset], false, filesystem.read(`${process.cwd()}/${element}`, 'json') || {})
            });
      }

      if (drop && inDP === true) {
        info('Dropping Database...')
        conn(addr, true)
      }

    if (typeof json === 'string') {
      const MyJSON =
      filesystem.read(`${process.cwd()}/${UserPath}`, 'json') || {}
      let JSONsize = Object.keys(MyJSON).length;
        if (JSONsize < 1) {
          error(`No JSON file found please set a file with --json /yourpath/json.json`)
          } else {
            info('Sendding your JSON...')
            conn(addr, false, MyJSON)
          }
    }
    
    info('Thank you for using Dgraph!')
  },
}

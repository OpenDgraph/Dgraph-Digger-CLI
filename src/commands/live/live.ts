
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

        let comma: string = ',';
        let addrArray: any;
        let addrTotal: any;

        // Alterar a posição desse campo para depois de --json
        if (addr && typeof addr === 'string') {
          addrArray = addr.split(comma);
          addrTotal = Object.keys(addrArray).length;
        }
        print.info(addrArray)
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
        if (addr && typeof addr !== 'string') {
          print.error("Unknown param: addr flag can't be empty. If you need default addr just remove the flag.")
          return
        }

        let inDP = drop ? JSON.parse(drop) : false
        let UserPath = json

       if (typeof json !== 'string'){
          let filesHere = toolbox.filesystem.find(`./`, { matching: './*.json' })
          var JZ = Object.keys(filesHere).length;
            print.info(`Found: ${JZ} JSON files to process...`);
            print.info(filesHere);

            // console.log('addrTotal', addrTotal);
            filesHere.forEach((element, index, array) => {
              var x = 0;
              var turn = 1;
              var offset = 0;
              while (x < index) {
                x = ++x;
                offset = ++offset;
                if (x == addrTotal) {
                  offset = 0
                  turn = ++turn
                   continue;
                } else if (x == addrTotal*turn){
                  offset = 0
                  turn = ++turn
                }
             }
           //  console.log(addrArray[offset],'x', x, "offset", offset, "turn", turn, "index", index);

            print.info('Sendding your JSONs...')
            conn(addrArray[offset], false, filesystem.read(`${process.cwd()}/${element}`, 'json') || {})
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

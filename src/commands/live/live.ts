
import { GluegunToolbox } from 'gluegun'


module.exports = {
  name: 'digger',
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
        help = help || h
        drop = drop || dp
        addr = addr || d || false

        let inDP = drop ? JSON.parse(drop) : false
        let UserPath = json

        console.log(toolbox.parameters.options, "options")
        // console.log(drop && inDP == true)
        // console.log(drop || inDP == true)

    if (drop && inDP == true) {
      conn(addr, true)
      print.info('Dropping Database...')
    }

    if (json) {
      const MyJSON =
      filesystem.read(`${process.cwd()}/${UserPath}`, 'json') || {}
        var JSONsize = Object.keys(MyJSON).length;
        if (JSONsize < 1) {
        print.error(`No JSON file please select a file with --json ${UserPath}`)
        }
      conn(addr, false, MyJSON)
      print.info('Dropping Database... HA')
    }
    
    print.info('Thank you for using Dgraph!')
  },
}

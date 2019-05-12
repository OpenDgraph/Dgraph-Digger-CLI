import { GluegunToolbox } from 'gluegun'
module.exports = {
  dashed: true,
  alias: ['h', '-h'],
  description: 'Displays Ignite CLI help',
  run: async (toolbox: GluegunToolbox) => {
    const {
      print: { printCommands, info, colors },
    } = toolbox

    info('')
    printCommands(toolbox)
    info('')
    info(colors.magenta('If you need additional help, join our Discuss at https://discuss.dgraph.io'))
    info('')
  },
}
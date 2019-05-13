
import { GluegunToolbox } from 'gluegun'
import * as dgraph from 'dgraph-js'

// add your CLI-specific functionality here, which will then be accessible
// to your commands

module.exports = (toolbox: GluegunToolbox) => {
  toolbox.conn = (addr: any, dropit: any, LiveJSON: any) => {
    if (addr){
      toolbox.print.info(`Starting... sending mutations to ${addr}`)
    }
    const clientStub = new dgraph.DgraphClientStub(
      // addr: optional, default: "localhost:9080"
      addr ? addr : "localhost:9080",
      // credentials: optional, default: grpc.credentials.createInsecure()
      // grpc.credentials.createInsecure(),
    );
    const dgraphClient = new dgraph.DgraphClient(clientStub);


    // Drop All - discard all data and start from a clean slate.
    const dropAll = async (dgraphClient: { alter: (arg0: any) => void; }) => {

      try {
        const op = new dgraph.Operation();
        op.setDropAll(true);
        await dgraphClient.alter(op);
      } catch (e) {
          console.log(e.details)
      }
    }

    const mutateJSON = async (dgraphClient: { newTxn: any }, LiveJSON: { p: any; }) => {
      const txn = dgraphClient.newTxn();
      try {
        const mu = new dgraph.Mutation();
        mu.setSetJson(LiveJSON);
        await txn.mutate(mu);
        await txn.commit();
      } finally {
        await txn.discard();
      }
    };

    if (dropit) {
      dropAll(dgraphClient);
    }
    if (LiveJSON) {
      mutateJSON( dgraphClient, LiveJSON );
    }
    console.log("Done")
  }

  // enable this if you want to read configuration in from
  // the current folder's package.json (in a "digger" property),
  // digger.config.json, etc.
  // toolbox.config = {
  //   ...toolbox.config,
  //   ...toolbox.config.loadConfig(process.cwd(), "digger")
  // }
}

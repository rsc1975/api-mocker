import { getParams } from './cli_parser';
import { MockServer } from './mock_server';


export const run = async () => {
    
    const params = getParams();

    const mockServer = new MockServer({...params});
    
    const exitApp = async (err: any) => {
        !!err && console.error(err);
        await mockServer.stop();
        process.exit(err ? 1 : 0);
        
    }
    process.on('unhandledRejection', exitApp);
    process.on('SIGINT', exitApp);
    
    await mockServer.start();
};

if (require.main === module) {
    run();
}



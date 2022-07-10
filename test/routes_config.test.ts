
import { defaultResponseConfig, getConfig, MockerConfig } from '../src/routes_config';

import Code from '@hapi/code';
import Lab from '@hapi/lab';

const { expect } = Code;
const { it, describe, before } = exports.lab = Lab.script();

describe('Testing routes config', () => {

    before(() => {
        process.env.NODE_ENV = 'test';
    });

    function evalDefaultConfig(conf: MockerConfig) : void{
        expect(conf).to.be.an.object();
        expect(conf['$defaultResponse$']!['success']).to.be.true;
        expect(conf['$error$']!['success']).to.be.false;
        expect(conf['routes']!['post']).to.be.an.object();
        expect(conf['routes']!['post']!['.*']).to.be.an.object();
        expect(conf['routes']!['post']!['.*']['success']).to.be.true;
    }

    it('checks default config', () => {
        evalDefaultConfig(defaultResponseConfig);        
    });

    it('checks default config indirect', () => {
        evalDefaultConfig(getConfig());        
    });

    it('overrides default config', () => {
        const newconfig = {
            routes: {
                post: {
                    "/${id}": {
                        success: false,
                        data: [12, {ok: true}]
                    },
                    "/": {
                        success: true,
                        data: "New API"
                    }
                }
            }
        };
        const composedConfig = getConfig(newconfig as MockerConfig);
        expect(composedConfig.$defaultResponse$!['success']).to.be.true;
        expect(composedConfig.routes!['post']!["/${id}"]).to.be.an.object();
        expect(composedConfig.routes!['post']!["/${id}"]['success']).to.be.false;
        expect(composedConfig.routes!['post']!["/${id}"]['data']).to.be.array;
        expect(composedConfig.routes!['post']!['/']['success']).to.be.true;
        expect(composedConfig.routes!['post']!['/']['data']).to.be.equal('New API');

    });

});
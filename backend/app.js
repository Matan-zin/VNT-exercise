import * as util from 'util';
import restify from 'restify';
import { default as cpuUsageRouter } from './route/cpu_usage.js';
import corsMiddleware  from 'restify-cors-middleware2';


const server = restify.createServer({ name: 'vnt-exercise' });


const cors = corsMiddleware({
  preflightMaxAge: 5, //Optional
  origins: ['*'],
  allowHeaders: ['API-Token'],
  exposeHeaders: ['API-Token-Expiry']
})

server.pre(cors.preflight)
server.use(cors.actual)

server.use(restify.plugins.authorizationParser());
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser({ mapParams: true }));

cpuUsageRouter(server);

server.listen(process.env.PORT, process.env.SERVICE_URL || 'localhost', () => {
    console.log(`listening on ${server.url}`)
})

process.on('uncaughtException', function(err) { 
    console.error(`[uncaught exception] ${ err.stack || err }`);
    process.exit(1);
});

process.on('unhandledRejection', (reason, p) => {
    console.error(`[unhandled rejection] ${util.inspect(p)} reason: ${reason}`);
    process.exit(1);
});
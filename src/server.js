import path from 'path';
import express from 'express';
import cookie from 'cookie';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
// import { Engine } from 'apollo-engine';
import compression from 'compression';
import bodyParser from 'body-parser';
import { createServer } from 'http';
import { execute, subscribe } from 'graphql';

import { User, Event } from './Data/models'
import schema, { FullSchemaDeff } from './schema';


// Arguments usually come from env vars
export function run({ SESSION_STORE_SECRET, ENGINE_API_KEY, PORT: portFromEnv = 3100,} = {}) {

  let port = portFromEnv;
  if (typeof portFromEnv === 'string') {
    port = parseInt(portFromEnv, 10);
  }

  const app = express();

  app.use(compression());

  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.get('/schema', (req, res) => {
    res.send(FullSchemaDeff)
  })

  app.use('/graphql', graphqlExpress((req) => {
    // Prime the data Loader in the user model with the current signed in user
    // UserModel._prime(req.user)
    // const UserModel = new User();
    // const EventModel = new Event();

    return {
      schema,
      // tracing: true,
      context: {
        User: {},
        Event: {},
      },
    };
  }));

  app.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql',
  }));

  // Serve our helpful static files
  // app.get('/', (req, res) => {
  //   res.sendFile(path.join(__dirname, 'public'));
  // });

  const server = createServer(app);

  server.listen(port, () => {
    console.log(`API Server is now running on http://localhost:${port}`); // eslint-disable-line no-console
  });
  return server;
}
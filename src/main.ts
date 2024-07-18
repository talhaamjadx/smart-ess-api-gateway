import { server } from './http/server';
import './http/router';
import { authWatchManager } from './actions/auth-service';

async function main() {
  await authWatchManager();
  server.listen(
    {
      port: Number.parseInt(process.env.PORT || '8000'),
      host: process.env.HOST || '0.0.0.0',
    },
    (err) => {
      if (err) {
        server.log.error(err);
        console.error(err);
        process.exit(1);
      } else {
        console.log('Server started');
      }
    },
  );
}

main();

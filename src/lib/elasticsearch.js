import { Client } from '@elastic/elasticsearch';
import logger from './logger';

let client = null;

const ELASTICSEARCH_NODE = process.env.ELASTICSEARCH_NODE;
const ELASTICSEARCH_USERNAME = process.env.ELASTICSEARCH_USERNAME;
const ELASTICSEARCH_PASSWORD = process.env.ELASTICSEARCH_PASSWORD;

if (ELASTICSEARCH_NODE && ELASTICSEARCH_USERNAME && ELASTICSEARCH_PASSWORD) {
  const clientSingleton = () => {
    return new Client({
      node: ELASTICSEARCH_NODE,
      auth: {
        username: ELASTICSEARCH_USERNAME,
        password: ELASTICSEARCH_PASSWORD,
      },
      // If you are using a self-signed certificate with a local instance,
      // you might need to uncomment the following lines:
      // tls: {
      //   rejectUnauthorized: false
      // }
    });
  };

  const globalForElastic = globalThis;
  client = globalForElastic.elasticClient ?? clientSingleton();

  if (process.env.NODE_ENV !== 'production') {
    globalForElastic.elasticClient = client;
  }
} else {
  logger.warn(
    'Elasticsearch client not initialized due to missing environment variables. ' +
    'This is expected during build but is an error at runtime if Elasticsearch is required.'
  );
  const missingVars = [];
  if (!ELASTICSEARCH_NODE) missingVars.push('ELASTICSEARCH_NODE');
  if (!ELASTICSEARCH_USERNAME) missingVars.push('ELASTICSEARCH_USERNAME');
  if (!ELASTICSEARCH_PASSWORD) missingVars.push('ELASTICSEARCH_PASSWORD');
  if (missingVars.length > 0) {
    logger.warn(`Missing variables: ${missingVars.join(', ')}`);
  }
}

export default client;
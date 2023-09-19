import { Handler } from '@netlify/functions';
import fs from 'fs';

const handler: Handler = async (event, context) => {
  const serviceAccount = {
    type: process.env.SA_TYPE,
    project_id: process.env.SA_PROJECT_ID,
    private_key_id: process.env.SA_PRIVATE_KEY_ID,
    private_key: process.env.SA_PRIVATE_KEY,
    client_email: process.env.SA_CLIENT_EMAIL,
    client_id: process.env.SA_CLIENT_ID,
    auth_uri: process.env.SA_AUTH_URI,
    token_uri: process.env.SA_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.SA_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.SA_CLIENT_X509_CERT_URL,
    universe_domain: process.env.SA_UNIVERSE_DOMAIN,
  };

  fs.writeFileSync('service-account.json', JSON.stringify(serviceAccount));

  return {
    statusCode: 200,
    body: 'Fichier service-account.json créé avec succès.',
  };
};

export { handler };

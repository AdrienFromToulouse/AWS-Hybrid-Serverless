import https from 'https';

export const agent = new https.Agent({
  keepAlive: false,
  ciphers: 'ALL',
  secureProtocol: 'TLSv1_method',
});

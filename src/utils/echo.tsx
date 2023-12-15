// import Echo from 'laravel-echo';
// import Pusher from 'pusher-js';

// window.Pusher = Pusher;
// // const echo = new Echo(options);
//   let echo = new Echo({
//     broadcaster: 'pusher',
//     key: 'app-key',
//     // wsHost: 'api.test.turtlepic.com',
//     wsHost: '127.0.0.1',
//     wsPort: '6001',
//     forceTLS: false,
//     encrypted: false,
//     disableStats: true,
//     enabledTransports: ['ws'],
//     cluster: 'mt1',
//   });

// export default echo;

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
window.Pusher = Pusher;
const options = {
  broadcaster: 'pusher',
  key: 'app-key',
  // wsHost: '127.0.0.1',
  wsHost : 'api.test.turtlepic.com',
  // wsPort: '6001',
  forceTLS: false,
  encrypted: false,
  disableStats: true,
  enabledTransports: ['ws'],
  cluster: 'mt1',
};

const echo = new Echo({
  broadcaster: options.broadcaster,
  key: options.key,
  wsHost: options.wsHost,
  // wsPort: options.wsPort,
  forceTLS: options.forceTLS,
  encrypted: options.encrypted,
  disableStats: options.disableStats,
  enabledTransports: options.enabledTransports,
  cluster: options.cluster
});

export default echo;


#!/usr/bin/env node
/*
Simple Socket.IO load test script.
- Opens N concurrent socket.io-client connections to the backend
- Optionally authenticates via handshake auth token (Bearer <JWT>)
- Joins a `stream:{streamId}` room and listens for viewer-joined-stream events

Usage:
  node socket-io-loadtest.js --url=http://localhost:4000 --concurrency=50 --streamId=test-stream --token="Bearer <JWT>"

Notes:
- This is a smoke-test utility. It does not simulate video traffic (just socket connections and simple emits).
- Keep concurrency modest on local machines (50-200). For large-scale tests use k6/Artillery on remote machines.
*/

const { io } = require('socket.io-client');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const argv = yargs(hideBin(process.argv))
  .option('url', { type: 'string', default: 'http://localhost:4000' })
  .option('concurrency', { type: 'number', default: 50 })
  .option('streamId', { type: 'string', default: 'test-stream' })
  .option('token', { type: 'string', default: '' })
  .option('staggerMs', { type: 'number', default: 20 })
  .argv;

const url = argv.url;
const concurrency = argv.concurrency;
const streamId = argv.streamId;
const token = argv.token;
const staggerMs = argv.staggerMs;

console.log(`Load test starting: ${concurrency} clients -> ${url} (streamId=${streamId})`);

let connected = 0;
let failed = 0;

function createClient(i) {
  const opts = {
    reconnection: false,
    transports: ['websocket'],
  };
  if (token) opts.auth = { token };

  const socket = io(url, opts);

  socket.on('connect', () => {
    connected++;
    if (connected % 10 === 0) process.stdout.write(`.${connected}`);
    // join live stream room
    socket.emit('join-live-stream', { streamId });

    // optional: listen for viewer count updates
    socket.on('viewer-joined-stream', (payload) => {
      // for smoke test, we won't log every event to avoid flooding stdout
    });

    // optional: send a heartbeat or small comment
    if (i % 20 === 0) {
      socket.emit('new-comment', { videoId: streamId, comment: { text: 'smoke test', userId: `bot-${i}` } });
    }
  });

  socket.on('connect_error', (err) => {
    failed++;
    console.error(`connect_error [${i}]:`, err && err.message ? err.message : err);
    socket.close();
  });

  socket.on('error', (err) => {
    failed++;
    console.error(`error [${i}]:`, err);
    socket.close();
  });

  socket.on('disconnect', (reason) => {
    // track disconnects if needed
  });

  return socket;
}

(async function main() {
  const sockets = [];

  for (let i = 0; i < concurrency; i++) {
    // small stagger to avoid opening all connections at once
    await new Promise((r) => setTimeout(r, staggerMs));
    try {
      const s = createClient(i);
      sockets.push(s);
    } catch (e) {
      failed++;
    }
  }

  // summary every 2s
  const summary = setInterval(() => {
    console.log(`\nconnected=${connected} failed=${failed} total=${sockets.length}`);
  }, 2000);

  // run for 60s by default then cleanup
  setTimeout(() => {
    clearInterval(summary);
    console.log('Test complete. Closing sockets...');
    sockets.forEach((s) => s.close());
    setTimeout(() => process.exit(0), 500);
  }, 60 * 1000);
})();

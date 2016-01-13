import Server from 'socket.io';

export default function startServer() {
  const io = new Server().attach(8090);

  store.subscribe(
    () => io.emit('state', store.getState().toJS());
  );

  io.on('connection', (socket) => {
    // Emit state
    socket.emit('state', store.getState().toJS());

    // Receive actions
    socket.on('action', store.dispatch.bind(store));
  });
}
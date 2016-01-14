import Server from 'socket.io';

export default function startServer(store) {
  const io = new Server().attach(8090);

  store.subscribe(
    () => io.emit('state', store.getState().toJS())
  );

  io.on('connection', (socket) => {
    // Emit state
    setTimeout(function() {
    socket.emit('state', store.getState().toJS());

    }, 500)

    // Receive actions
    socket.on('action', store.dispatch.bind(store));
  });
}
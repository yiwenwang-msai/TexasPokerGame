'use strict';

import { Controller } from 'egg';

class NspController extends Controller {
  async exchange() {
    const { ctx } = this;
    const socket = ctx.socket as any;
    const app = ctx.app as any;
    const nsp = app.io.of('/socket');
    const message = ctx.args[0] || {};
    const { room } = socket.handshake.query;
    const rooms = [room];
    try {
      const { payload } = message;
      console.log('rooms', rooms)
      nsp.adapter.clients(rooms, (err: any, clients: any) => {
        console.log('clients-------exchange', clients);
        // 广播信息
        nsp.to(room).emit('online', {
          clients,
          action: 'broadcast',
          target: 'participator',
          message: payload,
        });
      });
    } catch (error) {
      app.logger.error(error);
    }
  }
}

module.exports = NspController;

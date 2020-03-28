import { Application } from 'midway'

export default function (app: Application) {
  app.io.of('/socket').route('exchange', app.io.controller.nsp.exchange);
}

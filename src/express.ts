import * as express from 'express';
import { Application } from 'express';
import routes from './routes';
import * as correlator from 'express-correlation-id';

class App {
		public appExpress: Application;

		public constructor() {
				this.appExpress = express();
				this.config();
				this.appExpress.use(routes);
		}

		private config(): void {
				this.appExpress.use(express.static('assets'));
				this.appExpress.use(
						express.json({
								verify(req, res, buf) {
										req.rawBody = buf
								},
						}),
				);
				this.appExpress.use(express.urlencoded({ extended: false }));
				this.appExpress.use(correlator());
				this.appExpress.use((req, res, next): void => {
						next()
				});
		}
}

export const app = new App();

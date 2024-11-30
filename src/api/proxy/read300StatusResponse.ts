import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { type Request, type Response, type Router } from 'express';
import { z } from 'zod';

import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { ServiceResponse } from '@/common/models/serviceResponse';
import { handleServiceResponse } from '@/common/utils/httpHandlers';
import { logger } from '@/server';
import { PATHS } from '../../constants';

export const openApiRegistry = new OpenAPIRegistry();
export const router: Router = express.Router();

openApiRegistry.registerPath({
	method: 'get',
	path: PATHS.read300StatusResponse,
	tags: ['Read 300 HTTP Status Response'],
	responses: createApiResponse(z.null(), 'Success'),
});

router.get('/', async (_req: Request, apiRes: Response) => {
	try {
		let nextUrlStr: string = _req.query['nextUrl'] as string;
		if (Array.isArray(nextUrlStr)) {
			let str = nextUrlStr.at(0);
			if (str?.length) {
				str = (str).replace(/"/gi, '');
				nextUrlStr = decodeURIComponent(str);
			}
		} else {
			nextUrlStr = decodeURIComponent(nextUrlStr);
		}
		if (nextUrlStr) {
			const nextUrl = new URL(nextUrlStr.trim().replace(/"/gi, ''));
			const opts: RequestInit = {
				redirect: 'manual',
				headers: {
					cookie: `G_ENABLED_IDPS=google; ${_req.header('cf_clearance_cookie')};`,
					// origin: nextUrl.origin,
					// referer: nextUrl.toString(),
					// pragma: 'no-cache',
					// priority: 'u=0, i',
					// ':authority': nextUrl.host,
					// ':method': 'GET',
					// ':path': nextUrl.pathname,
					// ':scheme': 'https',
					// "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
					// "accept-language": "en",
					// "cache-control": "no-cache",
					// "sec-ch-ua": "\"Google Chrome\";v=\"131\", \"Chromium\";v=\"131\", \"Not_A Brand\";v=\"24\"",
					// "sec-ch-ua-arch": "\"x86\"",
					// "sec-ch-ua-bitness": "\"64\"",
					// "sec-ch-ua-full-version": "\"131.0.6778.86\"",
					// "sec-ch-ua-full-version-list": "\"Google Chrome\";v=\"131.0.6778.86\", \"Chromium\";v=\"131.0.6778.86\", \"Not_A Brand\";v=\"24.0.0.0\"",
					// "sec-ch-ua-mobile": "?0",
					// "sec-ch-ua-model": "\"\"",
					// "sec-ch-ua-platform": "\"Windows\"",
					// "sec-ch-ua-platform-version": "\"10.0.0\"",
					// "sec-fetch-dest": "document",
					// "sec-fetch-mode": "navigate",
					// "sec-fetch-site": "same-origin",
					// "sec-fetch-user": "?1",
					// "upgrade-insecure-requests": "1",
					'user-agent': _req.header('user-agent') ?? '',
				},
				// "referrer": nextUrl.toString().trim(),
				// "referrerPolicy": "strict-origin-when-cross-origin",
				// "method": "GET",
				// "mode": "cors",
				// "credentials": "include",
				// "body": null,
			};
			console.log('opts:', opts);

			const nextUrlRes = await fetch(nextUrl, opts);
			const body = await nextUrlRes.text();
			const headers = Object.fromEntries(nextUrlRes.headers);
			const serviceResponse = ServiceResponse.success(``, { body, headers });
			return handleServiceResponse(serviceResponse, apiRes);
		} else {
			throw new Error(`'nextUrl' not found or invalid!`);
		}
	} catch (error) {
		console.log('ERROR:', error);

		const serviceResponse = ServiceResponse.failure(`Invalid 'newUrl'`, { error });
		return handleServiceResponse(serviceResponse, apiRes);
	}
});

router.get('/redirect', (_req: Request, res: Response) => {
	logger.info('Sending Redirect!');
	return res.redirect(302, 'https://google.com');
});

export const read300StatusResponseRouter = router;
export const read300StatusResponseApiRegistry = openApiRegistry;

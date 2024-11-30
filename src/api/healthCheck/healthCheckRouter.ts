import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { type Request, type Response, type Router } from 'express';
import { z } from 'zod';

import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { ServiceResponse } from '@/common/models/serviceResponse';
import { handleServiceResponse } from '@/common/utils/httpHandlers';

const openApiRegistry = new OpenAPIRegistry();
const router: Router = express.Router();

openApiRegistry.registerPath({
	method: 'get',
	path: '/proxy',
	tags: ['Health Check'],
	responses: createApiResponse(z.null(), 'Success'),
});

router.get('/', (_req: Request, res: Response) => {
	const serviceResponse = ServiceResponse.success('Service is healthy', null);
	return handleServiceResponse(serviceResponse, res);
});

export const healthCheckRouter = router;
export const healthCheckApiRegistry = openApiRegistry;

import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { type Router } from 'express';
import { z } from 'zod';

import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { GetUserSchema, UserSchema } from '@/api/user/userModel';
import { validateRequest } from '@/common/utils/httpHandlers';
import { PATHS } from '../../constants';
import { userController } from './userController';

const openApiRegistry = new OpenAPIRegistry();
const router: Router = express.Router();

openApiRegistry.register('User', UserSchema);

openApiRegistry.registerPath({
	method: 'get',
	path: PATHS.users,
	tags: ['User'],
	responses: createApiResponse(z.array(UserSchema), 'Success'),
});
router.get('/', userController.getUsers);

openApiRegistry.registerPath({
	method: 'get',
	path: `${PATHS.users}/{id}`,
	tags: ['User'],
	request: { params: GetUserSchema.shape.params },
	responses: createApiResponse(UserSchema, 'Success'),
});
router.get('/:id', validateRequest(GetUserSchema), userController.getUser);

export const userApiRegistry = openApiRegistry;
export const userRouter = router;

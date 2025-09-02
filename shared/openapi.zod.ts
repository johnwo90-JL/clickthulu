// Generated from OpenAPI. Do not edit by hand.
import { z } from 'zod';
export const PostApiAuthLoginRequestBody = z.object({"username": z.string(), "password": z.string()});
export const PostApiAuthRefreshTokenRequestBody = z.object({"refreshToken": z.string()});
export const GetApiServerHealthResponse200 = z.object({"status": z.string().optional(), "database": z.string().optional(), "timestamp": z.number().optional()});
export const PostApiUsersRequestBody = z.object({"username": z.string().optional(), "email": z.string().optional(), "password": z.string().optional()});
export const GetApiUsersIdPathParams = z.object({"id": z.string()});
export const PostApiUsersIdClickPathParams = z.object({"id": z.string()});
export const GetApiUsersIdUpgradesPathParams = z.object({"id": z.string()});
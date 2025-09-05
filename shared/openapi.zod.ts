// Generated from OpenAPI. Do not edit by hand.
import { z } from 'zod';
export const PostApiAuthLoginRequestBody = z.object({"username": z.string(), "password": z.string()});
export const PostApiAuthRefreshTokenRequestBody = z.object({"refreshToken": z.string()});
export const GetApiCardsCardIdPathParams = z.object({"cardId": z.string()});
export const PostApiCardsCardIdPathParams = z.object({"cardId": z.string()});
export const PostApiCardsCardIdRequestBody = z.object({"amount": z.number().int().optional()});
export const PostApiCardsCardIdActivatePathParams = z.object({"cardId": z.string()});
export const PostApiGameClickRequestBody = z.object({"clicks": z.number().int().optional()});
export const GetApiServerHealthResponse200 = z.object({"status": z.string().optional(), "database": z.string().optional(), "timestamp": z.number().optional()});
export const PostApiUsersRequestBody = z.object({"username": z.string().optional(), "email": z.string().optional(), "password": z.string().optional()});
export const GetApiUsersIdPathParams = z.object({"id": z.string()});
export const PostApiUsersIdClickPathParams = z.object({"id": z.string()});
export const GetApiUsersIdUpgradesPathParams = z.object({"id": z.string()});
export const GetApiUsersIdAchievementsPathParams = z.object({"id": z.string()});
export const GetApiWorshippersIdPathParams = z.object({"id": z.string()});
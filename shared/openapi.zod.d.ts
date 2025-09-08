import { z } from 'zod';
export declare const PostApiAuthLoginRequestBody: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const PostApiAuthRefreshTokenRequestBody: z.ZodObject<{
    refreshToken: z.ZodString;
}, z.core.$strip>;
export declare const GetApiCardsCardIdPathParams: z.ZodObject<{
    cardId: z.ZodString;
}, z.core.$strip>;
export declare const PostApiCardsCardIdPathParams: z.ZodObject<{
    cardId: z.ZodString;
}, z.core.$strip>;
export declare const PostApiCardsCardIdRequestBody: z.ZodObject<{
    amount: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const PostApiCardsCardIdActivatePathParams: z.ZodObject<{
    cardId: z.ZodString;
}, z.core.$strip>;
export declare const PostApiGameClickRequestBody: z.ZodObject<{
    clicks: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const GetApiServerHealthResponse200: z.ZodObject<{
    status: z.ZodOptional<z.ZodString>;
    database: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const PostApiUsersRequestBody: z.ZodObject<{
    username: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    password: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const GetApiUsersIdPathParams: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export declare const PostApiUsersIdClickPathParams: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export declare const GetApiUsersIdUpgradesPathParams: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export declare const GetApiUsersIdAchievementsPathParams: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export declare const GetApiWorshippersIdPathParams: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;

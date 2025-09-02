
/**
 * Generic container for request bodies.
 * T is the payload type.
 */
interface PostData<T> {
    data: T;
}

/**
 * Request shape for user auth endpoints.
 * T is the endpoint key used in the URL.
 */
interface UserRequest<T extends string> extends PostData<{
    username: string;
    password: string;
}> {
    meta: {
        method: "POST";
        url: `/users/${T}`;
        sentAt: Date;
    }
}


/**
 * Standard metadata included with every API response.
 */
interface MetaInterface {
    ok: boolean;
    status: number;
    error?: string;
    code?: number;
    message: string;
    
    timestamp: number;
    next?: string;
    previous?: string;
    count?: number;
    total?: number;
    page?: number;
    limit?: number;
    sort?: string;
}

/**
 * Generic API response envelope with meta and data.
 * T is the shape of the data payload.
 */
interface ApiResponse<T> {
    meta: MetaInterface;
    data: T | null;
}

/** Login request payload wrapper. */
interface UserLogin extends UserRequest<"login"> { }

/** Registration request payload wrapper. */
interface UserRegister extends UserRequest<"register"> { }

export { UserLogin, UserRegister };

// === Auth response interfaces ===

/** Minimal public info for an authenticated user. */
interface AuthenticatedUserInfo {
    id: string;
    username: string;
    email: string;
}

/** Access and refresh tokens returned by the API. */
interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

/** Response for POST /auth/login */
interface AuthLoginResponse extends ApiResponse<AuthTokens & { user: AuthenticatedUserInfo }>{}

/** Response for POST /auth/refreshToken */
interface AuthRefreshResponse extends ApiResponse<AuthTokens>{}

/** Response for POST /auth/logout */
interface AuthLogoutResponse extends ApiResponse<{ ok: true } | { error: string }>{}

export { AuthenticatedUserInfo, AuthTokens, AuthLoginResponse, AuthRefreshResponse, AuthLogoutResponse };

// === Users and Game Data response interfaces ===

/** Compact projection of a user for listings. */
interface UserSummary {
    id: string;
    username: string;
    email: string;
    totalClicks: number;
    totalCoins: number;
    currentLevel: number;
    createdAt: string | Date;
}

/** Response for GET /users */
interface GetUsersResponse extends ApiResponse<UserSummary[]>{}

/** One gameplay session summary. */
interface GameStatsEntry {
    id: string;
    sessionStart: string | Date;
    sessionEnd?: string | Date;
    clicksInSession: number;
    coinsEarned: number;
}

/** Achievement definition summary. */
interface AchievementSummary {
    id: string;
    name: string;
    description: string;
    type: string;
    target: number;
    reward: number;
}

/** Upgrade base definition summary. */
interface UpgradeBaseSummary {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    upgradeLevel: number;
    maxLevel: number;
    cost: number;
    costPerLevelMultiplier: number;
    multiplier: number;
    multiplierPerLevelMultiplier: number;
}

/** Detailed user with relations. */
interface UserDetail extends UserSummary {
    gameStats: GameStatsEntry[];
    achievements: { achievement: AchievementSummary }[];
    upgrades: { upgradeBase: UpgradeBaseSummary }[];
}

/** Response for GET /users/:id */
interface GetUserDetailResponse extends ApiResponse<UserDetail>{}

/** Result object for a click action. */
interface ClickResult {
    user: UserSummary & { totalClicks: number; totalCoins: number };
    coinsEarned: number;
    newAchievements: AchievementSummary[];
}

/** Response for POST /users/:id/click */
interface PostUserClickResponse extends ApiResponse<ClickResult>{}

/** Response for GET /achievements */
interface GetAchievementsResponse extends ApiResponse<AchievementSummary[]>{}

/** Response for GET /upgrades */
interface GetUpgradesResponse extends ApiResponse<UpgradeBaseSummary[]>{}

export {
    UserSummary,
    GetUsersResponse,
    GameStatsEntry,
    AchievementSummary,
    UpgradeBaseSummary,
    UserDetail,
    GetUserDetailResponse,
    ClickResult,
    PostUserClickResponse,
    GetAchievementsResponse,
    GetUpgradesResponse,
};
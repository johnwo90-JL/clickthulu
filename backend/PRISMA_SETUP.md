# Clickthulu Backend

Backend now includes Prisma ORM with support for both SQLite (development) and PostgreSQL (production).

## Quick Start

1. **Environment Setup**
   ```bash
      VERSION_NUMBER= # Default: 1
      PORT= # Default: 3000

      REFRESH_TOKEN_EXPIRES_IN_SECONDS= # Default: 10800
      TOKEN_EXPIRY_INTERVAL= # Default: 3600
      JWT_SECRET= # Default: "!! CHANGE ME !!

      DATABASE_URL= # Type: `[protocol]://[user].[instanceId]:[pass]@[URL]?pgbouncer=true`
      DIRECT_URL= # Type: `[protocol]://[user].[instanceId]:[pass]@[URL]?pgbouncer=true`
   ```

2. **Database Setup**
   ```bash
   # Generate Prisma client
   npm db:generate
   
   # Run migrations
   npm run db:migrate
   
   # Seed the database with initial data
   npm run db:seed
   ```

3. **Start the Server**
   ```bash
   npm run dev
   ```

4. **Access the API**
   - Swagger UI: http://localhost:3000/docs
   - Health Check: http://localhost:3000/api/health

## Database Models

### User
- `id`, `email`, `username`, `passwordHash`, timestamps
- Relations: `gameStats` (1:1), `achievements` (many), `userWorshippers`, `userCards`, `refreshTokens`, `gameSessions`, `activationLogs`

### RefreshToken
- `id`, `userId`, `tokenHash`, `createdAt`, `expiresAt`, `revokedAt?`
- Belongs to `User` (cascade on delete)

### GameSession
- `id`, `userId`, `timeActiveSession`, `timeActiveTotal`
- Belongs to `User`

### GameStats
- `id`, `userId`
- Clicks: `clickPower`, `totalClicks`, `clickHistory?`, `clicksInSession`
- Devotion: `devotionPerSecond`, `totalDevotion`
- Level/XP: `currentLevel`, `xp`, `nextLevelXp`, `xpPerSecond`, `clicksPerSecond`, `xpPerClick`
- Prestige: `prestige`, `prestigeLevel`
- Timestamps: `lastCalculatedAt?`, `lastLoggedInAt?`, `lastLoggedOutAt?`, `lastClickAt?`
- Unique per `userId`

### AchievementDefinition
- Master achievement catalog: `id`, `name` (unique), `description`, `target` (Json), `rewards` (Json), `isActive`, `schemaVersion`

### Achievement (UserAchievements)
- User unlocks: `id`, `userId`, `achievementId`, `unlockedAt`
- Unique per (`userId`, `achievementId`)

### Upgrade (Prototype)
- `id` (opaque), `name` (unique), `shortName` (unique, stable code), `description`, `imgUrl?`
- `requirements` (Json), `schemaVersion`, `isActive`, `level`, `maxLevel`
- Relations to prototypes: `worshipperPrototypes?`, `cardPrototypes?`

### WorshipperType (Prototype)
- `id`, `typeId` (unique)
- `upgrade` relation via `typeId -> Upgrade.shortName`
- Flags/timestamps and relations to `Worshipper` and effects

### CardType (Prototype)
- `id`, `typeId` (unique)
- `upgrade` relation via `typeId -> Upgrade.shortName`
- Flags/timestamps and relations to `Card` and effects

### Worshipper (User-owned)
- `id`, `userId`, `worshipperId` (-> `WorshipperType.id`), `count`, `level`, timestamps
- Unique per (`userId`, `worshipperId`)

### Card (User-owned)
- `id`, `userId`, `cardId` (-> `CardType.id`), `count`, `level`, timestamps
- Unique per (`userId`, `cardId`)

### UpgradeEffect
- `id`, `values` (Json, supports level arrays), `isActive`, timestamps
- Linked via explicit join tables below

### CardEffect (join)
- Composite PK: (`cardTypeId`, `effectId`)
- Metadata: `order`, `minLevel`, `isPassive`

### WorshipperEffect (join)
- Composite PK: (`worshipperTypeId`, `effectId`)
- Metadata: `order`, `minLevel`, `isPassive`

### ActivationLog
- `id`, `userId`, `source` ('card' | 'worshipper' | 'upgrade'), `sourceId`, `level`, `startedAt`, `durationSec?`, `cooldownSec?`
- Indexed by (`userId`, `source`, `sourceId`)

## 🛠 Available API Endpoints

Note: Endpoints are mounted with an optional prefix controlled by env vars:
- `USE_API_PREFIX=true` → prefix `/api`
- `USE_VERSIONING=true` and `VERSION_NUMBER` → prefix `/api/v{VERSION_NUMBER}`

Below, `PREFIX` represents that computed prefix (could be empty string).

### Health & System
- `GET PREFIX/server/health` - API and database health

### Auth
- `POST PREFIX/auth/login`
- `POST PREFIX/auth/refreshToken`
- `POST PREFIX/auth/logout`

### Users
- `GET PREFIX/users` - List users
- `GET PREFIX/users/:id` - Get user details
- `POST PREFIX/users` - Create user
- `POST PREFIX/users/:id/click` - Record clicks for a user
- `GET PREFIX/users/:id/upgrades` - List user upgrades

### Achievements
- `GET PREFIX/achievements` - List achievements

### Upgrades
- `GET PREFIX/upgrades` - List upgrades

### Game
- `POST PREFIX/game/click`
- `GET PREFIX/game/calculate`

### Cards
- `GET PREFIX/cards` - List user cards
- `GET PREFIX/cards/:cardId` - Get card type details
- `POST PREFIX/cards/:cardId/activate` - Activate a card

### Worshippers
- `GET PREFIX/worshippers` - List user worshippers
- `GET PREFIX/worshippers/:id` - Get worshipper type details

## Database Operations

### Useful Prisma Commands
```bash
# Generate client after schema changes
npm run db:generate

# Create and apply migrations
npm run db:migrate

# Open Prisma Studio (database GUI)
npm run db:studio

# Re-seed the database
npm run db:seed
```

### Reset Database
```bash
npm run db:reset
npm run db:seed
```

## Switching Between SQLite and PostgreSQL

### PostgreSQL (Production)

1. **Update schema** in `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. **Update environment variables**:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/clickthulu?schema=public"
   ```

3. **Apply migrations**:
   ```bash
   npx prisma migrate dev
   ```

## Example Usage

### Create a User
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"username": "player1", "email": "player1@example.com"}'
```

### Record Clicks
```bash
curl -X POST http://localhost:3000/api/users/USER_ID/click \
  -H "Content-Type: application/json" \
  -d '{"clicks": 5}'
```

### Get User Stats
```bash
curl http://localhost:3000/api/users/USER_ID
```

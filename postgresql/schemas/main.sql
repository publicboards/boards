CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    username TEXT NOT NULL,
    passwdsalt TEXT NOT NULL,
    passwdhash TEXT NOT NULL,
    email TEXT NOT NULL,
    created TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_admin BOOLEAN NOT NULL DEFAULT FALSE,
    is_banned BOOLEAN NOT NULL DEFAULT FALSE,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    profile_text TEXT
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_banned ON users(is_banned);
CREATE INDEX IF NOT EXISTS idx_users_deleted ON users(is_deleted);
CREATE INDEX IF NOT EXISTS idx_users_verified ON users(is_verified);
CREATE INDEX IF NOT EXISTS idx_users_email_username ON users(email, username);

CREATE TABLE IF NOT EXISTS user_sessions (
    id TEXT PRIMARY KEY CHECK (LENGTH(id) = 128),
    user_id UUID REFERENCES users(id),
    created TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_access TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_valid BOOLEAN NOT NULL DEFAULT TRUE,
    ip_addresses TEXT[]
);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_is_valid ON user_sessions(is_valid);
CREATE INDEX IF NOT EXISTS idx_user_sessions_last_access ON user_sessions(last_access);
CREATE INDEX IF NOT EXISTS idx_user_sessions_ip_addresses ON user_sessions USING GIN(ip_addresses);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id_is_valid ON user_sessions(user_id, is_valid);
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_sessions_token_user_id ON user_sessions(id, user_id);


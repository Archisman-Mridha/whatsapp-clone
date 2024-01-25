CREATE TABLE users (
  id SERIAL PRIMARY KEY,

  name VARCHAR(50) NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  password VARCHAR(50) NOT NULL,
  is_verified BOOL NOT NULL DEFAULT false
);

CREATE INDEX users_idx_phone ON users (phone);

CREATE TABLE profiles (
  id INT PRIMARY KEY,

  name VARCHAR(50) NOT NULL,
  status VARCHAR(150) NOT NULL,
  phone VARCHAR(20) NOT NULL
)

CREATE TABLE groups (
  id INT PRIMARY KEY,

  name VARCHAR(50) NOT NULL,
  description VARCHAR(150) NOT NULL
);

CREATE TABLE group_user_junctions (
  group_id INT REFERENCES groups(id) ON DELETE CASCADE,

  member_id INT REFERENCES profiles(id) ON DELETE CASCADE,
  is_admin BOOLEAN DEFAULT FALSE,

  PRIMARY KEY (group_id, member_id)
);
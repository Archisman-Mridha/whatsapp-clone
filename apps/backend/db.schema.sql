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
);

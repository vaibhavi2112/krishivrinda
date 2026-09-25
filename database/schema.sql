CREATE TYPE user_role AS ENUM ('farmer', 'dealer', 'worker', 'admin');
CREATE TYPE app_status AS ENUM ('pending', 'accepted', 'rejected', 'completed');

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  mobile VARCHAR(15) UNIQUE NOT NULL,
  name VARCHAR(100),
  role user_role NOT NULL,
  district VARCHAR(50),
  taluka VARCHAR(50),
  village VARCHAR(50),
  pincode VARCHAR(6),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  profile_image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_users_mobile ON users(mobile);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_district ON users(district);

CREATE TABLE commodities (
  id SERIAL PRIMARY KEY,
  farmer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  quantity DECIMAL(10,2) NOT NULL,
  price_per_unit DECIMAL(10,2) NOT NULL,
  unit VARCHAR(20) DEFAULT 'Quintal',
  image_url TEXT,
  description TEXT,
  district VARCHAR(50),
  is_sold BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_commodities_farmer ON commodities(farmer_id);
CREATE INDEX idx_commodities_district ON commodities(district);
CREATE INDEX idx_commodities_search ON commodities(name, district, is_sold);

CREATE TABLE carts (
  id SERIAL PRIMARY KEY,
  dealer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  commodity_id INTEGER REFERENCES commodities(id) ON DELETE CASCADE,
  quantity DECIMAL(10,2),
  status app_status DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200),
  message TEXT,
  type VARCHAR(50),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);

CREATE TABLE jobs (
  id SERIAL PRIMARY KEY,
  posted_by INTEGER REFERENCES users(id) ON DELETE CASCADE,
  job_type VARCHAR(100),
  workers_required INTEGER NOT NULL,
  wage_per_day DECIMAL(10,2),
  start_date DATE,
  end_date DATE,
  start_time TIME,
  description TEXT,
  district VARCHAR(50),
  taluka VARCHAR(50),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_jobs_district ON jobs(district);
CREATE INDEX idx_jobs_active ON jobs(is_active, start_date);

CREATE TABLE job_applications (
  id SERIAL PRIMARY KEY,
  job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
  worker_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  status app_status DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(job_id, worker_id)
);

CREATE TABLE mandi_prices (
  id SERIAL PRIMARY KEY,
  commodity_name VARCHAR(100) NOT NULL,
  mandi_name VARCHAR(100) NOT NULL,
  district VARCHAR(50) NOT NULL,
  min_price DECIMAL(10,2),
  max_price DECIMAL(10,2),
  modal_price DECIMAL(10,2),
  arrival_quantity DECIMAL(10,2),
  price_date DATE NOT NULL,
  source VARCHAR(50) DEFAULT 'manual',
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_mandi_lookup ON mandi_prices(commodity_name, district, price_date DESC);

CREATE TABLE complaints (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  subject VARCHAR(200),
  description TEXT,
  status VARCHAR(20) DEFAULT 'open',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE wage_benchmarks (
  id SERIAL PRIMARY KEY,
  district VARCHAR(50) NOT NULL,
  job_type VARCHAR(100) NOT NULL,
  avg_wage DECIMAL(10,2),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(district, job_type)
);

INSERT INTO wage_benchmarks (district, job_type, avg_wage) VALUES
('Nashik', 'Harvest', 400),
('Nashik', 'Loading', 350),
('Nashik', 'Sowing', 380),
('Pune', 'Harvest', 450),
('Pune', 'Sowing', 400),
('Pune', 'Loading', 400),
('Aurangabad', 'Harvest', 350),
('Aurangabad', 'Sowing', 330),
('Nagpur', 'Harvest', 370),
('Nagpur', 'Loading', 380),
('Kolhapur', 'Harvest', 420),
('Satara', 'Harvest', 400),
('Sangli', 'Harvest', 380),
('Ahmednagar', 'Harvest', 390),
('Solapur', 'Harvest', 370),
('Jalgaon', 'Harvest', 360),
('Amravati', 'Harvest', 350),
('Akola', 'Harvest', 340),
('Latur', 'Harvest', 350),
('Nanded', 'Harvest', 340),
('Chandrapur', 'Harvest', 340),
('Bhandara', 'Harvest', 330),
('Gondia', 'Harvest', 330),
('Wardha', 'Harvest', 340),
('Yavatmal', 'Harvest', 330),
('Buldhana', 'Harvest', 340),
('Hingoli', 'Harvest', 330),
('Parbhani', 'Harvest', 340),
('Beed', 'Harvest', 350),
('Osmanabad', 'Harvest', 350),
('Ratnagiri', 'Harvest', 400),
('Sindhudurg', 'Harvest', 420),
('Raigad', 'Harvest', 400),
('Thane', 'Harvest', 450),
('Palghar', 'Harvest', 400),
('Mumbai', 'Harvest', 500);
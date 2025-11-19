-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price INTEGER NOT NULL,
    image_url TEXT,
    description TEXT,
    stock INTEGER DEFAULT 0,
    rating DECIMAL(2,1) DEFAULT 0,
    reviews_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    user_id INTEGER REFERENCES users(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    total_amount INTEGER NOT NULL,
    delivery_method VARCHAR(50) NOT NULL,
    delivery_address TEXT,
    payment_method VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price INTEGER NOT NULL
);

-- Support chat sessions
CREATE TABLE IF NOT EXISTS support_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMP
);

-- Support messages
CREATE TABLE IF NOT EXISTS support_messages (
    id SERIAL PRIMARY KEY,
    session_id INTEGER REFERENCES support_sessions(id),
    user_id INTEGER REFERENCES users(id),
    message TEXT NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert owner account
INSERT INTO users (email, password_hash, name, role) 
VALUES ('owner@karsstore.com', '$2a$10$YourHashedPasswordHere', 'Владелец', 'owner')
ON CONFLICT (email) DO NOTHING;

-- Insert sample products
INSERT INTO products (name, category, price, image_url, rating, reviews_count, stock, description) VALUES
('DREAM Album Special Edition', 'albums', 2500, 'https://cdn.poehali.dev/projects/74625bc7-8a73-45c4-bd24-bdcfba30fa6c/files/922a3da0-021b-4f7b-8266-421e0c72e41b.jpg', 5, 127, 50, 'Специальное издание альбома с фотобуклетом'),
('Photocard Set Limited', 'photocards', 800, 'https://cdn.poehali.dev/projects/74625bc7-8a73-45c4-bd24-bdcfba30fa6c/files/1f1aac20-dd3a-4731-aa87-f2046c04b150.jpg', 5, 89, 100, 'Лимитированный набор фотокарточек'),
('Concert Poster A3', 'posters', 500, 'https://cdn.poehali.dev/projects/74625bc7-8a73-45c4-bd24-bdcfba30fa6c/files/0bca37fd-3425-4135-9d26-1b19b777c415.jpg', 4, 56, 75, 'Постер с концертного тура'),
('Mini Album Vol.2', 'albums', 1800, 'https://cdn.poehali.dev/projects/74625bc7-8a73-45c4-bd24-bdcfba30fa6c/files/922a3da0-021b-4f7b-8266-421e0c72e41b.jpg', 5, 203, 80, 'Второй мини-альбом группы'),
('Photocard Random Pack', 'photocards', 400, 'https://cdn.poehali.dev/projects/74625bc7-8a73-45c4-bd24-bdcfba30fa6c/files/1f1aac20-dd3a-4731-aa87-f2046c04b150.jpg', 4, 142, 150, 'Случайный набор из 3 фотокарточек'),
('Tour Poster Collection', 'posters', 1200, 'https://cdn.poehali.dev/projects/74625bc7-8a73-45c4-bd24-bdcfba30fa6c/files/0bca37fd-3425-4135-9d26-1b19b777c415.jpg', 5, 78, 40, 'Коллекция постеров с турне')
ON CONFLICT DO NOTHING;

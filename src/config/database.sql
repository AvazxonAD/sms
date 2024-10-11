CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100),
    login VARCHAR(100),
    password VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    client_fio VARCHAR(255),
    client_phone VARCHAR(15),
    report VARCHAR(500),
    senddate DATE,
    tashkilot VARCHAR(255),
    user_id INTEGER REFERENCES users(id),
    summa INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE sms_text (
    id SERIAL PRIMARY KEY,
    sms_string VARCHAR(1000),
    report_string VARCHAR(1000),
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE balance (
    id SERIAL PRIMARY KEY,
    balance INTEGER,
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE user_info (
    region_name VARCHAR(200),
    address VARCHAR(500),
    phone_number VARCHAR,
    fax VARCHAR,
    phone_number2 VARCHAR,
    account_number VARCHAR,
    inn VARCHAR,
    boos_fio VARCHAR,
    worker_fio VARCHAR,
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE
)
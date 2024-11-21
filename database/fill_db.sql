CREATE TABLE users (
    id serial PRIMARY KEY,
    username VARCHAR UNIQUE NOT NULL,
    password VARCHAR NOT NULL,
    role VARCHAR NOT NULL CHECK (role IN ('user', 'admin'))
);

CREATE TABLE tasks (
    id serial PRIMARY KEY,
    task_text VARCHAR UNIQUE NOT NULL,
    answer VARCHAR NOT NULL
);


CREATE TABLE user_to_task (
    user_id INT NOT NULL,
    task_id INT NOT NULL,
    task_status INT NOT NULL CHECK (task_status IN (0, 1)),
    PRIMARY KEY (user_id, task_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
);


INSERT INTO users (username, password, role)
VALUES ('admin', '$2b$10$zH2vsCTlfhiM6GEEeIylD.YDRiKXTM3t17GyJUMdG7AMmqrXVur.O', 'admin');


INSERT INTO tasks (task_text, answer)
VALUES
('Сколько часов осталось писать код, если можно писать его сутки, а ты уже писала 8 часов?', '4'),
('Решите уравнение: x + 5 = 12', '7'),
('Если у нас 6 пар каждый день 3 недели, то сколько у нас пар в итоге-то получается?', '108'),
('Найдите площадь равнобедренного треугольника, если его боковая сторона равна 5, а высота к основанию равна 4', '12');

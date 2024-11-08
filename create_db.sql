-- drop table users, tasks, user_to_task;

CREATE TABLE users (
    id serial PRIMARY KEY,
    username VARCHAR UNIQUE NOT NULL,
    full_name VARCHAR NOT NULL,
    personal_info VARCHAR,
    password VARCHAR NOT NULL,
    role VARCHAR NOT NULL CHECK (role IN ('user', 'admin'))
);

CREATE TABLE tasks (
    id serial PRIMARY KEY,
    task_text VARCHAR,
    answer VARCHAR
);

-- DROP TABLE user_to_task;

CREATE TABLE user_to_task (
    user_id INT NOT NULL,
    task_id INT NOT NULL,
    task_status INT NOT NULL CHECK (task_status IN (0, 1)),
    PRIMARY KEY (user_id, task_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
);

-- delete from users;
-- delete from tasks;


INSERT INTO users (username, full_name, personal_info, password, role)
VALUES ('suon', 'new name', 'info', '123', 'user');
-- ('anresu', 'Анна Иванова', 'Информацаия какая-то', '321', 'user'),
-- ('admin', 'Иван Иванов', 'Информацаия какая-то', '123', 'admin');

-- INSERT INTO tasks (task_text, answer)
-- VALUES ('Найдите площадь квадрата, если его диагональ равна 5', '12,5'),
-- ('Найдите площадь равнобедренного треугольника, если его боковая сторона равна 5, а высота к основанию равна 4', '12');

-- SELECT s.name, c.title
-- FROM user_to_task ut
-- JOIN users s ON ut.user_id = s.id
-- JOIN tasks t ON ut.task_id = t.id;

-- INSERT INTO user_to_task
-- VALUES (1, 1, 0);

-- drop table users, tasks, user_to_task;

CREATE TABLE users (
    id serial PRIMARY KEY,
    username VARCHAR UNIQUE NOT NULL,
    full_name VARCHAR NOT NULL,
    password VARCHAR NOT NULL,
    role VARCHAR NOT NULL CHECK (role IN ('user', 'admin'))
);

CREATE TABLE tasks (
    id serial PRIMARY KEY,
    task_text VARCHAR,
    answer VARCHAR
);


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


-- INSERT INTO users (username, full_name, password, role)
-- VALUES ('suon', 'new name', '123', 'user');
-- ('anresu', 'Анна Иванова', '321', 'user'),
-- ('admin', 'Иван Иванов', '123', 'admin');

-- INSERT INTO tasks (task_text, answer)
-- VALUES ('Сколько часов осталось писать код, если можно писать его сутки, а ты уже писала 8 часов?', '4');
-- ('Найдите площадь равнобедренного треугольника, если его боковая сторона равна 5, а высота к основанию равна 4', '12');

-- SELECT t.task_text, t.answer, ut.task_status FROM user_to_task ut JOIN users u ON ut.user_id = u.id JOIN tasks t ON ut.task_id = t.id where u.username=$1;

-- SELECT t.*
-- FROM tasks t
-- LEFT JOIN user_to_task ut ON t.id = ut.task_id AND ut.user_id = specific_user_id
-- WHERE ut.task_id IS NULL;

-- select * from users;
-- select * from tasks;
-- INSERT INTO user_to_task (user_id, task_id, task_status)
-- VALUES 
-- (10, 1, 0),
-- (10, 2, 1),
-- (10, 3, 0),
-- (10, 4, 1);

-- ALTER TABLE users
-- DROP COLUMN personal_info;
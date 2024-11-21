# Aedion tasks

Сайт для выполнения математических задач

### Создание базы данных, заполнение тестовыми данными

`chmod +x database/create_db.sh` \
`./database/create_db.sh`

### Запуск

`node app.js` \
http://localhost:3000

### API

Примеры запросов через Postman:

### User

`POST http://localhost:3000/register` \
Body:
{
    "username": "aedion",
    "full_name": "Aedion Ashryver",
    "password": 123
}

`POST http://localhost:3000/login` \
Body:
{
    "username": "suon",
    "password": 123
} \

`GET http://localhost:3000/dashboard`

`GET http://localhost:3000/tasks/todo`

`GET http://localhost:3000/tasks/done`

`http://localhost:3000/tasks/5/answer`
Body:
{
    "answer": 108
} \

`DELETE http://localhost:3000/tasks/5/undo`


### Admin

`GET http://localhost:3000/admin`

`GET http://localhost:3000/tasks`

`POST http://localhost:3000/tasks`
Создать задачу \
Body:
{
    "task_text": "Найдите площадь квадрата, если его сторона равна 4",
    "answer": 16
} \

`POST http://localhost:3000/tasks/6`
Изменить задачу \
Body:
{
    "task_text": "Найдите площадь квадрата, если его сторона равна 4.",
    "answer": 16
} \

`DELETE http://localhost:3000/tasks/6`


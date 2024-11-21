# Aedion tasks

Сайт для выполнения математических задач

## Создание базы данных, заполнение тестовыми данными

`chmod +x database/create_db.sh` \
`./database/create_db.sh`

## Запуск

`node app.js` \
http://localhost:3000

## API

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
}

`GET http://localhost:3000/dashboard` \
Headers:
{"Authorization": "Bearer YOUR_TOKEN"}

`GET http://localhost:3000/tasks/todo` \
Headers:
{"Authorization": "Bearer YOUR_TOKEN"}

`GET http://localhost:3000/tasks/done` \
Headers:
{"Authorization": "Bearer YOUR_TOKEN"}

`http://localhost:3000/tasks/5/answer` \
Body:
{
    "answer": 108
} \
Headers:
{"Authorization": "Bearer YOUR_TOKEN"}

`DELETE http://localhost:3000/tasks/5/undo` \
Headers:
{"Authorization": "Bearer YOUR_TOKEN"}


### Admin

`GET http://localhost:3000/admin` \
Headers:
{"Authorization": "Bearer YOUR_TOKEN"}

`GET http://localhost:3000/tasks` \
Headers:
{"Authorization": "Bearer YOUR_TOKEN"}

`POST http://localhost:3000/tasks` \
Создать задачу \
Body:
{
    "task_text": "Найдите площадь квадрата, если его сторона равна 4",
    "answer": 16
} \
Headers:
{"Authorization": "Bearer YOUR_TOKEN"}

`POST http://localhost:3000/tasks/6` \
Изменить задачу \
Body:
{
    "task_text": "Найдите площадь квадрата, если его сторона равна 4.",
    "answer": 16
} \
Headers:
{"Authorization": "Bearer YOUR_TOKEN"}

`DELETE http://localhost:3000/tasks/6` \
Headers:
{"Authorization": "Bearer YOUR_TOKEN"}

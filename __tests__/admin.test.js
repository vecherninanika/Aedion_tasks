import request from 'supertest';
import app from '../app.js';

// GET

request(app)
  .get('/admin/')
  .expect(200)
  .end(function(err, res){
    if (err) throw err;
    console.log(res.req.method, res.req.path, res.status);
});

request(app)
  .get('/tasks/')
  .expect(200)
  .end(function(err, res){
    if (err) throw err;
    console.log(res.req.method, res.req.path, res.status);
});


// POST 

request(app)
  .post('/tasks/')
  .expect(201)  // 
  .send({
    "task_text": "Найдите площадь квадрата, если его сторона равна 4",
    "answer": 16
})
  .end(function(err, res){
    if (err) throw err;
    console.log(res.req.method, res.req.path, res.status);
});

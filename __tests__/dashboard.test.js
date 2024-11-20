import request from 'supertest';
import app from '../app.js';

// GET

const adminToken = "Bearer ...";

request(app)
  .get('/dashboard/')
  .set("Authorization", adminToken)
  .expect(200)
  .end(function(err, res){
    if (err) throw err;
    console.log(res.req.method, res.req.path, res.status);
});

request(app)
  .get('/tasks/todo/')
  .expect(200)
  .end(function(err, res){
    if (err) throw err;
    console.log(res.req.method, res.req.path, res.status);
});

request(app)
  .get('/tasks/done/')
  .expect(200)
  .end(function(err, res){
    if (err) throw err;
    console.log(res.req.method, res.req.path, res.status);
});

// POST

request(app)
  .post('/tasks/5/answer/')
  .expect(302)  // 
  .send({
    "answer": 108
})
  .end(function(err, res){
    if (err) throw err;
    console.log(res.req.method, res.req.path, res.status);
});

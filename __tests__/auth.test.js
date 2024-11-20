import request from 'supertest';
import app from '../app.js';

// TODO create sample db???

// REGISTER

request(app)
  .get('/register/')
  .expect(200)
  .end(function(err, res){
    if (err) throw err;
    console.log(res.req.method, res.req.path, res.status);
});

request(app)
  .post('/register/')
  .expect(302) // redirect
  .send({
    "username": "test",
    "full_name": "test",
    "password": "test"
  })
  .end(function(err, res){
    if (err) throw err;
    console.log(res.req.method, res.req.path, res.status);
}); // delete afterwards


// LOGIN

request(app)
  .get('/login/')
  .expect(200)
  .end(function(err, res){
    if (err) throw err;
    console.log(res.req.method, res.req.path, res.status);
});

request(app)
  .post('/login/')
  .expect(302) // redirect
  .send({
    "username": "test2",
    "password": "test"
})
  .end(function(err, res){
    if (err) throw err;
    console.log(res.req.method, res.req.path, res.status);
});


// LOGOUT

request(app)
  .get('/logout/')
  .expect(200)
  .end(function(err, res){
    if (err) throw err;
    console.log(res.req.method, res.req.path, res.status);
});

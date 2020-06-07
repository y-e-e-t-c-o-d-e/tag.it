const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const chaiHttp = require('chai-http');

chai.use(chaiHttp)

// Test suite for index routes (make separate test file for each set of routes)
describe('index routes', () => {

  let server;

  // Set up function before every test
  beforeEach(() => {
    server = require('../app');
  });

  // Tear down function that runs after every test
  afterEach(() => {
    server.close();
  })

  it('should protect authenticated routes', (done) => {
    chai.request(server)
      .get('/api/protected')
      .end((err, res) => {
        res.should.have.status(401);
        done();
      })
  })

  it('should accept authenticated users', (done) => {
    chai.request(server)
      .get('/api/protected')
      .set("Authorization", "Bearer someuseruuid")
      .end((err, res) => {
        res.should.have.status(200);
        done();
      })
  })
});
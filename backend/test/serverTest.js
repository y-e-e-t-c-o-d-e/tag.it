const chai = require('chai');
const expect = chai.expect
const should = chai.should();
const chaiHttp = require('chai-http');

chai.use(chaiHttp)

// Our parent block
describe('routes', () => {

  let server;

  // Set up function before every test
  beforeEach(() => {
    server = require('../app');
  });

  // Tear down function that runs after every test
  afterEach(() => {
    server.close();
  })

  it('it should GET a hello world string', (done) => {
    chai.request(server)
      .get('/')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('response')
        // Must always call done after each test case to ensure that the test finishes
        done()
      })
    })
    
    it('should protect authenticated routes', (done) => {
      chai.request(server)
      .get('/protected')
      .end((err, res) => {
        res.should.have.status(401);
        done();
      })
    })
    
    it('should accept authenticated users', (done) => {
      chai.request(server)
      .get('/protected')
      .set("Authorization", "Bearer someuseruuid")
      .end((err, res) => {
        res.should.have.status(200);
        done();
      })
    })

  it('should return a string', () => {
    expect('ci with travis').to.equal('ci with travis');
  });
});

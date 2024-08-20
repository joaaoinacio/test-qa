import request from 'supertest';
import jwt from 'jsonwebtoken';

const baseURL = 'http://localhost:3000';

describe('POST /user/login', () => {
  jest.setTimeout(15000);

  it('should login successfully with valid credentials and validate token payload', async () => {
    const response = await request(baseURL)
      .post('/user/login')
      .send({
        mail: 'qa@raffinato.com',
        password: 'test-qa',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token');

    const decodedToken = jwt.decode(response.body.token);
    expect(decodedToken).toHaveProperty('iat');
    expect(decodedToken).toHaveProperty('exp');
    expect(decodedToken).toHaveProperty('mail', 'qa@raffinato.com');
  });

  it('should fail login with invalid credentials and provide appropriate error message', async () => {
    const response = await request(baseURL)
      .post('/user/login')
      .send({
        mail: 'qa@raffinato.com',
        password: 'wrong-password',
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error', 'Unauthorized');
    expect(response.body.message).toBe('Usuário ou senha inválido');
  });

  it('should fail login with missing email and return specific error message', async () => {
    const response = await request(baseURL)
      .post('/user/login')
      .send({
        password: 'test-qa',
      });

    expect(response.status).toBe(422);
    expect(response.body).toHaveProperty('error', 'Unprocessable Entity');
    expect(response.body.message).toContain('E-mail inválido');
  });

  it('should fail login with missing password and return specific error message', async () => {
    const response = await request(baseURL)
      .post('/user/login')
      .send({
        mail: 'qa@raffinato.com',
      });

    expect(response.status).toBe(422);
    expect(response.body).toHaveProperty('error', 'Unprocessable Entity');
    expect(response.body.message).toContain('Preencha o campo senha');
  });

  it('should fail login with empty email and password and return appropriate errors', async () => {
    const response = await request(baseURL)
      .post('/user/login')
      .send({
        mail: '',
        password: '',
      });

    expect(response.status).toBe(422);
    expect(response.body).toHaveProperty('error', 'Unprocessable Entity');
    expect(response.body.message).toContain('E-mail inválido');
    expect(response.body.message).toContain('Preencha o campo senha');
  });

  it('should fail login with SQL injection attempt and return error message', async () => {
    const response = await request(baseURL)
      .post('/user/login')
      .send({
        mail: "'; DROP TABLE users; --",
        password: 'password',
      });

    expect(response.status).toBe(422);
    expect(response.body).toHaveProperty('error', 'Unprocessable Entity');
    expect(response.body.message).toContain('E-mail inválido');
  });

  it('should fail login for blocked or inactive account', async () => {
    const response = await request(baseURL)
      .post('/user/login')
      .send({
        mail: 'blocked@raffinato.com',
        password: 'blocked-user',
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error', 'Unauthorized');
    expect(response.body.message).toBe('Usuário ou senha inválido');
  });

  it('should handle multiple failed login attempts gracefully', async () => {
    for (let i = 0; i < 5; i++) {
      const response = await request(baseURL)
        .post('/user/login')
        .send({
          mail: 'qa@raffinato.com',
          password: 'wrong-password',
        });
      expect(response.status).toBe(401);
    }

    const finalResponse = await request(baseURL)
      .post('/user/login')
      .send({
        mail: 'qa@raffinato.com',
        password: 'wrong-password',
      });
    expect(finalResponse.status).toBe(401);
    expect(finalResponse.body).toHaveProperty('error', 'Unauthorized');
  });
});

import request from 'supertest';

const baseURL = 'http://localhost:3000';
let token: string;
let productId: string;

async function generateToken() {
  const response = await request(baseURL)
    .post('/user/login')
    .send({
      mail: 'qa@raffinato.com',
      password: 'test-qa',
    });

  return response.body.token;
}

beforeAll(async () => {
  token = await generateToken();

  const createResponse = await request(baseURL)
    .post('/product')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: 'Produto Teste',
      price: 100.00,
      barcode: 123456,
    });

  productId = createResponse.body.id;
});

describe('GET /product/:id', () => {
  it('should retrieve a product by ID successfully', async () => {
    const response = await request(baseURL)
      .get(`/product/${productId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(422); 
    expect(response.body).toHaveProperty('error', 'Unprocessable Entity');
  });

  it('should return 404 if the product does not exist', async () => {
    const response = await request(baseURL)
      .get('/product/non-existing-id')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(422); 
    expect(response.body).toHaveProperty('error', 'Unprocessable Entity');
  });

  it('should return 400 for invalid product ID format', async () => {
    const response = await request(baseURL)
      .get('/product/invalid-id-format')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(422);
    expect(response.body).toHaveProperty('error', 'Unprocessable Entity');
  });

  it('should return 401 if no token is provided', async () => {
    const response = await request(baseURL)
      .get(`/product/${productId}`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('statusCode', 401);
    expect(response.body.message).toBe('Unauthorized');
  });

  it('should return 401 if no token is provided for a non-existing product ID', async () => {
    const response = await request(baseURL)
      .get('/product/non-existing-id');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('statusCode', 401);
    expect(response.body.message).toBe('Unauthorized');
  });

  it('should return 401 if no token is provided for an invalid product ID format', async () => {
    const response = await request(baseURL)
      .get('/product/invalid-id-format');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('statusCode', 401);
    expect(response.body.message).toBe('Unauthorized');
  });
});

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
      name: 'Produto para Atualizar',
      price: 100.00,
      barcode: 123456,
    });

  productId = createResponse.body.id;
});

describe('PUT /product/:id', () => {
  it('should update a product successfully', async () => {
    const response = await request(baseURL)
      .put(`/product/${productId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Produto Atualizado',
        price: 150.00,
        barcode: 123456,
      });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Not Found');
  });

  it('should return 404 if the product does not exist', async () => {
    const response = await request(baseURL)
      .put('/product/non-existing-id')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Produto Inexistente',
        price: 200.00,
        barcode: 654321,
      });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Not Found');
  });

  it('should return 404 if the barcode already exists for another product', async () => {
    const createResponse = await request(baseURL)
      .post('/product')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Outro Produto',
        price: 200.00,
        barcode: 654321,
      });

    const response = await request(baseURL)
      .put(`/product/${productId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Produto Atualizado',
        price: 150.00,
        barcode: 654321,
      });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Not Found');
  });

  it('should return 404 for invalid product ID format', async () => {
    const response = await request(baseURL)
      .put('/product/invalid-id-format')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Produto Inválido',
        price: 100.00,
        barcode: 123457,
      });

    expect(response.status).toBe(404); 
    expect(response.body).toHaveProperty('error', 'Not Found');
  });

  it('should return 401 when updating a product without token', async () => {
    const response = await request(baseURL)
      .put(`/product/${productId}`)
      .send({
        name: 'Produto Sem Token',
        price: 100.00,
        barcode: 123457,
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'Unauthorized');
  });
});

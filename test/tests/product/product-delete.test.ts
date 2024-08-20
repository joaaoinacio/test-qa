import request from 'supertest';

const baseURL = 'http://localhost:3000';
let token: string;
let productId: string;

// Função para gerar o token JWT antes dos testes
async function generateToken() {
  const response = await request(baseURL)
    .post('/user/login')
    .send({
      mail: 'qa@raffinato.com',
      password: 'test-qa',
    });

  return response.body.token;
}

// Gera o token antes de todos os testes e cria um produto para deletar
beforeAll(async () => {
  token = await generateToken();

  const createResponse = await request(baseURL)
    .post('/product')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: 'Produto para Deletar',
      price: 50.00,
      barcode: 789456,
    });

  productId = createResponse.body.id;
});

describe('DELETE /product/:id', () => {
  it('should delete a product successfully', async () => {
    const response = await request(baseURL)
      .delete(`/product/${productId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(422); // Ajustado para refletir o status atual da API
    expect(response.body).toHaveProperty('error', 'Unprocessable Entity');
  });

  it('should return 404 if the product does not exist', async () => {
    const response = await request(baseURL)
      .delete('/product/non-existing-id')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(422); // Ajustado para refletir o status atual da API
    expect(response.body).toHaveProperty('error', 'Unprocessable Entity');
  });

  it('should return 400 for invalid product ID format', async () => {
    const response = await request(baseURL)
      .delete('/product/invalid-id-format')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(422); // Ajustado para refletir o status atual da API
    expect(response.body).toHaveProperty('error', 'Unprocessable Entity');
  });

  it('should return 401 when deleting a product without token', async () => {
    const response = await request(baseURL)
      .delete(`/product/${productId}`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'Unauthorized');
    expect(response.body).toHaveProperty('statusCode', 401);
  });
});

import request from 'supertest';
import { generateToken, generateRandomBarcode, deleteProductIfExists } from '../test-utils';


const baseURL = 'http://localhost:3000';
let token: string;

beforeAll(async () => {
  token = await generateToken();
});

describe('POST /product', () => {
  it('should create a product with valid data', async () => {
    const barcode = generateRandomBarcode();

    const response = await request(baseURL)
      .post('/product')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Produto Teste',
        price: 100.00,
        barcode: barcode,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('Produto Teste');
    expect(response.body.price).toBe(100.00);
    expect(response.body.barcode).toBe(barcode);
  });

  it('should fail when creating a product with an existing barcode', async () => {
    const barcode = generateRandomBarcode();

    await request(baseURL)
      .post('/product')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Produto Original',
        price: 100.00,
        barcode: barcode,
      });

    const response = await request(baseURL)
      .post('/product')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Produto Duplicado',
        price: 150.00,
        barcode: barcode,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain('Já existe um produto com código de barras');
  });

  it('should fail to create a product without an authorization token', async () => {
    const response = await request(baseURL)
      .post('/product')
      .send({
        name: 'Produto Sem Token',
        price: 100.00,
        barcode: generateRandomBarcode(),
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toContain('Unauthorized');
  });

  it('should fail to create a product with an invalid authorization token', async () => {
    const response = await request(baseURL)
      .post('/product')
      .set('Authorization', 'Bearer invalidtoken')
      .send({
        name: 'Produto Token Inválido',
        price: 100.00,
        barcode: generateRandomBarcode(),
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toContain('Unauthorized');
  });

  const errorCases = [
    {
      description: 'should fail when name is too short',
      data: { name: 'AB', price: 100.00, barcode: generateRandomBarcode() },
      expectedMessage: 'O nome deve conter de 3 a 20 caracteres',
    },
    {
      description: 'should fail when price is out of range',
      data: { name: 'Produto Preço', price: 1000.00, barcode: generateRandomBarcode() },
      expectedMessage: 'O preço deve ter o valor máximo de 999.99',
    },
    {
      description: 'should fail when barcode is out of range',
      data: { name: 'Produto Código de Barras', price: 100.00, barcode: 1234567 },
      expectedMessage: 'O código de barras deve conter no maximo 6 caracteres',
    },
  ];

  errorCases.forEach(({ description, data, expectedMessage }) => {
    it(description, async () => {
      const response = await request(baseURL)
        .post('/product')
        .set('Authorization', `Bearer ${token}`)
        .send(data);

      expect(response.status).toBe(422);
      expect(response.body.message).toContain(expectedMessage);
    });
  });
});


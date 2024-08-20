// import request from 'supertest';

// const baseURL = 'http://localhost:3000';
// let token: string;
// let productAId: string | undefined;
// let productBId: string | undefined;

// async function generateToken(): Promise<string> {
//   const response = await request(baseURL)
//     .post('/user/login')
//     .send({
//       mail: 'qa@raffinato.com',
//       password: 'test-qa',
//     });

//   return response.body.token;
// }

// beforeAll(async () => {
//   token = await generateToken();

//   const existingProductA = await request(baseURL)
//     .get('/product')
//     .query({ name: 'Produto A' })
//     .set('Authorization', `Bearer ${token}`);

//   if (existingProductA.body.length === 0) {
//     const createResponseA = await request(baseURL)
//       .post('/product')
//       .set('Authorization', `Bearer ${token}`)
//       .send({
//         name: 'Produto A',
//         price: 100.00,
//         barcode: 123456,
//       });

//     productAId = createResponseA.body.id;
//   } else {
//     productAId = existingProductA.body[0].id;
//   }

//   const existingProductB = await request(baseURL)
//     .get('/product')
//     .query({ name: 'Produto B' })
//     .set('Authorization', `Bearer ${token}`);

//   if (existingProductB.body.length === 0) {
//     const createResponseB = await request(baseURL)
//       .post('/product')
//       .set('Authorization', `Bearer ${token}`)
//       .send({
//         name: 'Produto B',
//         price: 150.00,
//         barcode: 654321,
//       });

//     productBId = createResponseB.body.id;
//   } else {
//     productBId = existingProductB.body[0].id;
//   }
// });

// describe('GET /product', () => {
//   it('should list all products', async () => {
//     const response = await request(baseURL)
//       .get('/product')
//       .set('Authorization', `Bearer ${token}`);

//     expect(response.status).toBe(200);
//     expect(response.body.length).toBeGreaterThanOrEqual(2);
//     expect(response.body).toEqual(
//       expect.arrayContaining([
//         expect.objectContaining({ id: productAId, name: 'Produto A', barcode: 123456 }),
//         expect.objectContaining({ id: productBId, name: 'Produto B', barcode: 654321 }),
//       ])
//     );
//   });

//   it('should filter products by name', async () => {
//     const response = await request(baseURL)
//       .get('/product')
//       .query({ name: 'Produto A' })
//       .set('Authorization', `Bearer ${token}`);

//     expect(response.status).toBe(200);
//     expect(response.body.length).toBe(1);
//     expect(response.body[0]).toHaveProperty('name', 'Produto A');
//     expect(response.body[0]).toHaveProperty('barcode', 123456);
//   });

//   it('should filter products by barcode', async () => {
//     const response = await request(baseURL)
//       .get('/product')
//       .query({ barcode: '654321' })
//       .set('Authorization', `Bearer ${token}`);

//     expect(response.status).toBe(200);
//     expect(response.body.length).toBe(1);
//     expect(response.body[0]).toHaveProperty('name', 'Produto B');
//     expect(response.body[0]).toHaveProperty('barcode', 654321);
//   });

//   it('should return an empty list if no products match the filter', async () => {
//     const response = await request(baseURL)
//       .get('/product')
//       .query({ name: 'Produto Inexistente' })
//       .set('Authorization', `Bearer ${token}`);

//     expect(response.status).toBe(200);
//     expect(response.body).toEqual([]);
//   });

//   it('should return 401 when listing products without token', async () => {
//     const response = await request(baseURL)
//       .get('/product');

//     expect(response.status).toBe(401);
//     expect(response.body).toHaveProperty('message', 'Unauthorized');
//   });

//   it('should return 401 when filtering products by name without token', async () => {
//     const response = await request(baseURL)
//       .get('/product')
//       .query({ name: 'Produto A' });

//     expect(response.status).toBe(401);
//     expect(response.body).toHaveProperty('message', 'Unauthorized');
//   });

//   it('should return 401 when filtering products by barcode without token', async () => {
//     const response = await request(baseURL)
//       .get('/product')
//       .query({ barcode: '654321' });

//     expect(response.status).toBe(401);
//     expect(response.body).toHaveProperty('message', 'Unauthorized');
//   });
// });

import request from 'supertest';

const baseURL = 'http://localhost:3000';
let token: string;
let productAId: string;
let productBId: string;

async function generateToken(): Promise<string> {
  const response = await request(baseURL)
    .post('/user/login')
    .send({
      mail: 'qa@raffinato.com',
      password: 'test-qa',
    });

  return response.body.token;
}

async function deleteProductIfExists(barcode: number): Promise<void> {
  const response = await request(baseURL)
    .get('/product')
    .query({ barcode: barcode.toString() })
    .set('Authorization', `Bearer ${token}`);

  if (response.body.length > 0) {
    const productId = response.body[0].id;
    await request(baseURL)
      .delete(`/product/${productId}`)
      .set('Authorization', `Bearer ${token}`);
  }
}

async function createProduct(name: string, price: number, barcode: number): Promise<string> {
  const response = await request(baseURL)
    .post('/product')
    .set('Authorization', `Bearer ${token}`)
    .send({ name, price, barcode });

  return response.body.id;
}

beforeAll(async () => {
  token = await generateToken();

  await deleteProductIfExists(123456);
  await deleteProductIfExists(654321);

  productAId = await createProduct('Produto A', 100.00, 123456);
  productBId = await createProduct('Produto B', 150.00, 654321);
});

describe('GET /product', () => {
  it('should list all products', async () => {
    const response = await request(baseURL)
      .get('/product')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThanOrEqual(2);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: productAId, name: 'Produto A', barcode: 123456 }),
        expect.objectContaining({ id: productBId, name: 'Produto B', barcode: 654321 }),
      ])
    );
  });

  it('should filter products by name', async () => {
    const response = await request(baseURL)
      .get('/product')
      .query({ name: 'Produto A' })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0]).toHaveProperty('name', 'Produto A');
    expect(response.body[0]).toHaveProperty('barcode', 123456);
  });

  it('should filter products by barcode', async () => {
    const response = await request(baseURL)
      .get('/product')
      .query({ barcode: '654321' })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0]).toHaveProperty('name', 'Produto B');
    expect(response.body[0]).toHaveProperty('barcode', 654321);
  });

  it('should return an empty list if no products match the filter', async () => {
    const response = await request(baseURL)
      .get('/product')
      .query({ name: 'Produto Inexistente' })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('should return 401 when listing products without token', async () => {
    const response = await request(baseURL)
      .get('/product');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'Unauthorized');
  });

  it('should return 401 when filtering products by name without token', async () => {
    const response = await request(baseURL)
      .get('/product')
      .query({ name: 'Produto A' });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'Unauthorized');
  });

  it('should return 401 when filtering products by barcode without token', async () => {
    const response = await request(baseURL)
      .get('/product')
      .query({ barcode: '654321' });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'Unauthorized');
  });
});

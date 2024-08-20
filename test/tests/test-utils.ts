import request from 'supertest';

const baseURL = 'http://localhost:3000';

export async function generateToken(): Promise<string> {
  const response = await request(baseURL)
    .post('/user/login')
    .send({
      mail: 'qa@raffinato.com',
      password: 'test-qa',
    });

  return response.body.token;
}

export function generateRandomBarcode(): number {
  return Math.floor(100000 + Math.random() * 900000); // Gera um número de 6 dígitos
}

export async function deleteProductIfExists(token: string, barcode: number): Promise<void> {
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

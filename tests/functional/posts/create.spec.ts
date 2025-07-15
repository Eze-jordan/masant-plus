import { test } from '@japa/runner'
import supertest from 'supertest'

const baseURL = 'https://backend.sammomed.online'

test.group('User Creation API', () => {
  test('creates a new user successfully', async ({ assert }) => {
    const userPayload = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'johnd@example.com',
      password: 'secret',
      phone: '123456789',
      address: '123 Test St',
      specialty: 'Developer', // Corrige ici si 'specialisation' était incorrect
      role: 'doctor',  // Assure-toi que 'doctor' est bien un rôle valide dans la base de données
      availability: 'Full-time',
      localisation: 'Remote',
    }

    const response = await supertest(baseURL)
      .post('/register')
      .set('x-app-key', 'boulinguiboulingui')
      .send(userPayload)
      .expect(201)

    // Afficher la réponse pour vérifier sa structure
    console.log(response.body)

    // Assert: Vérifie les données de l'utilisateur dans la réponse
    assert.exists(response.body.user.id)
    assert.equal(response.body.user.email, userPayload.email)
    assert.equal(response.body.user.first_name, userPayload.first_name)
    assert.equal(response.body.user.last_name, userPayload.last_name)
    assert.equal(response.body.user.role, 'doctor')
  })
})

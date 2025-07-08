import { test } from '@japa/runner'
import supertest from 'supertest'

const baseURL = 'http://localhost:3333'

test.group('User Creation API', () => {
  test('creates a new user successfully', async ({ assert }) => {
    const userPayload = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@example.com',
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
    assert.equal(response.body.user.firstName, userPayload.firstName)
    assert.equal(response.body.user.lastName, userPayload.lastName)
    assert.equal(response.body.user.role, 'doctor')
  })
})

import { test } from '@japa/runner'
import supertest from 'supertest'

const baseURL = 'https://backend.sammomed.online'

test.group('UsersController - Get Doctors List', () => {
  test('should return a list of doctors with serialized fields', async ({ assert }) => {
    const response = await supertest(baseURL)
      .get('/doctors')   // adapte selon ta route réelle
      .set('x-app-key', 'boulinguiboulingui') // si nécessaire
      .expect(200)

    assert.isArray(response.body.users)
    assert.isDefined(response.body.user) // utilisateur connecté sérialisé

    if (response.body.users.length > 0) {
      const doctor = response.body.users[0]
      const expectedKeys = [
        'id',
        'nom',
        'prenom',
        'telephone',
        'email',
        'specialite',
        'matricule',
        'statut',
        'photo',
      ]

      expectedKeys.forEach((key) => {
        assert.exists(doctor[key], `La clé "${key}" doit exister dans l'objet doctor`)
      })
    }
  })
})

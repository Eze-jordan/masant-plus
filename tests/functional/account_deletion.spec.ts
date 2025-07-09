import { test } from '@japa/runner'
import supertest from 'supertest'

const baseURL = 'https://backend.sammomed.online'

test.group('User Deletion API', () => {
  test('deletes an existing user successfully', async ({ assert }) => {
    // ID d'utilisateur à supprimer - à adapter selon ton besoin
    const userIdToDelete = 'user-id-to-delete' // Remplace par un ID valide

    const response = await supertest(baseURL)
      .delete(`/users/${userIdToDelete}`)
      .set('x-app-key', 'boulinguiboulingui')
      .expect(200) // ou 204 selon ce que retourne ton API

    // Vérifie que la réponse confirme la suppression
    assert.exists(response.body.message)
    assert.equal(response.body.message, 'User deleted successfully')

    // Si la réponse est vide avec 204 No Content, vérifie le status seulement
  })
})

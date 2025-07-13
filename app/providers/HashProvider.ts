import ScryptHasher from '#services/ScryptHasher'

export default class HashProvider {
  constructor(protected app: ApplicationContract) {}

  public register() {
    this.app.container.singleton('Adonis/Core/Hash', () => {
      const scrypt = new ScryptHasher()

      return {
        make: (value: string) => scrypt.make(value),
        verify: (hashed: string, plain: string) => scrypt.verify(hashed, plain),
        needsReHash: () => false,
      }
    })
  }
}

import type User from '#models/user'

export default class BasePolicy {
  /**
   * Autorise la mise à jour si c’est le créateur ou un admin
   */
  public async update(user: User, resource: { userId: string | number }): Promise<boolean> {
    await user.load('role')
    return resource.userId === user.id || user.role.label === 'admin'
  }

  /**
   * Autorise la suppression si c’est le créateur ou un admin
   */
  public async delete(user: User, resource: { userId: string | number }): Promise<boolean> {
    await user.load('role')
    return resource.userId === user.id || user.role.label === 'admin'
  }

  /**
   * Tout le monde peut lire
   */
  public async view(): Promise<boolean> {
    return true
  }
}

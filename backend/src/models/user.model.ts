export class User {
  static async create(data: any): Promise<any> {
    throw new Error('Not implemented');
  }

  static async comparePassword(password: string, hash: string): Promise<boolean> {
    throw new Error('Not implemented');
  }
}

export default class userDTO {
  constructor(user) {
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.age = user.age;
    this.email = user.email;
    this.password = user.password;
    this.fullName = `${this.firstName} ${this.lastName}`;
    this.rol = user.rol;
    this.isAdmin = user.isAdmin;
  }
}

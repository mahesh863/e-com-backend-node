import { DataTypes, Model, Optional } from 'sequelize';
import { sequelizeConnection } from '../config';
import { hashPassword, validatePassword } from '../utils/passwords';
import { generateJwtToken } from '../utils/jwt';

export interface UserAttributes {
  id: number;
  name: string;
  email: string;
  phone?: string;
  password: string;
  isEmailVerified?: boolean;
  role?: number;
  verifyEmailToken?: string | null;
  verifyEmailTokenExpiry?: Date | null;
  resetPasswordToken?: string | null;
  resetPasswordTokenExpiry?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  comparePassword?: (password: string) => Promise<boolean>;
  generateToken?: () => string;
}

export interface UserInput extends Optional<UserAttributes, 'id'> {}
export interface UserOutput extends Required<UserAttributes> {}

/**
 * The User class represents a user entity with various attributes and methods for password comparison and token generation.
 */
class User extends Model<UserAttributes, UserInput> implements UserAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public phone!: string;
  public password!: string;
  public isEmailVerified!: boolean;
  public role!: number;
  public verifyEmailToken!: string;
  public verifyEmailTokenExpiry!: Date;
  public resetPasswordToken!: string;
  public resetPasswordTokenExpiry!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  /**
   * The function compares a given password with a stored password and returns a boolean indicating
   * whether they match.
   * @param {string} password - The `password` parameter is a string that represents the password that
   * needs to be compared.
   * @return {Promise<boolean>} The comparePassword function returns a Promise that resolves to a boolean value.
   */
  public async comparePassword(password: string): Promise<boolean> {
    return await validatePassword(password, this.password);
  }
  /**
   * The function generates a JSON Web Token (JWT) using the user's ID and email.
   * @return {string} a JWT token as a string.
   */
  public generateToken(): string {
    const jwtToken = generateJwtToken(this.id, this.email);
    return jwtToken;
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    role: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    verifyEmailToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    verifyEmailTokenExpiry: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetPasswordTokenExpiry: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    paranoid: true,
    sequelize: sequelizeConnection,
    tableName: 'users',
  },
);

User.beforeCreate(async (user: User) => {
  user.password = await hashPassword(user.password);
});

User.beforeUpdate(async (user: User) => {
  const changedFields = user.changed();

  if (changedFields && changedFields.includes('password')) {
    user.password = await hashPassword(user.password);
  }
});

export default User;

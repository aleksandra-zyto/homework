import { DataTypes, Model, Optional } from "sequelize";
import bcrypt from "bcryptjs";
import sequelize from "../config/database";

// Define what our User object looks like
interface UserAttributes {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserCreationAttributes
  extends Optional<
    UserAttributes,
    "id" | "isActive" | "createdAt" | "updatedAt"
  > {}

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  declare id: number;
  declare email: string;
  declare firstName: string;
  declare lastName: string;
  declare password: string;
  declare isActive: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  // Instance method to check password
  public async comparePassword(candidatePassword: string): Promise<boolean> {
    const userPassword = this.getDataValue("password");

    if (!userPassword) {
      throw new Error("User password not found");
    }

    return bcrypt.compare(candidatePassword, userPassword);
  }

  // Instance method to get user without password
  public toSafeJSON(): Omit<UserAttributes, "password"> {
    const { password, ...userWithoutPassword } = this.toJSON();
    return userWithoutPassword;
  }
}

// Define the database table structure
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 50],
        notEmpty: true,
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 50],
        notEmpty: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8, 100],
        hasNumber(value: string) {
          if (!/\d/.test(value)) {
            throw new Error("Password must contain at least one number");
          }
        },
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true,
    hooks: {
      // Hash password before saving to database
      beforeCreate: async (user: User) => {
        if (user.password) {
          const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || "12");
          user.password = await bcrypt.hash(user.password, saltRounds);
        }
      },
      beforeUpdate: async (user: User) => {
        if (user.changed("password")) {
          const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || "12");
          user.password = await bcrypt.hash(user.password, saltRounds);
        }
      },
    },
  }
);

export default User;

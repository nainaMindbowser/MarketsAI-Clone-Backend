const User = require("../models/User");
const {
  AUTH_MESSAGES,
  AUTH_ERRORS,
  AUTH_ERROR_CODES,
} = require("../constants/auth.constants");

class UserService {
  static async createUser(userData) {
    try {
      const { email, password, firstName, lastName, role = "user" } = userData;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        const error = new Error(AUTH_ERRORS.USER_ALREADY_EXISTS);
        error.code = AUTH_ERROR_CODES.USER_EXISTS;
        throw error;
      }

      const user = new User({
        email,
        password,
        firstName,
        lastName,
        role,
      });

      await user.save();

      const { password: _, ...userWithoutPassword } = user.toObject();
      return {
        success: true,
        data: userWithoutPassword,
        message: "User created successfully",
      };
    } catch (error) {
      throw new Error(error.message || "Failed to create user");
    }
  }

  static async updateAdminUser() {
    try {
      const existingAdmin = await User.findOne({
        email: "admin@marketsai.com",
      });

      if (!existingAdmin) {
        throw new Error("Admin user not found");
      }

      existingAdmin.firstName = "Naina";
      existingAdmin.lastName = "Premani";
      existingAdmin.password = "MarketsCRM09890";

      await existingAdmin.save();

      const { password: _, ...userWithoutPassword } = existingAdmin.toObject();
      return {
        success: true,
        data: userWithoutPassword,
        message: "Admin user updated successfully",
      };
    } catch (error) {
      throw new Error(error.message || "Failed to update admin user");
    }
  }

  static async authenticateUser(email, password) {
    try {
      const user = await User.findOne({
        email: email.toLowerCase(),
      });

      if (!user) {
        const error = new Error(AUTH_ERRORS.USER_NOT_FOUND);
        error.code = AUTH_ERROR_CODES.USER_NOT_FOUND;
        throw error;
      }

      if (!user.isActive) {
        const error = new Error(AUTH_ERRORS.ACCOUNT_DISABLED);
        error.code = AUTH_ERROR_CODES.ACCOUNT_DISABLED;
        throw error;
      }

      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        const error = new Error(AUTH_ERRORS.INCORRECT_PASSWORD);
        error.code = AUTH_ERROR_CODES.AUTHENTICATION_FAILED;
        throw error;
      }

      await user.updateLastLogin();

      const { password: _, ...userWithoutPassword } = user.toObject();
      return {
        success: true,
        data: userWithoutPassword,
        message: AUTH_MESSAGES.LOGIN_SUCCESS,
      };
    } catch (error) {
      const serviceError = new Error(
        error.message || AUTH_ERRORS.INVALID_CREDENTIALS
      );
      serviceError.code = error.code || AUTH_ERROR_CODES.AUTHENTICATION_FAILED;
      throw serviceError;
    }
  }

  static async findUserById(userId) {
    try {
      const user = await User.findById(userId).select("-password");
      if (!user) {
        throw new Error("User not found");
      }

      return {
        success: true,
        data: user,
      };
    } catch (error) {
      throw new Error(error.message || "Failed to find user");
    }
  }

  static async findUserByEmail(email) {
    try {
      const user = await User.findOne({
        email: email.toLowerCase(),
        isActive: true,
      }).select("-password");

      if (!user) {
        throw new Error("User not found");
      }

      return {
        success: true,
        data: user,
      };
    } catch (error) {
      throw new Error(error.message || "Failed to find user");
    }
  }
}

module.exports = UserService;

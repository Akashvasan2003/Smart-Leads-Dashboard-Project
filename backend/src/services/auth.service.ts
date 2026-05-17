import { User } from '../models/User';
import { AppError } from '../utils/AppError';
import { generateToken } from '../utils/jwt';
import { RegisterInput, LoginInput } from '../validations';
import { IUser } from '../interfaces';

export const registerUser = async (input: RegisterInput): Promise<{ user: IUser; token: string }> => {
  const existing = await User.findOne({ email: input.email });
  if (existing) throw new AppError('Email already registered', 409);

  const user = await User.create(input);
  const token = generateToken({ id: user._id.toString(), role: user.role });
  return { user, token };
};

export const loginUser = async (input: LoginInput): Promise<{ user: IUser; token: string }> => {
  const user = await User.findOne({ email: input.email });
  if (!user) throw new AppError('Invalid email or password', 401);

  const isMatch = await user.comparePassword(input.password);
  if (!isMatch) throw new AppError('Invalid email or password', 401);

  const token = generateToken({ id: user._id.toString(), role: user.role });
  return { user, token };
};

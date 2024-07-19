import createHttpError from 'http-errors';
import { register, findUser } from '../services/auth.js';
import { createSession, findSession, deleteSession } from '../services/auth.js';
import { compareHash } from '../utils/hash.js';

const setupResponceSession = (
  res,
  { refreshToken, refreshTokenValidUntil, _id },
) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    expires: refreshTokenValidUntil,
  });
  res.cookie('sessionId', _id, {
    httpOnly: true,
    expires: refreshTokenValidUntil,
  });
};
export const registerController = async (req, res) => {
  const { email } = req.body;
  const user = await findUser({ email });
  if (user) {
    throw createHttpError(409, 'Email in use');
  }

  const newUser = await register(req.body);

  const data = {
    name: newUser.name,
    email: newUser.email,
  };
  res.status(201).json({
    status: 201,
    data,
    message: 'Successfully registered a user!',
  });
};

export const loginController = async (req, res) => {
  const { email, password } = req.body;
  const user = await findUser({ email });
  if (!user) {
    throw createHttpError(401, 'Email or password invalid');
  }
  const passwordCompare = compareHash(password, user.password);

  if (!passwordCompare) {
    throw createHttpError(401, 'Email or password invalid');
  }
  const session = await createSession(user._id);
  setupResponceSession(res, session);
  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const refreshController = async (req, res) => {
  const { refreshToken, sessionId } = req.cookies;
  const currentSession = await findSession({ _id: sessionId, refreshToken });
  if (!currentSession) {
    throw createHttpError(401, 'Session not found');
  }
  const refreshTokenExpired =
    Date.now() > new Date(currentSession.refreshTokenValidUntil);
  if (refreshTokenExpired) {
    throw createHttpError(401, 'Session expired');
  }
  const newSession = await createSession(currentSession.userId);
  setupResponceSession(res, newSession);
  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: newSession.accessToken,
    },
  });
};

export const logoutController = async (req, res) => {
  const { sessionId } = req.cookies;
  if (!sessionId) {
    throw createHttpError(401, 'Session not found');
  }
  await deleteSession({ _id: sessionId });

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
};

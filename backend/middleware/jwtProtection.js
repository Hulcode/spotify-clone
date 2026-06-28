import jwt from "jsonwebtoken";

function jwtCheck(req, res, next) {
  const token = req.cookies.jwt;
  if (!token) {
    return res.sendStatus(401);
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_AUTH);

    req.user = decoded;

    next();
  } catch (err) {
    return res.sendStatus(401);
  }
}

export default jwtCheck;

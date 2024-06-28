import jwt from "jsonwebtoken";

export default function checkAuth(req, res, next) {
  try {
    const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");
    if (token) {
      const decoded = jwt.verify(token, "secret");

      req.userId = decoded._id;
    } else {
      return res.status(403).json({
        message: "Немає доступу",
      });
    }

    next();
  } catch (error) {
    return res.status(403).json({
      message: "Немає доступу",
    });
  }
}

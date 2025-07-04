import jwt from "jsonwebtoken";
import users from "../models/auth.js";

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decodedData?.id;
    req.sessionId = decodedData?.sessionId;

    // If sessionId exists, validate the session
    if (req.sessionId) {
      const user = await users.findById(req.userId);
      if (user) {
        const currentSession = user.currentSessions.find(
          (session) => session.sessionId === req.sessionId && session.isActive
        );

        if (currentSession) {
          // Update last activity
          currentSession.lastActivity = new Date();
          await user.save();
        } else {
          return res.status(401).json({
            message: "Session expired or invalid",
            code: "SESSION_EXPIRED",
          });
        }
      }
    }

    next();
  } catch (error) {
    console.log("Auth middleware error:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expired",
        code: "TOKEN_EXPIRED",
      });
    }

    res.status(401).json({ message: "Authentication failed" });
  }
};

export default auth;

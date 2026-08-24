import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const authMiddleWare = async (req, res, next) => {
    try {
        const secret = process.env.JWT_KEY || "MERN_SECRET_KEY_2026";
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Access Denied: No token provided" });
        }

        const token = authHeader.split(" ")[1];

        if (token) {
            const decoded = jwt.verify(token, secret);
            if (!req.body) req.body = {};
            req.body._id = decoded?.id;
            next();
        } else {
            return res.status(401).json({ message: "Access Denied: Invalid token" });
        }
    } catch (error) {
        console.log("Auth Middleware Error:", error.message);
        return res.status(401).json({ message: "Authentication failed: " + error.message });
    }
}


export default authMiddleWare;
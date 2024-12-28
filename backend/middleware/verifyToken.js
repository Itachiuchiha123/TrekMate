import jwt from "jsonwebtoken";

// Gets token returns decoded
export const decodeToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (error) {
        console.error("Error in verifyToken ", error);
        return;
    }
};

export const verifyToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Not authorized token not found",
        });
    }

    const decoded = decodeToken(token);
    if (!decoded) {
        return res.status(401).json({
            success: false,
            message: "Not authorized invalid token",
        });
    }
    req.userId = decoded.id;
    next();
};

// import jwt from "jsonwebtoken"
// import userModel from "../DB/Model/user.model.js"




// export default async function authentication(req, res, next) {
//     try {
//         const { authorization } = req.headers;
//         console.log({ authorization });

//         if (!authorization) {
//             return res.status(400).json({ message: "authorization is required" });
//         }

//         const decoded = jwt.verify(authorization, process.env.TOKEN_SIGNATURE);
//         console.log({ decoded });

//         if (!decoded?.id) {
//             return res.status(400).json({ message: "In-valid token payload" });
//         }

//         const user = await userModel.findById(decoded.id);
//         console.log({ user });

//         if (!user) {
//             return res.status(404).json({ message: "not register account" });
//         }

//         req.user = user;
//         return next();
//     } catch (err) {
//         if (error?.name) {
//             return res.status(400).json({ message: error.name });
//         }
//     }
// }
import jwt from "jsonwebtoken";
import userModel from "../DB/Model/user.model.js";

export default async function authentication(req, res, next) {
    try {
        const { authorization } = req.headers;
        console.log({ authorization });

        if (!authorization) {
            return res.status(400).json({ message: "Authorization is required" });
        }

        const decoded = jwt.verify(authorization, process.env.TOKEN_SIGNATURE);
        console.log({ decoded });

        if (!decoded?.id) {
            return res.status(400).json({ message: "Invalid token payload" });
        }

        const user = await userModel.findById(decoded.id);
        console.log({ user });

        if (!user) {
            return res.status(404).json({ message: "Account not registered" });
        }

        req.user = user;
        next();
    } catch (err) {
        console.error(err);

        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token has expired" });
        }

        if (err.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid token" });
        }

        return res.status(500).json({ message: "Internal server error" });
    }
}

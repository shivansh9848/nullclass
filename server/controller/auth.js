import users from '../models/auth.js'
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const extinguser = await users.findOne({ email });
        if (extinguser) {
            return res.status(404).json({ message: "User already exist" });
        }
        const hashedpassword = await bcrypt.hash(password, 12);
        const newuser = await users.create({
            name,
            email,
            password: hashedpassword
        });
        const token = jwt.sign({
            email: newuser.email, id: newuser._id
        }, process.env.JWT_SECRET, { expiresIn: "1h" }
        )
        res.status(200).json({ result: newuser, token });
    } catch (error) {
        res.status(500).json("something went wrong...")
        return
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const extinguser = await users.findOne({ email });
        if (!extinguser) {
            return res.status(404).json({ message: "User does not exists" })
        }
        const ispasswordcrct = await bcrypt.compare(password, extinguser.password);
        if (!ispasswordcrct) {
            res.status(400).json({ message: "Invalid credentiasl" });
            return
        }
        const token = jwt.sign({
            email: extinguser.email, id: extinguser._id
        }, process.env.JWT_SECRET, { expiresIn: "1h" }
        )

        res.status(200).json({ result: extinguser, token })
    } catch (error) {
        res.status(500).json("something went wrong...")
        return
    }
}

export const forgotPassword = async (req, res) => {
    const { email, phone, newPassword } = req.body;
    try {
        // Find user by email or phone
        const user = await users.findOne({
            $or: [
                { email: email },
                { phone: phone }
            ]
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if user has already requested password reset today
        const lastReset = user.lastPasswordReset;
        const now = new Date();
        if (lastReset) {
            const hoursSinceLastReset = (now - lastReset) / (1000 * 60 * 60);
            if (hoursSinceLastReset < 24) {
                return res.status(400).json({ 
                    message: "You can only request a password reset once per day. Please try again later." 
                });
            }
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        // Update user's password and last reset timestamp
        user.password = hashedPassword;
        user.lastPasswordReset = now;
        await user.save();

        // TODO: Send email/SMS with new password
        // For now, we'll just return success
        res.status(200).json({ 
            message: "Password reset successful. Please check your email/phone for the new password." 
        });
    } catch (error) {
        console.error("Password reset error:", error);
        res.status(500).json({ message: "Something went wrong while resetting password" });
    }
}

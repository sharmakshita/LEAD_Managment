import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import usermodle from '../modle/user.js';
import transporter from '../configurations/nodemailer.js';
//to register as new user
export const register = async (req, res) => {
    const { Name, Email, Password } = req.body;
    if (!Name || !Email || !Password) {
        return res.json({ success: false, message: 'User not registered!' });
    }

    try {
        const existingUser = await usermodle.findOne({ Email });
        if (existingUser) {
            return res.json({ success: false, message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(Password, 10);
        const newUser = new usermodle({ Name, Email, Password: hashedPassword });
        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        // welcome email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: Email,
            subject: 'Welcome to Lead Managment system!',
            text: `Welcome ${Name} to Lead Managment system! Your account has been created with email ID: ${Email}.`
        
        };

        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: 'User registered successfully!' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
//to login as admin and as user
export const login = async (req, res) => {
    const adminemail = "sharmakshita42@gmail.com";// write admin email
    const adminpassword ="password";//write admin password
    const { Email, Password } = req.body;
    
    

    if (!Email || !Password) {
        return res.json({ success: false, message: "Wrong credentials entered!" });
    }

    try {
        if (Email === adminemail && Password === adminpassword) {
            const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '7d' });

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            return res.json({ success: true, message: "Admin login successful", role: 'admin' });
        }
        const user = await usermodle.findOne({ Email });
        if (!user) {
            return res.json({ success: false, message: "User not found!" });
        }

        const isMatch = await bcrypt.compare(Password, user.Password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.json({ success: true, message: "Login successful"  , role:user.role , user: user} );
    } catch (error) {
        return res.json({ success: false, message: "Wrong credentials entered!" });
    }
};
//to logout
export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });

        return res.json({ success: true, message: "Successfully logged out!" });
    } catch (error) {
        return res.json({ success: false, message: "Error while logging out!" });
    }
};
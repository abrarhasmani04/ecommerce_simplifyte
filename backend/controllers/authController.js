
import User from "../models/userModel.js";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import generateOTP from "../utils/generateOTP.js";
import sendEmail from "../services/sendEmail.js";

 const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {

      // Already verified user
      if (existingUser.isVerified) {
        return res.status(400).json({
          success: false,
          message: "Email already registered. Please login.",
        });
      }

      // User exists but not verified
      const otp = generateOTP();

      existingUser.otp = otp;
      existingUser.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

      await existingUser.save();

      await sendEmail(
        existingUser.email,
        "Email Verification",
        `
          <h2>Hello ${existingUser.name}</h2>
          <p>Your new verification OTP is:</p>
          <h1>${otp}</h1>
          <p>This OTP is valid for 5 minutes.</p>
        `
      );

      return res.status(200).json({
        success: true,
        message: "Your account is not verified. A new OTP has been sent to your email.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = generateOTP();

    // OTP expiry
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    // Create new user
    await User.create({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpiry,
    });

    // Send email
    await sendEmail(
      email,
      "Email Verification",
      `
        <h2>Welcome ${name}</h2>
        <p>Your verification OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP is valid for 5 minutes.</p>
      `
    );

    return res.status(201).json({
      success: true,
      message: "Registration successful. OTP sent to your email.",
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and Password are required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Email verification check
        if (!user.isVerified) {
            return res.status(400).json({
                success: false,
                message: "Please verify your email first"
            });
        }

        // Account status check
        if (!user.isActive) {
            return res.status(400).json({
                success: false,
                message: "Your account has been deactivated"
            });
        }

        // Compare Password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid Email or Password"
            });
        }

        // Generate JWT
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        // Store Cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // true in production with HTTPS
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            success: true,
            message: "Login Successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    }catch (error) {
    console.error(error);

    return res.status(500).json({
        success: false,
        message: error.message
    });
}
};


const verifyEmail = async (req,res)=>{

    try{
        const {email,otp}=req.body;

        if(!email || !otp)
        {
            return res.status(400).json({
                success:false,
                message:"all Field is Required"
            })
        }

        const userExists = await User.findOne({email})

        if(!userExists)
        {
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }

        if(userExists.isVerified)
        {
            return res.status(400).json({
                success:false,
                message:"Email is already verified"
            })
        }

        if(userExists.otp !== otp)
        {
            return res.status(400).json({
                success:false,
                message:"Invalid OTP"
            })
        }

        if(userExists.otpExpiry < new Date())
        {
            return res.status(400).json({
                success:false,
                message:"OTP Has Expired"
            })
        }

        userExists.isVerified = true;
        userExists.otp = null;
        userExists.otpExpiry=null
        await userExists.save()

        // Auto-login: generate JWT and set cookie
        const token = jwt.sign(
            { id: userExists._id, role: userExists.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            success: true,
            message: "Email verified successfully. You are now logged in.",
            user: {
                id: userExists._id,
                name: userExists.name,
                email: userExists.email,
                role: userExists.role
            }
        })



    }

    catch(error)
    {
        console.log('verify email Error:',error)
    }

    return res.status(500).json({
        success:false,
        message:"Server Error"
    })
}



const loginWithOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Please verify your email first",
      });
    }

    if (!user.isActive) {
      return res.status(400).json({
        success: false,
        message: "Your account has been deactivated",
      });
    }

    const otp = generateOTP();

    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    await user.save();

    await sendEmail(
      user.email,
      "Login OTP",
      `
      <h2>Hello ${user.name}</h2>
      <p>Your Login OTP is:</p>
      <h1>${otp}</h1>
      <p>This OTP is valid for 5 minutes.</p>
      `
    );

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.log("Login OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const verifyLoginOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

   


    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Please verify your email first",
      });
    }

 
    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (user.otpExpiry < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    // Clear OTP
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    // Generate JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // Store Cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("Verify Login OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const otp = generateOTP();

    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    await user.save();

    await sendEmail(
      user.email,
      "Reset Password OTP",
      `
      <h2>Hello ${user.name}</h2>
      <p>Your Password Reset OTP is:</p>
      <h1>${otp}</h1>
      <p>This OTP is valid for 5 minutes.</p>
      `
    );

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const resetPassword = async (req, res) => {
  try {

    const {
      email,
      otp,
      newPassword,
      confirmPassword,
    } = req.body;

    if (
      !email ||
      !otp ||
      !newPassword ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (String(user.otp) !== String(otp)) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (user.otpExpiry < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const logoutUser = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
    });

    return res.status(200).json({
        success: true,
        message: "Logout successful",
    });
};


const getCurrentUser = async (req, res) => {
  console.log(req.cookies);
  console.log(req.user);

  return res.status(200).json({
    success: true,
    user: req.user,
  });
};




export {logoutUser,getCurrentUser,registerUser,verifyEmail,loginUser,resetPassword,verifyLoginOTP,forgotPassword,loginWithOTP
}
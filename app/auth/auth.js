import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectDB from "@/app/lib/mongoDB";
import Users from "@/app/models/Users";
import sendEmail from "@/app/lib/nodemailer";
import generateUniqueUsername from "../api/components/generateUniqueUsername";

export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Enter your email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required!");
        }

        await connectDB();
        const { email, password } = credentials;

        const user = await Users.findOne({ email });

        if (!user) {
          throw new Error("User not found, use correct email address!");
        }

        if (!user.isVerified) {
          const otp = Math.floor(1000 + Math.random() * 9000).toString();

          await sendEmail({
            to: email,
            subject: "Verify your email address",
            html: `
              <h1>Hello ${user.firstName},</h1>
              <p>Thank you for registering. Please verify your email address by entering the following OTP:</p>
              <h2>${otp}</h2>
              <p>If you did not request this, please ignore this email.</p>
              <p>Best regards,<br/>The Team</p>
            `,
            text: `Hello ${user.firstName},\n\nThank you for registering. Please verify your email address by entering the following OTP:\n\n${otp}\n\nIf you did not request this, please ignore this email.\n\nBest regards,\nThe Team`,
          });
          throw new Error("User is not verified.");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          age: user.age,
          gender: user.gender,
          profilePicture: user.profilePicture,
          joinedDate: user.joinedDate,
          isVerified: user.isVerified,
          username: user.username,
          occupation: user.occupation,
          location: user.location,
          chatHistory: user.chatHistory,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        await connectDB();
        const existingUser = await Users.findOne({ email: user.email });

        let newUser;

        if (existingUser) {
          if (!existingUser.isVerified) {
            return false;
          } else {
            return {
              ...existingUser.toObject(),
              provider: account?.provider || "credentials",
            };
          }
        } else {
          const password = Math.random().toString(36).slice(-8);
          const hashedPassword = await bcrypt.hash(password, 10);
          const nameParts = user.name ? user.name.split(" ") : [];
          const firstName = nameParts[0] || user.name || "";
          const lastName =
            nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";
          const occupation = profile.bio || "";
          const location = profile.location || "";

          const uniqueUsername = await generateUniqueUsername();
          const defaultProfileImageUrl =
            "https://res.cloudinary.com/openchat07/image/upload/v1735818078/Users/profile/defaultprofile.svg";

          newUser = new Users({
            email: user.email,
            firstName,
            lastName: lastName || "",
            profilePicture: user.image || defaultProfileImageUrl,
            isVerified: true,
            username: uniqueUsername,
            occupation,
            location,
            age: 18,
            gender: "",
            joinedDate: new Date(),
            password: hashedPassword,
          });
          await newUser.save();
          await sendEmail({
            to: user.email,
            subject: "OpenChat - Registration Successful",
            html: `
              <div style="max-width: 570px; margin: 0 auto; padding: 20px;">
                <header style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px;">
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <img src="https://res.cloudinary.com/openchat07/image/upload/v1736329296/Logo/OpenChat.png" alt="Logo" width="50" height="50" />
                    <h1 style="font-size: 24px; font-weight: bold; color: #1F2937;">Welcome to Our Service</h1>
                  </div>
                </header>

                <div style="font-family: sans-serif; color: #4B5563;">
                  <h2 style="font-size: 20px; margin-bottom: 16px;">Hello, Shantanu Suthar!</h2>
                  <p style="font-size: 16px; line-height: 1.5;">
                    Welcome to our service! Below are your account details:
                  </p>

                  <div style="background-color: #F9FAFB; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); border-radius: 8px; padding: 20px; margin-top: 20px; gap: 20px;">
                    <div style="display: flex; align-items: center; gap: 16px;">
                      <img src="https://res.cloudinary.com/openchat07/image/upload/v1735818078/Users/profile/defaultprofile.svg" alt="Profile Picture" width="100" height="100" style="border-radius: 50%; border: 4px solid #3B82F6;" />
                      <div>
                        <div style="font-size: 18px; font-weight: 600;">shantanusuthar</div>
                        <div style="display: flex; align-items: center; gap: 8px;">
                          <span style="padding: 6px 12px; font-size: 14px; border-radius: 12px; background-color: #10B981; color: #F8F8F8;">
                            Verified
                          </span>
                        </div>
                      </div>
                    </div>

                    <div style="margin-top: 16px;">
                      <div style="display: flex; justify-content: space-between;">
                        <span style="font-weight: bold;">Email:</span>
                        <span>shantanu@example.com</span>
                      </div>
                      <div style="display: flex; justify-content: space-between;">
                        <span style="font-weight: bold;">Age:</span>
                        <span>25</span>
                      </div>
                      <div style="display: flex; justify-content: space-between;">
                        <span style="font-weight: bold;">Occupation:</span>
                        <span>Software Developer</span>
                      </div>
                      <div style="display: flex; justify-content: space-between;">
                        <span style="font-weight: bold;">Location:</span>
                        <span>Mumbai, India</span>
                      </div>
                      <div style="display: flex; justify-content: space-between;">
                        <span style="font-weight: bold;">Gender:</span>
                        <span>Male</span>
                      </div>
                      <div style="display: flex; justify-content: space-between;">
                        <span style="font-weight: bold;">Joined:</span>
                        <span>2023-01-15</span>
                      </div>
                    </div>
                  </div>

                  <div style="margin-top: 20px; text-align: center;">
                    <a href="https://example.com/dashboard" style="background-color: #3B82F6; color: #F8F8F8; padding: 10px 20px; border-radius: 8px; font-size: 18px; transition: background-color 0.3s; text-decoration: none;">
                      Go to Dashboard
                    </a>
                  </div>

                  <p style="font-size: 16px; line-height: 1.5;">
                    If you have any questions or need help, don't hesitate to{" "}
                    <a href="mailto:support@example.com" style="color: #3B82F6;">reach out to our support team</a>.
                  </p>
                </div>

                <footer style="margin-top: 40px; text-align: center; font-size: 14px; color: #4B5563;">
                  <p>© 2025 Our Service. All rights reserved.</p>
                  <p>
                    <a href="https://example.com/privacy" style="color: #3B82F6; text-decoration: underline;">Privacy Policy</a> |
                    <a href="https://example.com/terms" style="color: #3B82F6; text-decoration: underline;">Terms of Service</a>
                  </p>
                </footer>
              </div>
            `,
            text: `Hello ${firstName},\n\nCongratulations! Your account registration is successful.`,
          });
        }
        console.log(account.provider);
        return {
          ...newUser?.toObject(),
          provider: account?.provider || "credentials",
        };
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },
    async session({ session, token }) {
      try {
        await connectDB();
        const user = await Users.findOne({ email: session.user.email });
        if (user) {
          session.user.id = token.id || user._id.toString();
          session.user.firstName = token.firstName || user.firstName;
          session.user.lastName = token.lastName || user.lastName;
          session.user.age = token.age || user.age;
          session.user.gender = token.gender || user.gender;
          session.user.profilePicture =
            token.profilePicture || user.profilePicture;
          session.user.joinedDate = token.joinedDate || user.joinedDate;
          session.user.isVerified = token.isVerified || user.isVerified;
          session.user.username = token.username || user.username;
          session.user.occupation = token.occupation || user.occupation;
          session.user.location = token.location || user.location;
          session.user.chatHistory = token.chatHistory || user.chatHistory;
          session.user.provider = token.provider || "credentials";
        }
        return session;
      } catch (error) {
        console.error("Error in session callback:", error);
        return session;
      }
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.age = user.age;
        token.gender = user.gender;
        token.profilePicture = user.profilePicture;
        token.joinedDate = user.joinedDate;
        token.isVerified = user.isVerified;
        token.username = user.username;
        token.occupation = user.occupation;
        token.location = user.location;
        token.chatHistory = user.chatHistory;
        token.provider = account?.provider || "credentials";
      }
      return token;
    },
  },

  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    signUp: "/signup",
    newUser: "/dashboard",
    verify: "/verify",
    error: "/error",
  },
  debug: true,
};

import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectDB from "@/app/lib/mongoDB";
import Users from "@/app/models/Users";
import sendEmail from "@/app/lib/nodemailer";

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
    async signIn({ user }) {
      try {
        await connectDB();
        const existingUser = await Users.findOne({ email: user.email });

        if (existingUser && !existingUser.isVerified) {
          return false;
        }

        if (!existingUser) {
          const newUser = new Users({
            email: user.email,
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            profilePicture: user.profilePicture,
            isVerified: true,
            username: user.username || "",
            occupation: user.occupation || "",
            location: user.location || "",
          });
          await newUser.save();
        }

        return true;
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
          session.user.profilePicture = token.profilePicture || user.profilePicture;
          session.user.joinedDate = token.joinedDate || user.joinedDate;
          session.user.isVerified = token.isVerified || user.isVerified;
          session.user.username = token.username || user.username;
          session.user.occupation = token.occupation || user.occupation;
          session.user.location = token.location || user.location;
          session.user.chatHistory = token.chatHistory || user.chatHistory;
        }
        return session;
      } catch (error) {
        console.error("Error in session callback:", error);
        return session;
      }
    },
    async jwt({ token, user }) {
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
    verify: "/verify",
  },
};

import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectDB from "@/app/lib/mongoDB";
import Users from "@/app/models/Users";
import sendEmail from "../lib/nodemailer";

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
            firstName: user.firstName,
            emailType: "VERIFY",
            otp,
          });
          throw new Error("User is not verified.");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        return { id: user._id, email: user.email, role: user.role };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        await connectDB();
        const existingUser = await Users.findOne({ email: user.email });

        if (existingUser && !existingUser.isVerified) {
          return false;
        }

        if (!existingUser) {
          const newUser = new Users({
            email: user.email,
            firstName: user.name?.split(" ")[0] || "",
            lastName: user.name?.split(" ")[1] || "",
            profilePicture: user.image,
            isVerified: true,
          });
          await newUser.save();
        }

        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },
    async session({ session }) {
      try {
        await connectDB();
        const user = await Users.findOne({ email: session.user.email });
        if (user) {
          session.user.id = user._id.toString();
          session.user.role = user.role;
          session.user.isVerified = user.isVerified;
        }
        return session;
      } catch (error) {
        console.error("Error in session callback:", error);
        return session;
      }
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

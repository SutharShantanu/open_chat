import bcrypt from 'bcryptjs';
import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'email@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await dbConnect();

        const user = await User.findOne({ email: credentials.email });
        if (!user) {
          throw new Error('No user found with this email');
        }

        // Check the password
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) {
          throw new Error('Invalid password');
        }

        // Return the user object
        return { id: user._id, email: user.email, name: `${user.firstName} ${user.lastName}` };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
};

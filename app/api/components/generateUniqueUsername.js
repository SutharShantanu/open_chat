import User from "@/app/models/Users";

const generateUsername = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let username = "";
  for (let i = 0; i < 6; i++) {
    username += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return username;
};

const generateUniqueUsername = async () => {
  let username = generateUsername();
  let usernameExists = await User.findOne({ username });

  while (usernameExists) {
    username = generateUsername();
    usernameExists = await User.findOne({ username });
  }

  return username;
};

export default generateUniqueUsername;

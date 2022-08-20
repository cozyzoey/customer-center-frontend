import cookie from "cookie";
import { API_URL } from "@/constants/config";

const register = async (req, res) => {
  if (req.method === "POST") {
    const { username, email, password } = req.body;

    const strapiRes = await fetch(`${API_URL}/api/auth/local/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    });

    const { jwt, user, error } = await strapiRes.json();

    if (strapiRes.ok) {
      res.status(200).json({ user, token: jwt });
    } else {
      res.status(error.status).json({ message: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
};

export default register;

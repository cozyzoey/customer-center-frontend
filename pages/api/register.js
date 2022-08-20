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
      return res.status(200).json({ user, token: jwt });
    } else {
      return res.status(error.status).json({ message: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res
      .status(405)
      .json({ message: `Method ${req.method} not allowed` });
  }
};

export default register;

const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const { users } = require("../database");
const { sign } = require("jsonwebtoken");

require("dotenv").config();

router.post(
  "/signup",
  [
    check("email", "Invalid email").isEmail(),
    check("password", "Password must be 6 char long").isLength({
      min: 6,
    }),
  ],

  async (req, res) => {
    const { email, password } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    let user = users.find((user) => {
      return user.email === email;
    });

    if (user) {
      return res.status(200).json({
        errors: [
          {
            email: user.email,
            msg: "The User already exists",
          },
        ],
      });
    }

    const salt = await bcrypt.genSalt(10);
    console.log("salt:", salt);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("hashed password:", hashedPassword);

    users.push({
      email,
      password: hashedPassword,
    });

    const accessToken = await JWT.sign(
      { email },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "10s",
      }
    );
    res.json({
      accessToken,
    });
  }
);

router.get("/users", (req, res) => {
  res.json(users);
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  let user = users.find((user) => {
    return user.email === email;
  });

  if (!user) {
    return res.status(400).json({
      errors: [
        {
          msg: "Invalid credentials",
        },
      ],
    });
  }

  let isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({
      errors: [
        {
          msg: "Email or password is invalid",
        },
      ],
    });
  }

  const accessToken = await JWT.sign(
    { email },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "10s",
    }
  );

  const refreshToken = await JWT.sign(
    { email },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "20s",
    }
  );

  refreshTokens.push(refreshToken);

  res.json({
    accessToken,
    refreshToken,
  });
});

let refreshTokens = [];

router.post("/token", async (req, res) => {
  // const refreshToken = req.header("x-auth-token");

  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    res.status(401).json({
      errors: [
        {
          msg: "Token not found",
        },
      ],
    });
  }

  if (!refreshTokens.includes(refreshToken)) {
    res.status(403).json({
      errors: [
        {
          msg: "Invalid Refresh Token",
        },
      ],
    });
  }

  try {
    const user = await JWT.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const { email } = user;
    const accessToken = await JWT.sign(
      { email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "10s" }
    );
    res.json({ accessToken });
  } catch (error) {
    res.status(403).json({
      errors: [
        {
          msg: "Invalid token",
        },
      ],
    });
  }
});

router.delete("/logout", (req, res) => {
  const refreshToken = req.header("x-auth-token");
  refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
  res.sendStatus(204);
});

module.exports = router;

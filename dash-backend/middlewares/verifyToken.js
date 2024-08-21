const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const authHeaders = req.headers.authorization;

  if (authHeaders) {
    const token = authHeaders.split(" ")[1];
    // console.log(token);

    jwt.verify(token, process.env.JWT_SEC, async (error, user) => {
      if (error) {
        return res.status(403).json({ status: false, message: "Token not valid" });
      }
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("You are not authenticated!");
  }
}

const verifyAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (
      req.user.userType === "Client" ||
      req.user.userType === "Vendor" ||
      req.user.userType === "Admin" ||
      req.user.userType === "Driver"
    ) {
      next();
    } else {
      res
        .status(403)
        .json({ status: false, message: "You are not Authorized!" });
    }
  });
};

const verifyVendor = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.userType === "Vendor" || req.user.userType === "Admin") {
      next();
    } else {
      res
        .status(403)
        .json({ status: false, message: "You are not Authorized!" });
    }
  });
};

const verifyDriver = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.userType === "Driver" || req.user.userType === "Admin") {
      next();
    } else {
      res
        .status(403)
        .json({ status: false, message: "You are not Authorized!" });
    }
  });
};

const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.userType === "Admin") {
      next();
    } else {
      res
        .status(403)
        .json({ status: false, message: "You are not Authorized!" });
    }
  });
};

module.exports = {
  verifyToken,
  verifyAndAuthorization,
  verifyVendor,
  verifyDriver,
  verifyAdmin,
};

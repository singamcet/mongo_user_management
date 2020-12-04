const db = require("../models");
const Users = db.users;
const jwtService = require("./../services/jwtService");
const hashingService = require("./../services/hashingService");

// Create and Save a new users
exports.create = async (req, res) => {
  // Validate request
  if (!req.body.first_name) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  let encryptedPwd = await hashingService.generatePasswordHash(req.body.password)
  const users = new Users({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    address: req.body.address,
    email: req.body.email,
    password: encryptedPwd
  });
  // Save users in the database
  users
    .save(users)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the users."
      });
    });
};

// Retrieve all userss from the database.
exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = title ? { first_name: { $regex: new RegExp(title), $options: "i" } } : {};

  Users.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving userss."
      });
    });
};

// Find a single users with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  if(req.body.tokenDetails.id!=id){
    res.status(403).send({ message: "Permission Denied"});
  }
  Users.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found users with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving users with id=" + id });
    });
};

// Update a users by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;
  if(req.body.tokenDetails.id!=id){
    res.status(403).send({ message: "Permission Denied"});
  }
  Users.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update users with id=${id}. Maybe users was not found!`
        });
      } else res.send({ message: "users was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating users with id=" + id
      });
    });
};

// Delete a users with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  if(req.body.tokenDetails.id!=id){
    res.status(403).send({ message: "Permission Denied"});
  }
  Users.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete users with id=${id}. Maybe users was not found!`
        });
      } else {
        res.send({
          message: "users was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete users with id=" + id
      });
    });
};

const sendUserNotFound = (res) => res.status(404).send({
  message: "No accounts find with this credentials"
});

const updateLogin = (email, token) => {
  let tokenData = {
    token
  }
  Users.update(
    { email: email },
    { $push: { logins: tokenData } }
  ).then(data => {
    console.log("Dta", data)
  }).catch(err => {
    console.log("err", err)

  })
}
// login
exports.login = async (req, res) => {

  const email = req.body.email;
  var condition = { email }
  Users.find(condition)
    .then(async (data) => {
      console.log("Json ---", JSON.stringify(data))
      if (data.length > 0) {
        let userDetails = data[0]
        try {
          let isSame = await hashingService.comparePassword(req.body.password, userDetails["password"])
          if (isSame) {
            let tokenPayload = {
              "email": userDetails.email,
              "id": userDetails.id
            }
            let token = jwtService.generateToken(tokenPayload)
            delete userDetails["password"]
            delete userDetails["logins"]
            updateLogin(email, token)
            res.send({
              token, userDetails
            });
          } else {
            sendUserNotFound(res)
          }
        } catch (error) {
          sendUserNotFound(res)
        }
      } else {
        sendUserNotFound(res)
      }
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving userss."
      });
    });
};

// Find a single users with an id
exports.listLogins = (req, res) => {
  const id = req.params.id;
  if(req.body.tokenDetails.id!=id){
    res.status(403).send({ message: "Permission Denied"});
  }
  Users.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found users with id " + id });
      else res.send(data.logins);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving users with id=" + id });
    });
};



const auth = require("./../middlewares").authorizer
module.exports = app => {
    const users = require("../controllers/users.controller.js");
  
    var router = require("express").Router();
  
    // Create a new users
    router.post("/", users.create);
  
    // Retrieve all users
    router.get("/", users.findAll);
    
    // Retrieve a single users with id
    router.get("/:id",auth, users.findOne);
  
    // Update a users with id
    router.put("/:id",auth, users.update);
  
    // Delete a users with id
    router.delete("/:id",auth, users.delete);

    router.get("/:id/logins",auth, users.listLogins);

    router.post("/login", users.login);
  
    app.use("/api/users", router);
  };
  
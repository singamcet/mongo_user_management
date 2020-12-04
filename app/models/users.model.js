module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      first_name: String,
      last_name: String,
      address: String,
      email: { type: String, unique: true },
      password: String,
      logins: [{
        login_time: { type : Date, default: Date.now },
        token: String
      }]
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const users = mongoose.model("users", schema);
  return users;
};

const {mongoose}= require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    fullName: String,
    age: Number,
    moyenne: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

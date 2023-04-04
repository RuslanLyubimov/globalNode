import Joi from "joi";

export const userSchema = Joi.object({
  login: Joi.string().required(),
  password: Joi.string().required().alphanum(),
  age: Joi.number().required().min(4).max(130),
});

export const groupSchema = Joi.object({
  name: Joi.string().required(),
  permissions: Joi.array()
    .unique()
    .min(1)
    .max(5)
    .items(
      Joi.string().valid("READ", "WRITE", "SHARE", "DELETE", "UPLOAD_FILES")
    )
    .required(),
});

export const queryParamSchema = Joi.object({
  loginSubstring: Joi.string().required(),
  limit: Joi.number().integer().required(),
});

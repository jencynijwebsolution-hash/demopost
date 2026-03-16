import Joi from "joi";

const emailValidtor = (value: string, helpers: any) => {
    if(!value.includes("@")){
        return helpers.message("password must contain @");
    }
    return value;
}

const strongPasswordValidator = (value: string, helpers: any) => {

  if (value.length < 6) {
    return helpers.message("Password must be at least 6 characters long");
  }

  if (!/[A-Z]/.test(value)) {
    return helpers.message("Password must contain at least one uppercase letter");
  }

  if (!/[a-z]/.test(value)) {
    return helpers.message("Password must contain at least one lowercase letter");
  }

  if (!/[0-9]/.test(value)) {
    return helpers.message("Password must contain at least one number");
  }

  if (!/[!@#$%^&*]/.test(value)) {
    return helpers.message("Password must contain at least one special character");
  }

  return value;
};

export const registerSchema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().required().custom(emailValidtor),
    password: Joi.string().min(6).required().custom(strongPasswordValidator),
});

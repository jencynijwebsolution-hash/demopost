import Joi from "joi";

export const depositSchema = Joi.object({
    user_id: Joi.number().required(),
    amount: Joi.number().positive().required(),
    payment_method: Joi.string().required(),
    remark: Joi.string().optional()
});
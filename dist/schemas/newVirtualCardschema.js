import Joi from "joi";
export var newVirtualCardSchema = Joi.object({
    cardId: Joi.number().required(),
    password: Joi.string().length(4).required()
});

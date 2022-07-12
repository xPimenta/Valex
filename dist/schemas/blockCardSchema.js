import Joi from "joi";
export var blockCardSchema = Joi.object({
    cardId: Joi.number().required(),
    password: Joi.string().length(4).required()
});

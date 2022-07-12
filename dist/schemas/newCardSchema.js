import Joi from "joi";
export var newCardSchema = Joi.object({
    employeeId: Joi.number().required(),
    cardType: Joi.equal("groceries", "restaurant", "transport", "education", "health")
});

import Joi from "joi";

// Define Joi schema for validation
const PostSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  tags: Joi.array().items(Joi.string()),
  body: Joi.string().required(),
});

const updatePostSchema = Joi.object({
  state: Joi.boolean(),
  title: Joi.string(),
  description: Joi.string(),
  tags: Joi.array().items(Joi.string()),
  body: Joi.string(),
  
});

export { PostSchema, updatePostSchema };

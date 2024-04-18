import Joi from 'joi';

// Define Joi schema for validation
const PostSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  tags: Joi.array().items(Joi.string()),
  body: Joi.string().required(),
});

export default PostSchema;

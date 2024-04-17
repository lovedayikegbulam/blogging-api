import Joi from 'joi';

// Define Joi schema for validation
const PostSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  tags: Joi.array().items(Joi.string()),
  readCount: Joi.number().integer().default(0),
  author: Joi.string().required(),
  authorId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/), // Assuming it's a valid ObjectId
  state: Joi.string().valid('draft', 'published').default('draft'),
  body: Joi.string().required(),
  readTime: Joi.string(),
});

export default PostSchema;

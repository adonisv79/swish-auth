import Joi from '@hapi/joi';

interface DictionaryType<TValue> {
  [id: string]: TValue;
}

export const shemaBasicTypes = {
  generic: {
    objectIdString: Joi.string().length(24).hex()
      .error(new Error('The id field should be a 24 character hex sting.')),
  },
  users: {
    username: Joi.string().case('lower').alphanum().min(3).max(30)
      .error(new Error('username should be lowercased alphanumeric of length 3-30.')),
    password: Joi.string().min(50).max(70)
      .pattern(new RegExp(/\$[A-Z,a-z, 0-9]+\$[A-Z,a-z, 0-9]+\$[A-Z,a-z, 0-9,\./\\]+/))
      .error(new Error('password should be a bcrypt hash of length 50-70.')),
  },
  contacts: {
    email: Joi.string().min(5).max(150).email({ minDomainSegments: 2 })
      .error(new Error('email should be a valid email format with max 5-150 character length.')),
  },
};

const requestSchemas: DictionaryType<Joi.ObjectSchema> = {
  usersRegistration: Joi.object({
    username: shemaBasicTypes.users.username.required(),
    password: shemaBasicTypes.users.password.required(),
  }),
};

export function validateParameters(data: any, schema: string): Joi.ValidationResult {
  if (!requestSchemas[schema]) { throw new Error(`Validation schema "${schema}" does not exist.`); }
  return requestSchemas[schema].validate(data);
}

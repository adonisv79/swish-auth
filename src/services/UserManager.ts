import Ajv from 'ajv';

const ajv = new Ajv();
const newUserSchema = {
  properties: {
    userid: {
      type: 'string', minLength: 3, maxLength: 50,
    },
    password: {
      type: 'string', minLength: 2, maxLength: 5,
    },
  },
};
const validate = ajv.compile(newUserSchema);

export interface UsersModel {
  createUser(): () => Promise<void>;
}

export default class UserManager {
  private userM: UsersModel;

  constructor(userModel: UsersModel) {
    this.userM = userModel;
  }

  async registerUser(userid: string, password: string): Promise<boolean> {
    const valid = validate({ userid, password });
    if (!valid) {
      throw new Error(ajv.errorsText(validate.errors));
    }
    return true;
  }
}

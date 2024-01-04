/* eslint-disable*/

interface User {
  id: number;
  email: string;
}

export default interface GenericBody {
  user: User;
}

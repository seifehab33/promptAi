// import { User } from 'src/auth/entity/user.entit';

import { User } from 'src/user/entities/user.entity';

const getUserNameFromUserId = (userId: number, user: User) => {
  return user?.id === userId ? user.name : 'unknown';
};

export default getUserNameFromUserId;

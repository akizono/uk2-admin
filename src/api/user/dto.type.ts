export interface BaseUser {
  id?: string
  username?: string
  nickname?: string
  age?: number
  sex?: number
  remark?: string
  email?: string
  mobile?: string
  avatar?: string
  status?: number
}

export interface UserList extends Omit<BaseUser, 'id'> {
  pageSize?: number
  currentPage?: number
}

export interface CreateUser extends Omit<BaseUser, 'id'> {

}

export interface UpdateUser extends BaseUser {

}

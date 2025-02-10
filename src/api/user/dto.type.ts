export interface BaseUser {
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

export interface UserList extends BaseUser {
  pageSize?: number
  currentPage?: number
}

export interface CreateUser extends BaseUser {

}

export interface UpdateUser extends BaseUser {
  id: string
}

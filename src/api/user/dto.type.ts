export interface BaseUserDTO {
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

export interface UserListDTO extends BaseUserDTO {
  pageSize?: number
  currentPage?: number
}

export interface CreateUserDTO extends BaseUserDTO {

}

export interface UpdateUserDTO extends BaseUserDTO {
  id: string
}

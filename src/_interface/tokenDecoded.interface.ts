export interface TokenDecoded {
  iss: string
  sub: string
  aud: string
  exp: Date
  iat: Date
  amr: string[]
  name: string
  picture: string
  email: string
}

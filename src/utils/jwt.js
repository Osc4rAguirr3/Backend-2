import jwt from 'jsonwebtoken'

let secretKey = "JWTSecret"

export const generateToken = (user) => {
    const token = jwt.sign(
        { user: { firstName: user.firstName, email: user.email ,role: user.role } },
        secretKey,
        { expiresIn: '24h' }
    )
    return token
}
import jwt from 'jsonwebtoken'

export default function (id, username, password) {
    const payload = {
        id: id,
        username: username
    };

    const secretKey = password;

    const options = {
        expiresIn : '1h',
        issuer : ''
    };

    const token = jwt.sign(payload,secretKey,options);
}
import jwt from "jsonwebtoken"



const generatedToken = (res, userId) => {
  
    // Access token that expires in 15 minutes
    const accessToken = jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });

    // Refresh token that expires in 30 days
    const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
   

    // Setting the access token in HTTP-only cookie
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 15 * 60 * 1000,
    });

    // Setting the refresh token in HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 30 * 24 * 60 * 60 * 1000,  // 30 days
    });
    return {accessToken , refreshToken}
}

export default generatedToken;
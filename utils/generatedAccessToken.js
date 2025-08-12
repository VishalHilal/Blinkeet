import jwt from 'jsonwebtoken'

const generatedAccessToken = async(userId)=>{
    console.log("SECRET_KEY_ACCESS_TOKEN:", process.env.SECRET_KEY_ACCESS_TOKEN ? "exists" : "missing");
    
    if (!process.env.SECRET_KEY_ACCESS_TOKEN) {
        throw new Error("SECRET_KEY_ACCESS_TOKEN is not set in environment variables");
    }

    const token = await jwt.sign({ id : userId},
        process.env.SECRET_KEY_ACCESS_TOKEN,
        { expiresIn : '5h'}
    )

    return token
}

export default generatedAccessToken
import nodemailer from "nodemailer";

//  for creating connection with mailtrap
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth:{
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
})
//  function to send email 

export const sendEmail = async (to: string, subject: string, html: string) => {
    try{
        const info = await transporter.sendMail({
            from: '"admin" < admin@inapp.local >',
            to,
            html ,
            subject 
        })
        console.log("Email sends : ", info.messageId)
    }catch(error){
        console.error("Error Sending Email : ", error)
    }
}
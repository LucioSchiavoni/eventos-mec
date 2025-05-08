import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();



const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port : process.env.PORT_EMAIL,
    secure: false, 
    auth: {
        user: process.env.USER, 
        pass: process.env.PASS, 
    },
})




export const sendEmailService = async (email, lugar, hora_ini, hora_fin, fecha, codigo) => {
    try {

      const fechaOriginal = fecha; 
      const fechaObj = new Date(fechaOriginal);
      const diasSemana = [
            "Domingo", "Lunes", "Martes", "Miércoles", 
            "Jueves", "Viernes", "Sábado"
        ];
      const diaSemana = diasSemana[fechaObj.getDay()];
      const diaMes = fechaObj.getDate();
      const fechaFormateada = `${diaSemana} ${diaMes}`;

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmación de Reserva</title>
    <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .container {
      border: 1px solid #ddd;
      border-radius: 5px;
      padding: 20px;
      background-color: #f9f9f9;
    }
    .header {
      background-color: #4a6ea9;
      color: white;
      padding: 10px 20px;
      border-radius: 5px 5px 0 0;
      margin: -20px -20px 20px;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      text-align: center;
      color: #666;
    }
    .highlight {
      font-weight: bold;
      color: #4a6ea9;
    }
    .code {
      background-color: #f0f0f0;
      padding: 8px 15px;
      border-radius: 4px;
      font-family: monospace;
      font-size: 18px;
      letter-spacing: 1px;
      border: 1px dashed #ccc;
      display: inline-block;
      text-transform: uppercase;
      font-weight: bold;
    }
    </style>
    </head>
    <body>
    <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 24px;">Confirmación de Reserva</h1>
    </div>
    
    <p>Estimado/a cliente,</p>
    
    <p>Le confirmamos que se ha realizado correctamente su reserva:</p>
    
    <p>Se reservó <span class="highlight">${lugar}</span> para el <span class="highlight">${fechaFormateada}</span> desde las <span class="highlight">${hora_ini}</span> hasta las <span class="highlight">${hora_fin}</span>.</p>
    
    <p>Su código de reserva es: <div class="code">${codigo.toUpperCase()}</div></p>
    
    <p>Por favor, conserve este código para futuras referencias. Lo necesitará para cualquier modificación o cancelación de su reserva.</p>
     
    <p>Saludos cordiales,<br>
    El Equipo de Sistemas</p>
    
    <div class="footer">
      Este es un correo automático, por favor no responda a este mensaje.
    </div>
    </div>
    </body>
    </html>
    `



        const mailOptions = {
            from: process.env.USER,
            to: email,
            cc: process.env.EMAIL_CC,
            subject: 'Confirmación de Reserva',
            html: htmlContent,
        };
        await transporter.sendMail(mailOptions);
        return {message: "Email enviado con exito", success: true};
    } catch (error) {
        throw error;
    }
}



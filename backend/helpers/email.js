const style = `
    background: #eee;
    padding: 20px;
    border-radius: 20px;
`;

const emailTemplate = (email, content, replyTo, subject) => {
  return {
    Source: '"Skyward" <' + replyTo + ">",
    Destination: { ToAddresses: [email] },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `
                <html>
                    <div style="${style}">
                        <h1>Welcome to <span style="color:blue">Skyward</span></h1>
                        ${content}
                        <p>Skyward &copy; ${new Date().getFullYear()}</p>
                    </div>
                </html>
              `,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
  };
};

export default emailTemplate;

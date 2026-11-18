import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { sendEmail } from "@/lib/email";

const client = new MongoClient(process.env.MONGODB_URL!)
const db = client.db("pizza");

export const auth = betterAuth({

    databaseHooks: {
        user: {
            create: {
                before: async (user) => {
                    const role = user.role === "vendor" ? "vendor" : "customer";

                    return {
                        data: {
                            ...user,
                            role,
                        },
                    };
                },
            },
        },
    },

    emailAndPassword: {
        enabled: true,

        sendResetPassword: async ({ user, url }) => {
            await sendEmail({
                to: user.email,
                subject: "Reset Your PizzaHub Password",
                text: `
                Hello ${user.name},

                We received a request to reset your PizzaHub password.

                Click the link below to reset your password:

                ${url}

                If you did not request this, please ignore this email.

                Thank you,
                PizzaHub Team
      `,
            });
        },
    },
    user: {
        additionalFields: {
            role: {
                type: ["customer", "vendor"],
                required: false,
                defaultValue: "customer",
                input: true, // সাইন-আপের সময় ক্লায়েন্ট থেকে role পাঠানো যাবে
            },
        },
    },

    account: {
        accountLinking: {
            enabled: true,
            trustedProviders: ["google"],
        },
    },

    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
    database: mongodbAdapter(db, {
        client,
    }),
});
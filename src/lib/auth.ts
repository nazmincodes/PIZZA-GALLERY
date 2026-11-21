import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { sendEmail } from "@/lib/email";
import { jwt, admin } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGODB_URL!);
const db = client.db("pizza");

export const auth = betterAuth({
    plugins: [
        admin({
            defaultRole: "customer",
            adminRoles: ["admin"],
            bannedUserMessage:
                "Your account has been blocked. Please contact PizzaHub support.",
        }),

        jwt({
            jwt: {
                issuer: "http://localhost:3000",
                audience: "http://localhost:3000",
                expirationTime: "15m",

                definePayload: ({ user }) => ({
                    id: user.id,
                    email: user.email,
                    role: user.role,
                }),
            },
        }),
    ],

    databaseHooks: {
        user: {
            create: {
                before: async (user) => {
                    const role =
                        user.accountType === "vendor"
                            ? "vendor"
                            : "customer";

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

${url}

Thank you,
PizzaHub Team
                `,
            });
        },
    },

    user: {
        additionalFields: {
            accountType: {
                type: "string",
                required: false,
                defaultValue: "customer",
                input: true,
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

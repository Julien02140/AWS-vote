import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';

const ddb = DynamoDBDocument.from(new DynamoDB());

export const handler = async (event) => {
    console.log("Received event:", JSON.stringify(event, null, 2));

    const { pseudo, password } = event;

    // Vérifier que l'pseudo et le mot de passe sont fournis
    if (!pseudo || !password) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "pseudo and password are required" })
        };
    }
    
    try {
        // Étape 1: Scanner la table pour trouver l'utilisateur avec le pseudo fourni
        const scanParams = {
            TableName: "Users",
            FilterExpression: "pseudo = :pseudo",
            ExpressionAttributeValues: {
                ":pseudo": pseudo
            }
        };

        const scanResult = await ddb.scan(scanParams);

        // Vérifier si un utilisateur correspondant a été trouvé
        if (!scanResult.Items || scanResult.Items.length === 0) {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: "Invalid pseudo or password" })
            };
        }

        // Étape 2: Comparer les mots de passe
        const user = scanResult.Items[0];
        if (user.password !== password) {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: "Invalid pseudo or password" })
            };
        }

        // Connexion réussie
        return {
            statusCode: 200,
            body: JSON.stringify({ 
                message: "Login successful",
                redirectUrl: "https://projet-vote-s3.s3.eu-west-3.amazonaws.com/home.html"
            })
        };

    } catch (err) {
        console.error("Error", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Failed to log in", error: err.message })
        };
    }
};

    
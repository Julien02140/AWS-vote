import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';

const ddb = DynamoDBDocument.from(new DynamoDB());

const TABLE_NAME = 'Candidats';

export const handler = async () => {
    try {
        const params = {
            TableName: TABLE_NAME,
        };

        const data = await ddb.scan(params);
        console.log("Résultat de la table:", JSON.stringify(data, null, 2));

        // Retourne la liste des candidats si elle n'est pas vide
        if (!data.Items || data.Items.length === 0) {
            return {
                statusCode: 404,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: "Aucun candidat trouvé dans la table." }),
            };
        }

        // Retourne la liste complète des candidats
        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data.Items),
        };
    } catch (error) {
        console.error("Erreur lors de la récupération des candidats:", error);

        // Gestion des erreurs
        return {
            statusCode: 500,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: "Erreur interne du serveur." }),
        };
    }
};

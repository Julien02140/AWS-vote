import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';

const ddb = DynamoDBDocument.from(new DynamoDB());

export const handler = async (event) => { 
    const { id } = event;
    try {

        const candidateId = Number(id);

        if (isNaN(candidateId)) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "ID invalide. Assurez-vous que l'ID est un nombre." })
            };
        }

        const scanParams = {
            TableName: "Candidats",
            FilterExpression: "Candidat_Id = :id",
            ExpressionAttributeValues: {
                ":id": candidateId
            }
        };

        const scanResult = await ddb.scan(scanParams);

        // Vérifier si un utilisateur correspondant a été trouvé
        if (!scanResult.Items || scanResult.Items.length === 0) {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: "Pas de candidat trouvé" })
            };
        }

        const candidat = scanResult.Items[0];

        // Retourner la réponse avec les données du candidat
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Candidat trouvé",
                candidat: candidat
            })
        };

    } catch (err) {
        console.error("Error", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Échec de la récupération du candidat", error: err.message })
        };
    }
};

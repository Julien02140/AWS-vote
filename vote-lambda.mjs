import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';

const ddbClient = new DynamoDB();
const ddb = DynamoDBDocument.from(ddbClient);

export const handler = async (event) => {
    const { Vote_Nom, Candidat_Id, User_Id } = event;

    const params = {
        TableName: "Votes",
        Item: {
            Vote_Nom: Vote_Nom,
            User_Id: User_Id,
            Candidat_Id: Candidat_Id
        },
        ConditionExpression: "attribute_not_exists(User_Id)"  // Vérifie si l'utilisateur a déjà voté
    };

    try {
        await ddb.put(params);
        return { statusCode: 200, body: "Le vote a ete enregistre" };
    } catch (err) {
        if (err.name === "ConditionalCheckFailedException") {
            return { statusCode: 400, body: "Vous avez deja voté pour cette election" };
        }
        return { statusCode: 500, body: JSON.stringify(err) };
    }
};

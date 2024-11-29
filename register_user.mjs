import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';

const ddb = DynamoDBDocument.from(new DynamoDB());

export const handler = async (event) => {
    console.log("Received event:", JSON.stringify(event, null, 2));

    const { lastname, firstname, age, pseudo, email, password } = event;

    if (!lastname || !firstname || !age || !pseudo || !email || !password) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Missing required fields" })
        };
    }

    try {
        //Scanner la table pour obtenir le dernier User_Id
        const scanParams = {
            TableName: "Users",
            ProjectionExpression: "User_Id"
        };
        const scanResult = await ddb.scan(scanParams);

        let maxUserId = 0;
        if (scanResult.Items && scanResult.Items.length > 0) {
            maxUserId = Math.max(...scanResult.Items.map(item => parseInt(item.User_Id, 10)));
        }

        //On incrémente l'id pour le nouvel utilisateur
        const newUserId = maxUserId + 1;

        //Ajout du nouvel utilisateur
        const putParams = {
            TableName: "Users",
            Item: {
                "User_Id": newUserId,
                "User_Name": firstname,
                "lastname": lastname,
                "firstname": firstname,
                "pseudo": pseudo,
                "age": age,
                "email": email,
                "password": password
            }
        };

        console.log("DynamoDB put params:", JSON.stringify(putParams, null, 2));

        const data = await ddb.put(putParams);
        console.log("Success", data);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "User added successfully", data: data })
        };

    } catch (err) {
        console.error("Error", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Failed to add user", error: err.message })
        };
    }
};

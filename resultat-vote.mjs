import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';

const ddb = DynamoDBDocument.from(new DynamoDB());

export const handler = async (event) => {
    const { Vote_Nom } = event;

    const params = {
        TableName: 'Votes',
        KeyConditionExpression: 'Vote_Nom = :voteNom',
        ExpressionAttributeValues: {
            ':voteNom': Vote_Nom,
        },
    };

    try {
        const data = await ddb.query(params);

        if (!data.Items || data.Items.length === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: "Aucun vote trouvé pour cette élection." }),
            };
        }

        const candidatIds = [...new Set(data.Items.map(item => item.Candidat_Id))];
        console.log("IDs des candidats extraits :", candidatIds);

        // Récupérer les noms des candidats un par un
        const candidats = await Promise.all(
            candidatIds.map(async (id) => {
                const candidat = await getCandidatById(id);
                return candidat;
            })
        );

        console.log("Candidats trouvés :", candidats);

        // Vérifier si aucun candidat n'a été trouvé
        if (candidats.length === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: "Aucun candidat correspondant trouvé." }),
            };
        }

        // Calculer des résultats
        const totalVotes = data.Items.length;
        const result = candidats.map((candidat) => {
            const votesForCandidat = data.Items.filter((item) => item.Candidat_Id === candidat.Candidat_Id).length;
            const percentage = (votesForCandidat / totalVotes) * 100;
            return {
                label: `${candidat.firstname} ${candidat.Candidat_Name}`,
                percentage: percentage.toFixed(2),
            };
        });

        return {
            statusCode: 200,
            body: JSON.stringify({
                labels: result.map((item) => item.label),
                data: result.map((item) => item.percentage),
                totalVotes: totalVotes,
            }),
        };
    } catch (err) {
        console.error("Erreur lors de la récupération des votes :", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Erreur interne du serveur." }),
        };
    }
};

const getCandidatById = async (id) => {
    try {
        const scanParams = {
            TableName: "Candidats",
            FilterExpression: "Candidat_Id = :id",
            ExpressionAttributeValues: {
                ":id": id,
            },
        };

        const scanResult = await ddb.scan(scanParams);

        if (!scanResult.Items || scanResult.Items.length === 0) {
            console.log(`Aucun candidat trouvé pour l'ID : ${id}`);
            return null;
        }

        return scanResult.Items[0];
    } catch (err) {
        console.error(`Erreur lors de la récupération du candidat avec l'ID : ${id}`, err);
        return null;
    }
};

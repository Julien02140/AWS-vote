
var AWS = require("aws-sdk");

AWS.config.update({ region: "eu-west-3" });


var ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

var params = {
  AttributeDefinitions: [
    {
      AttributeName: "Candidat_Id",
      AttributeType: "N",
    },
    {
      AttributeName: "Candidat_Name",
      AttributeType: "S",
    },
  ],
  KeySchema: [
    {
      AttributeName: "Candidat_Id",
      KeyType: "HASH",
    },
    {
      AttributeName: "Candidat_Name",
      KeyType: "RANGE",
    },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1,
  },
  TableName: "Candidats",
  StreamSpecification: {
    StreamEnabled: false,
  },
};

// Call DynamoDB to create the table
ddb.createTable(params, function (err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Table Created", data);
  }
});

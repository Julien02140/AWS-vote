// Load the AWS SDK for Node.js
var AWS = require("aws-sdk");
// Set the region
AWS.config.update({ region: "eu-west-3" });

// Create the DynamoDB service object
var ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

var params = {
  TableName: "Candidats",
  Item: {
    "Candidat_Id": { N: "2" },         
    "Candidat_Name": { S: "Lepen" },             
    "firstname": { S: "Marine" },
    "age": { S: "56" },
  }
};

// Call DynamoDB to add the item to the table
ddb.putItem(params, function (err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success", data);
    }
});
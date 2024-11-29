var AWS = require("aws-sdk");
AWS.config.update({ region: "eu-west-3" });

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

ddb.putItem(params, function (err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success", data);
    }
});

const aws = require("aws-sdk");
//Aws Cofiger


aws.config.update({
    accessKeyId: "AKIA2I3GZBJV5JIYZVP4",
    secretAccessKey: "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",
    region: "ap-south-1",
})


var uploadFile = async (file) => {
    return new Promise(function (resolve, reject) {
        // this function will upload file to aws and return the link
        let s3 = new aws.S3({ apiVersion: "2006-03-01" });

        var uploadParams = {
            Bucket: "classroom-training-bucket",
            Key: "group27/" + file.originalname,
            Body: file.buffer,
            ACL: "public-read",
        };

        s3.upload(uploadParams, function (err, data) {
            if (err) {
                return reject({ error: err });
            }
            //console.log(data)
            return resolve(data.Location);
        })
    })
}



module.exports = {uploadFile}
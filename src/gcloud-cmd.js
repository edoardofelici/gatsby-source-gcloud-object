const Storage = require("@google-cloud/storage")

exports.getAllObjects = (project, bucket, prefix) => {
    const storage = new Storage({ projectId: project })
    return storage.bucket(bucket)
        .getFiles({ prefix: prefix })
        .then(results => {
            console.log(results)
            const files = results[0]
            return files
        })
}
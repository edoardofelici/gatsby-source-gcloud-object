const Storage = require("@google-cloud/storage")

exports.getAllObjects = async (project, bucket, prefix) => {
    const storage = new Storage({ projectId: project })
    return await storage.bucket(bucket)
        .getFiles({ prefix: prefix })
        .then(results => {
            const files = results[0]
            return files
        })
}
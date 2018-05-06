
const { createRemoteFileNode } = require('gatsby-source-filesystem')
const gcloudCmd = require("./gcloud-cmd")

const GCloudObjectType = `GCloudObject`

const GCloudObject = (
    baseUrl,
    { //extract gcloud metadata response object
        bucket,
        name,
        contentType,
        timeCreated,
        updated,
        md5Hash,
        etag
    }
) => ({
    baseUrl: baseUrl,
    bucket: bucket,
    name: name,
    contentType: contentType,
    timeCreated: timeCreated,
    updated: updated,
    md5Hash: md5Hash,
    etag: etag
})

const getObjectURL = (o) => {
    return `${o.baseUrl}/${o.bucket}/${o.name}`
}

const createRemoteGCloudNode = async ({
    url,
    store,
    cache,
    createNode
}) => {
    try {
        return await createRemoteFileNode({
            url,
            store,
            cache,
            createNode
        })
    } catch (err) {
        console.err(`Unable to create remote node for: ${url}`)
        return null
    }
}

const createGCloudObjectNode = async ({
    createNode,
    fileNode,
    objectData
}) => {
    createNode({
        //our data
        ...objectData,

        //gatsby data
        id: `${objectData.bucket}/${objectData.name} >> ${GCloudObjectType}`,
        absolutePath: fileNode.absolutePath,
        parent: fileNode.id,
        children: [],
        internal: {
            content: getObjectURL(objectData),
            contentDigest: objectData.md5Hash,
            mediaType: objectData.contentType,
            type: GCloudObjectType
        }
    })
}

exports.sourceNodes = async (
    { boundActionCreators, getNode, hasNodeChanged, store, cache }, //gatsby elements
    { project, bucket, prefix = "", domain = "storage.googleapis.com", protocol = "https" }, //plugin options
    done //completion callback
) => {
    const { createNode } = boundActionCreators

    //let's get all the files in the target bucket and let's create a node GCloudObject
    //linked to a RemoteFileNode
    const objects = await gcloudCmd.getAllObjects(project, bucket, prefix).map(o => GCloudObject(`${protocol}://${domain}`, o.metadata))
    //for each object, let's tell gatsby to fetch the data remotely
    await Promise.all(objects.map(async objectData => {
        const fileNode = await createRemoteGCloudNode({
            url: getObjectURL(objectData),
            store,
            cache,
            createNode
        })
        if (!fileNode) {
            return
        }
        //create the GCloudObject node
        //Remember to link it to the remote file node with localFile___NODE
        objectData.localFile___NODE = fileNode.id
        await createGCloudObjectNode({
            createNode,
            fileNode,
            objectData
        })
    }))

    done()
}
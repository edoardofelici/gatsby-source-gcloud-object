# gatsby-source-gcloud-object
Download objects from a gcloud bucket and create a relative Gatsby Source Node.

Note:
Current version only supports authenticated google cloud users. 
You can: 
-  provide GOOGLE_APPLICATION_CREDENTIALS environment variable 
(https://cloud.google.com/docs/authentication/production#setting_the_environment_variable)
- use `gcloud application-default login` command to use application default credentials (useful when testing locally)

Install
-------

`npm install --save gatsby-source-gcloud-object`


How to use
----------

Add the following to your gatsby-node.js:

```
plugins: [
    {
      resolve: 'gatsby-source-gcloud-object',
      options: {
        project: "core-editor-test",
        bucket: "keplercube-core-editor-test",
        prefix: "" //[optional] defaults to nothing (gets all bucket content)
        domain: null,   //[optional] defaults to `storage.googleapis.com`
        protocol: null, //[optionsal] defaults to `https`
      }
    }
]
```

GraphQL query
------------
```
export const GCloudObjectsQuery = graphql`
query GCloudObjectsQuery{
  allGCloudObject{
    edges{
      node{
        id
        baseUrl
        bucket
        name
        contentType
        timeCreated
        updated
        md5Hash
        etag
        
        absolutePath
        localFile
      }
    }
  }
}
`
```

The localFile element is of particular interest as it references a `file` object, as described by 
https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-source-filesystem. This means that any other plugin 
that works off `gatsby-source-filesystem` can be hooked in and used via localFile. 

Example using `gatsby-image` plugin:

```
gCloudObject(name: {eq: "some-bucket-folder/some-data.json"}){
  localFile{
    childImageSharp{
      resolutions(width: 500, height: 500){
        width
        height
        src
      }
    }
  }
}
```



# gatsby-source-gcloud-object
Download objects from a gcloud bucket and create a relative Gatsby Source Node.

Note:
Current version only supports authenticated google cloud users. 
You can either provide GOOGLE_APPLICATION_CREDENTIALS environment variable (https://cloud.google.com/docs/authentication/production#setting_the_environment_variable)
or use `gcloud application-default login` command to use application default credentials (useful when testing locally)
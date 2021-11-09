export const meta = {
  title: `Overview`,
  description: `Get started with the Admin UI`,
};

Admin UI File Storage provides a simple mechanism for managing user content for your app in public, protected or private storage folders. In Admin UI you can specify authorization rules that limit individual user or group access to create, read, update, or delete operations on your files. The File Storage category comes with built-in support for Amazon S3.

![Admin UI storage start page](/images/console/storageStart.png)

There are two ways to add file storage to Amplify Admin UI - import an existing S3 bucket and create a new S3 bucket. Both methods require the authentication category to also be enabled.

## To set the authorization modes on new file storage

When you create new file storage for your app, you can edit authorization rules.

1. Sign in to the AWS Management console and open AWS Amplify.
2. In the navigation pane, choose an application.
3. On the application information page, choose the **Open Admin UI** tab.
4. On the **Set up** menu, choose **Storage**.
5. On the **Storage** page, locate the **Authorization settings** on the bottom of the *File storage bucket* card.
6. Select your desired authorization settings for **Signed-in users**, or **Guest users** _(optional)_.

The authorization modes can always be edited under **Set up**, **Storage**.

## To import file storage

For default file access levels to work, your bucket needs to be configured accordingly:

public/ - Accessible by all users of your app
protected/{user_identity_id}/ - Readable by all users, writable only by the creating user
private/{user_identity_id}/ - Only accessible for the individual user

[Learn more about how to import file storage.](https://docs.amplify.aws/cli/storage/import/#connect-to-an-imported-s3-bucket-with-amplify-libraries)

## To set the authorization mode on imported file storage

If you're using an imported S3 bucket with an imported Cognito resource, then you'll need to update the policy of your Cognito Identity Pool's authenticated and unauthenticated role. You'll need to create new managed policies (not inline policies) for these roles.

[Learn more about how to configure IAM roles for imported file storage](https://docs.amplify.aws/cli/storage/import/#configuring-iam-role-to-use-amplify-recommended-policies)
import { getUrl } from 'aws-amplify/storage';

export async function parseUrl(awsS3Url) {
    try {
        const [path, ..._] = awsS3Url.split('?')
        const [__, filePath] = path.split('.amazonaws.com/')
        const [___, fileKey] = filePath.split('/')
        return { fileKey, filePath }

    } catch (err) {
        console.error('Err [utils/parseUrl] ::', err.message)
        console.info(JSON.stringify(err))
        throw err
    }
}

export async function getSignedUrl(s3Key) {
    try {
        const getUrlParams = {
            path: s3Key,
            options: {
                expiresIn: 300,
                accessLevel: 'private',
                validateObjectExistence: true,
            }
        }

        const resp = await getUrl(getUrlParams);

        const url = resp.url.toString();
        return url
    } catch (err) {
        console.error('Err [utils/getSignedUrl] ::', err.message)
        console.info(JSON.stringify(err))
        throw err
    }
}
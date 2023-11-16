import * as tus from 'tus-js-client'
type UploadConfig = {
  file: any
  bucketName: string
  objectName: string
  accessToken: string | undefined
  upsert?: string
}

export type FileUploadResponse = {
  message: string
  fileName: string
  song_url: string | null
}

export const uploadWithProgress = (
  { file, bucketName, objectName, accessToken, upsert = 'true' }: UploadConfig,
  onProgressCallback: (bytesUploaded: number, bytesTotal: number) => void,
  onSuccessCallback: (uploadResponse: FileUploadResponse) => void,
  onErrorCallback: (error: FileUploadResponse) => void
) => {
  const upload = new tus.Upload(file, {
    endpoint: `https://${
      import.meta.env.VITE_SUPABASE_PROJECT_ID
    }.supabase.co/storage/v1/upload/resumable`,
    retryDelays: [0, 3000, 5000, 10000, 20000],
    headers: {
      authorization: `Bearer ${accessToken}`,
      'x-upsert': upsert // optionally set upsert to true to overwrite existing files
    },
    uploadDataDuringCreation: true,
    removeFingerprintOnSuccess: true, // Important if you want to allow re-uploading the same file https://github.com/tus/tus-js-client/blob/main/docs/api.md#removefingerprintonsuccess
    metadata: {
      bucketName,
      objectName,
      cacheControl: '3600'
    },
    chunkSize: 6 * 1024 * 1024, // NOTE: it must be set to 6MB (for now) do not change it
    onError: function (error) {
      console.log('Failed because: ' + error)
      const response: FileUploadResponse = {
        message: error.message,
        fileName: file.name,
        song_url: null
      }
      onErrorCallback(response)
    },
    onProgress: onProgressCallback,
    onSuccess: function () {
      onSuccessCallback({ message: 'Success', fileName: file.name, song_url: upload.url })
    }
  })

  // Check if there are any previous uploads to continue.
  upload.findPreviousUploads().then(function (previousUploads) {
    // Found previous uploads so we select the first one.
    if (previousUploads.length) {
      upload.resumeFromPreviousUpload(previousUploads[0])
    }

    // Start the upload
    upload.start()
  })

  return upload
}

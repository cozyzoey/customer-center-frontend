module.exports = ({env}) => ({
  upload: {
    config: {
      provider: 'cloudinary',
      providerOptions: {
        cloud_name: env('CLOUDINARY_NAME'),
        api_key: env('CLOUDINARY_KEY'),
        api_secret: env('CLOUDINARY_SECRET'),
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
      breakpoints: {
        xl: 1920,
        lg: 1000,
        md: 750,
        sm: 500,
      },
    },
  },
  ckeditor: true
})
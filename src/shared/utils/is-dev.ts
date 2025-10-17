export const isDev = () => {
  console.log(process.env.NODE_ENV === 'development');

  return process.env.NODE_ENV === 'development';
};

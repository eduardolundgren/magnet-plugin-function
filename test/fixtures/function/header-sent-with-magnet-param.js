export const route = {
  path: '/fn-header-sent-with-magnet',
  method: 'get',
  type: 'json',
};

export default (req, res, next, magnet) => {
  const {foo} = magnet.getConfig();
  res.send(`headers sent - ${foo}`);
};

export const getHealth = (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'ResolveIQ Backend API is operational',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
};

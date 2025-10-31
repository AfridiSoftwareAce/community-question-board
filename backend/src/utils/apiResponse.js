export const ok = (res, data = null, message = "OK") => {
  return res.json({ message, data });
};

export const created = (res, data = null, message = "Created") => {
  return res.status(201).json({ message, data });
};

export const badRequest = (res, message = "Bad request") => {
  return res.status(400).json({ message });
};

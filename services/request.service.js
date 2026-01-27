export const requests = [];

export const sendRentalRequest = ({ tractorId, userId, message }) => {
  const request = {
    id: Date.now().toString(),
    tractorId,
    userId,
    message,
    status: "PENDING", // ACCEPTED | REJECTED
    createdAt: Date.now(),
  };

  requests.push(request);
  return request;
};

export const getRequestsForOwner = (ownerId) => {
  return requests.filter(r => r.ownerId === ownerId);
};

export const updateRequestStatus = (requestId, status) => {
  const request = requests.find(r => r.id === requestId);
  if (!request) return null;

  request.status = status;
  return request;
};

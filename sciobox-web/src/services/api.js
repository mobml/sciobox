const API = "http://localhost:3000/api/v1";

export const loginRequest = async (email, password) => {
  const res = await fetch(API + "/auth/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ email, password })
  });

  return res.json();
};

export const registerRequest = async (name, email, password) => {
  const res = await fetch(API + "/auth/register", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ name, email, password })
  });

  return res.json();
};

export const getResourcesRequest = async (token) => {
  const res = await fetch(API + "/resources", {
    headers: {
      Authorization: "Bearer " + token
    }
  });

  return res.json();
};

export const createResourceRequest = async (token, url) => {
  await fetch(API + "/resources", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({ url })
  });
};

export const updateResourceRequest = async (token, id, data) => {
  await fetch(API + "/resources/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify(data)
  });
};
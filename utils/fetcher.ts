export const fetcher = (url, data) =>
  fetch(window.location.origin + url, {
    method: data ? 'POST' : 'GET',
    credentials: 'include',
    headers: {
      'content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then((r) => {
    return r.json();
  });

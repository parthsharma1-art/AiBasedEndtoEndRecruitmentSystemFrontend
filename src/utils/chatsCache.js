// Shared cache for chats when user is not on the chats tab (polled every 30s from dashboard).

let recruiterChatsCache = null;
export function getRecruiterChatsCache() {
  return recruiterChatsCache;
}
export function setRecruiterChatsCache(data) {
  recruiterChatsCache = data;
}

let candidateChatsCache = null;
export function getCandidateChatsCache() {
  return candidateChatsCache;
}
export function setCandidateChatsCache(data) {
  candidateChatsCache = data;
}

import api from "../config/Api";

export const fetchTurfs = async () => (await api.get("/api/turfs")).data;

export const saveTurf = async (turf, id) => {
  if (id) return (await api.put(`/api/turfs/${id}`, turf)).data;
  return (await api.post(`/api/turfs`, turf)).data;
};

export const deleteTurf = async (id) => (await api.delete(`/api/turfs/${id}`)).data;

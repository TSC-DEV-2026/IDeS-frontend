import api from "@/utils/axiosInstance";

export type MeResponse = {
  pessoa?: { adm?: boolean; nome?: string };
  usuario?: { email?: string };
};

export async function fetchMe(): Promise<MeResponse | null> {
  try {
    const { data } = await api.get("/user/me");
    return data ?? null;
  } catch {
    return null;
  }
}

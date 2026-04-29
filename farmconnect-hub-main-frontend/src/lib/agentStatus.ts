export type AgentStatus = "not_bought" | "pending" | "active";

export const getAgentStatus = (agentType: string): AgentStatus => {
  return (localStorage.getItem(`agent_status_${agentType}`) as AgentStatus) || "not_bought";
};

export const setAgentStatus = (agentType: string, status: AgentStatus) => {
  localStorage.setItem(`agent_status_${agentType}`, status);
};

export const hasAnyActiveAgent = (): boolean => {
  // returns true if at least one agent is active
  return ["soil", "weather", "pest"].some(
    (type) => getAgentStatus(type) === "active"
  );
};
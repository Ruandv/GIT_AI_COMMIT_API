import { AgentExecutor } from "langchain/dist/agents/executor";
import { BaseMessage } from "@langchain/core/messages";

export interface IAgentExecutorHistoryItem {
    historyId: string;
    executor: AgentExecutor;
    history: BaseMessage[]
}

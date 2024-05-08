import { RunnableSequence } from "@langchain/core/runnables";
import { AgentExecutor } from "langchain/agents";
import { formatToOpenAIFunctionMessages } from "langchain/agents/format_scratchpad";
import { convertToOpenAIFunction } from "@langchain/core/utils/function_calling";

import { OpenAIFunctionsAgentOutputParser } from "langchain/agents/openai/output_parser";
import { ChatOpenAI } from "@langchain/openai";
import { Calculator } from "@langchain/community/tools/calculator";
import DateDiffTool from "../tools/date.diff.tool";
import DateTool from "../tools/date.tool";
import BpmnTokenGeneratorTool from "../tools/token.generator.tool";
import { IAgentExecutorHistoryItem } from "../models/IAgentExecutorHistoryItem";
import { ICallRequest } from "../models/call.request.model";
import GitCommitMessageChatPrompt from "../Templates/promptTemplate";
import { logger } from "../utils/logger";

const chatModel4 = new ChatOpenAI({
    temperature: 0,
    azureOpenAIApiKey: process.env.OPENAI_API_KEY,
    azureOpenAIApiInstanceName: process.env.OPENAI_API_INSTANCE_NAME,
    azureOpenAIApiDeploymentName: process.env.OPENAI_API_CHAT_DEPLOYMENT_NAME_GPT4,
    azureOpenAIApiVersion: process.env.OPENAI_API_VERSION,
    verbose: true,
    maxRetries: 2
});



class LLMService {

    constructor() { }
    private tools = [DateTool, DateDiffTool, BpmnTokenGeneratorTool, new Calculator()];
    private executors: IAgentExecutorHistoryItem[] = [] as IAgentExecutorHistoryItem[];
    private createExecutor() {

        let systemDescription = `Today's date is ${new Date().toString()}\n`;
        systemDescription += `You are a git comment generator. 
                    You will receive a diff file that has changes in it that the person has made to his code. 
                    You need to generate a detailed conventional commit message with a subject body and an optional footer 
                    for the changes that can be used as a commit message. 
                    Remember the following rules :
                    1. body's lines must not be longer than 100 characters.
                    2. subject must not be sentence-case, start-case, pascal-case, upper-case
                    3. body must have leading blank line
                    4. every line must start with a # and a space

                    Here is an example of a diff file: 
                    
                    diff --git a/client/src/views/Home.vue b/client/src/views/Home.vue
                    index 71f02e8..3559591 100644
                    --- a/client/src/views/Home.vue
                    +++ b/client/src/views/Home.vue
                    @@ -181,7 +181,7 @@ function startGame()
                     {{}}
                     {{
                         svg rect 
                         -  fill: #54e8dd;
                         +  fill: #54e80d;
                    }}
                    
                    and the output should look like this:
                    
                     chore : changed color value 
                      
                     Changed the color value for the svg fill parameter.                    
                `;

        const prompt = GitCommitMessageChatPrompt;

        const modelWithFunctions = chatModel4.bind({
            functions: this.tools.map((tool) => convertToOpenAIFunction(tool)),
        });

        const agentWithMemory = RunnableSequence.from([
            {
                text: (i) => i.text,
                language: (i) => i.language,
                agent_scratchpad: (i) => formatToOpenAIFunctionMessages(i.steps),
                chat_history: (i) => i.chat_history,
            },
            prompt,
            modelWithFunctions,
            new OpenAIFunctionsAgentOutputParser(),
        ]);

        const executorWithMemory = AgentExecutor.fromAgentAndTools({
            agent: agentWithMemory,
            tools: this.tools,
        });

        const executor = {
            historyId: 'git_commit_generator',
            executor: executorWithMemory,
            history: [] /* we don't want to keep a memory of commits */
        };

        this.executors.push(executor);

        return executor;
    }

    public async generateCommit(request: ICallRequest) {
        try {
            // check if you have an executor for the request.historyId
            var executor = this.createExecutor();
            var myExec = executor.executor;
            var response = await myExec.invoke({
                text: request.prompt,
                language: request.config?.language ?? 'english',
                chat_history: executor.history
            });
            response.output = response.output.replace(/\n/g, '#\n ');
            return "# " + response.output.tolowerCase();
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }    
}
export default LLMService
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";

// An example prompt with multiple input variables
let systemDescription = `Today's date is ${new Date().toString()}\n`;
systemDescription += `You are a git comment generator. 
                    You will receive a diff file that has changes in it that the person has made to his code. 
                    You need to generate a detailed conventional commit message with a subject body and footer for the changes that can be used as a commit message. 
                    
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
const GitCommitMessageChatPrompt = ChatPromptTemplate.fromMessages([
  ["system", systemDescription],
  new MessagesPlaceholder("chat_history"),
  ["human", "{text}"],
  new MessagesPlaceholder("agent_scratchpad"),
]);

export default GitCommitMessageChatPrompt;
import { z } from "zod";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { RequestsPostTool } from "langchain/tools";
import { logger } from "../utils";

const BpmnTokenGeneratorTool = new DynamicStructuredTool({
  name: 'BpmnTokenGenerator',
  description: "This will return a token for the given tenanturl, username and password",
  schema: z.object({
    tenantUrl: z.string().describe("The tenanturl"),
    username: z.string().describe("The username"),
    password: z.string().describe("The password")
  }),
  func: async ({ tenantUrl, username, password }) => {

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    const httpRequestTool = new RequestsPostTool(headers);
    const myHeaders = () => new Headers({
      'content-type': 'application/x-www-form-urlencoded;',
    });

    const accessTokenRequest = new Request(tenantUrl + '/oauth2/token', {
      method: 'POST',
      headers: myHeaders(),
      body: `grant_type=password&username=${username}&password=${password}&duration=900`
    })

    return fetch(accessTokenRequest).then(
      (res) => {
        if (res.status === 200) {
          return res.json()
        }
        else if (res.status === 400) {
          return res.json().then((x: any) => {
            throw new Error(x.error_description);
          });
        }
      })
      .then(async (r) => {
        if (!r.status) {
          logger.info(JSON.stringify(r)); // Fix: Pass the string as a parameter to the logger.log function
          var token = r.access_token;
          return token;
        }
        return 'return status is not what was expected.';
      })
  }
})

export default BpmnTokenGeneratorTool;
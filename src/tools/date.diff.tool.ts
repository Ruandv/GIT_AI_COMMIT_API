import { z } from "zod";
import { DynamicStructuredTool } from "@langchain/core/tools";

const DateDiffTool = new DynamicStructuredTool({
  name: "dateDiffTool",
  description: "Determines the date difference between two dates",
  schema: z.object({
    startDate: z.string().describe("The lower bound of the date values"),
    endDate: z.string().describe("The upper bound of the date values"),
  }),
  func: async ({ startDate, endDate }:any) => {
    var val = Date.parse(endDate).valueOf() - Date.parse(startDate).valueOf();
    return val.toString();
  }
}
)

export default DateDiffTool;
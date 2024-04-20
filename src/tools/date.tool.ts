import { z } from "zod";
import { DynamicStructuredTool } from "@langchain/core/tools";

const DateTool = new DynamicStructuredTool({
  name: "dateTool",
  description: "Add the number of milliseconds to the date provided to determine a new date",
  schema: z.object({
    initialDate: z.string().describe("The initial date that will be used to add the milliseconds to"),
    milliseconds: z.number().describe("The number of milliseconds we need to add")
  }),
  func: async ({ initialDate, milliseconds }) => {
    var dt = Date.parse(initialDate)+milliseconds;
    
    return new Date(dt).toString();
  }
}
)

export default DateTool;
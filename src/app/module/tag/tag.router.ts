import { Request, Response, Router } from "express";
import { prisma } from "../../../lib/prisma";

const router = Router();
router.post("/", async (req: Request, res: Response) => {
  try {
    const results = await prisma.tag.createMany({
      data: req.body,
      skipDuplicates: true,
    });

    res.status(200).json({
      success: true,
      message: "Tags Created successfully",
      data: results,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
export const tagsRouter = { router };

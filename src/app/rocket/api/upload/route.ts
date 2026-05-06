import { writeFile } from "fs/promises";
import path from "path";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const file = data.get("file");
    const folderValue = data.get("folder");
    const folder = typeof folderValue === "string" ? folderValue : "general";

    if (!file || typeof file !== "object") {
      console.log("No file uploaded");
      return Response.json({ error: "No file" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = Date.now() + "-" + file.name;

    // dynamic folder path
    const uploadDir = path.join(
      process.cwd(),
      "public/uploads",
      folder
    );
 console.log("uploads direction", uploadDir);
    // create folder if not exists
    await import("fs").then(fs => {
     
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
    });
 console.log("uploads direction", uploadDir);
    const filepath = path.join(uploadDir, filename);

    await writeFile(filepath, buffer);
    console.log("File uploaded:", filepath);
    console.log("File uploaded:", filename);

    return Response.json({
      path: `/uploads/${folder}/${filename}`,
    });

  } catch (error) {
    console.log("Upload Error:", error);

    return Response.json(
      { error: "Error uploading file" },
      { status: 500 }
    );
  }
}
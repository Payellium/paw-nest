
import { auth } from "@/auth";
import cloudinary from "@/lib/cloudinary";
import { randomUUID } from "crypto";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export async function POST(request: Request) {
  try {
    // 1. Authenticate the applicant
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json(
        {
          success: false,
          message: "Please log in before uploading your NID.",
        },
        { status: 401 }
      );
    }

    // 2. Read uploaded files
    const formData = await request.formData();

    const documentFront = formData.get("documentFront");
    const documentBack = formData.get("documentBack");
    const consentGiven = formData.get("consentGiven");

    if (
      !(documentFront instanceof File) ||
      !(documentBack instanceof File)
    ) {
      return Response.json(
        {
          success: false,
          message: "Please upload both sides of your NID.",
        },
        { status: 400 }
      );
    }

    // 3. Check consent
    if (consentGiven !== "true") {
      return Response.json(
        {
          success: false,
          message: "NID verification consent is required.",
        },
        { status: 400 }
      );
    }

    // 4. Validate file types and sizes
    const files = [documentFront, documentBack];

    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return Response.json(
          {
            success: false,
            message: "Only JPG, PNG, and WEBP images are allowed.",
          },
          { status: 400 }
        );
      }

      if (file.size === 0 || file.size > MAX_FILE_SIZE) {
        return Response.json(
          {
            success: false,
            message: "Each NID image must be between 1 byte and 5 MB.",
          },
          { status: 400 }
        );
      }
    }

    // 5. Upload documents as authenticated Cloudinary assets
    const folder = `pawnest/nid/${session.user.id}`;

    const uploadDocument = async (file: File) => {
      const buffer = Buffer.from(await file.arrayBuffer());
      const base64 = buffer.toString("base64");

      return cloudinary.uploader.upload(
        `data:${file.type};base64,${base64}`,
        {
          folder,
          public_id: randomUUID(),
          resource_type: "image",
          type: "authenticated",
          overwrite: false,
        }
      );
    };

    const frontUpload = await uploadDocument(documentFront);

    try {
      const backUpload = await uploadDocument(documentBack);

      return Response.json(
        {
          success: true,
          message: "NID documents uploaded successfully.",
          nidVerification: {
            documentFront: frontUpload.public_id,
            documentBack: backUpload.public_id,
            consentGiven: true,
            status: "Pending",
          },
        },
        { status: 200 }
      );
    } catch (error) {
      // Remove the first upload if the second one fails
      await cloudinary.uploader.destroy(frontUpload.public_id, {
        resource_type: "image",
        type: "authenticated",
      });

      throw error;
    }
  } catch (error) {
    console.error("NID upload error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to upload NID documents. Please try again.",
      },
      { status: 500 }
    );
  }
}

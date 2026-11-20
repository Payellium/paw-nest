
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import cloudinary from "@/lib/cloudinary";
import AdoptionRequest from "@/models/AdoptionRequest";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string; side: string }> }
) {
    try {
        // 1. Check admin authentication
        const session = await auth();

        if (!session?.user) {
            return NextResponse.json(
                { message: "Authentication required." },
                { status: 401 }
            );
        }

        if (session.user.role !== "admin") {
            return NextResponse.json(
                { message: "Admin access required." },
                { status: 403 }
            );
        }

        // 2. Validate route parameters
        const { id, side } = await params;

        if (!["front", "back"].includes(side)) {
            return NextResponse.json(
                { message: "Invalid document side." },
                { status: 400 }
            );
        }

        if (!/^[a-f\d]{24}$/i.test(id)) {
            return NextResponse.json(
                { message: "Invalid application ID." },
                { status: 400 }
            );
        }

        // 3. Find the adoption application
        await connectDB();

        const adoptionRequest = await AdoptionRequest.findById(id).lean();

        if (!adoptionRequest?.nidVerification) {
            return NextResponse.json(
                { message: "NID document not found." },
                { status: 404 }
            );
        }

        const publicId =
            side === "front"
                ? adoptionRequest.nidVerification.documentFront
                : adoptionRequest.nidVerification.documentBack;

        // 4. Verify that the document belongs to this applicant
        const expectedFolder = `pawnest/nid/${adoptionRequest.userId}/`;

        if (
            !publicId ||
            !publicId.startsWith(expectedFolder)
        ) {
            return NextResponse.json(
                { message: "Invalid document reference." },
                { status: 403 }
            );
        }

        // 5. Retrieve authenticated asset details
        const asset = await cloudinary.api.resource(publicId, {
            resource_type: "image",
            type: "authenticated",
        });

        if (
            asset.public_id !== publicId ||
            asset.type !== "authenticated"
        ) {
            return NextResponse.json(
                { message: "Document access denied." },
                { status: 403 }
            );
        }

        const allowedFormats = ["jpg", "jpeg", "png", "webp"];

        if (!allowedFormats.includes(asset.format)) {
            return NextResponse.json(
                { message: "Unsupported document format." },
                { status: 415 }
            );
        }

        // 6. Generate a short-lived signed download URL
        const signedUrl = cloudinary.utils.private_download_url(
            publicId,
            asset.format,
            {
                resource_type: "image",
                type: "authenticated",
                expires_at: Math.floor(Date.now() / 1000) + 60,
            }
        );

        // 7. Fetch the document on the server
        const imageResponse = await fetch(signedUrl, {
            cache: "no-store",
        });

        if (!imageResponse.ok || !imageResponse.body) {
            return NextResponse.json(
                { message: "Unable to retrieve NID document." },
                { status: 502 }
            );
        }

        const contentType = imageResponse.headers.get("content-type");

        if (!contentType?.startsWith("image/")) {
            return NextResponse.json(
                { message: "Invalid document response." },
                { status: 502 }
            );
        }

        // 8. Stream the image to the authorized admin
        return new Response(imageResponse.body, {
            status: 200,
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "private, no-store, no-cache, max-age=0",
                "X-Content-Type-Options": "nosniff",
                "Content-Disposition": "inline",
            },
        });
    } catch (error) {
        console.error("NID document access error:", error);

        return NextResponse.json(
            { message: "Unable to access NID document." },
            { status: 500 }
        );
    }
}


"use client";

import { useEffect, useRef, useState, type FormEvent, type ChangeEvent } from "react";
import {
    FaUser,
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
    FaCamera,
    FaSave,
    FaSpinner,
    FaUpload,
} from "react-icons/fa";

interface UserProfile {
    name: string;
    email: string;
    image: string;
    phone: string;
    location: string;
}

const initialProfile: UserProfile = {
    name: "",
    email: "",
    image: "",
    phone: "",
    location: "",
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function SettingsPage() {
    const [profile, setProfile] = useState<UserProfile>(initialProfile);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [previewImage, setPreviewImage] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Load profile information
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch("/api/my-account/profile");
                const data = await response.json();

                if (!response.ok || !data.success) {
                    throw new Error(data.message || "Failed to load profile.");
                }

                setProfile({
                    name: data.user.name || "",
                    email: data.user.email || "",
                    image: data.user.image || "",
                    phone: data.user.phone || "",
                    location: data.user.location || "",
                });
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "Something went wrong."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    // Clean up temporary preview URLs
    useEffect(() => {
        return () => {
            if (previewImage) {
                URL.revokeObjectURL(previewImage);
            }
        };
    }, [previewImage]);

    // Handle text field changes
    const handleChange = (field: keyof UserProfile, value: string) => {
        setProfile((previous) => ({
            ...previous,
            [field]: value,
        }));

        setError("");
        setSuccess("");
    };

    // Open file picker
    const handleImageButtonClick = () => {
        fileInputRef.current?.click();
    };

    // Upload selected profile picture
    const handleImageUpload = async (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];

        if (!file) return;

        setError("");
        setSuccess("");

        if (!ALLOWED_TYPES.includes(file.type)) {
            setError("Please select a JPG, PNG, or WebP image.");
            event.target.value = "";
            return;
        }

        if (file.size === 0 || file.size > MAX_FILE_SIZE) {
            setError("Your image must be less than 5 MB.");
            event.target.value = "";
            return;
        }

        // Show an instant preview before uploading
        const temporaryPreview = URL.createObjectURL(file);
        setPreviewImage(temporaryPreview);

        setUploadingImage(true);

        try {
            const formData = new FormData();
            formData.append("image", file);

            const response = await fetch("/api/my-account/profile/image", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Failed to upload profile picture.");
            }

            // Save the uploaded Cloudinary URL in the profile state
            setProfile((previous) => ({
                ...previous,
                image: data.image,
            }));

            setPreviewImage("");

            // Notify the Navbar immediately
            window.dispatchEvent(
                new CustomEvent("pawnest-profile-updated", {
                    detail: { image: data.image },
                })
            );

            setSuccess("Your profile picture has been updated successfully.");
        } catch (err) {
            setPreviewImage("");

            setError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong while uploading your image."
            );
        } finally {
            setUploadingImage(false);

            // Allow selecting the same file again
            event.target.value = "";
        }
    };

    // Save personal information
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setSaving(true);
        setError("");
        setSuccess("");

        try {
            const response = await fetch("/api/my-account/profile", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: profile.name,
                    phone: profile.phone,
                    location: profile.location,
                }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Failed to update profile.");
            }

            setProfile((previous) => ({
                ...previous,
                ...data.user,
            }));

            setSuccess("Your profile has been updated successfully.");
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong. Please try again."
            );
        } finally {
            setSaving(false);
        }
    };

    const inputClass =
        "mt-2 w-full rounded-xl border border-purple-100 bg-[#F8FAFC] px-4 py-3.5 text-lg text-[#292044] outline-none transition placeholder:text-gray-400 focus:border-[#7C3AED] focus:bg-white focus:ring-2 focus:ring-purple-100";

    if (loading) {
        return (
            <div className="flex min-h-[450px] items-center justify-center">
                <FaSpinner className="animate-spin text-3xl text-[#7C3AED]" />
            </div>
        );
    }

    return (
        <div className="w-full space-y-8">
            {/* Page heading */}
            <div>
                <p className="mb-2 text-base font-bold uppercase tracking-wider text-[#7C3AED]">
                    YOUR PAWNEST ACCOUNT
                </p>

                <h1 className="text-3xl font-extrabold text-[#292044] sm:text-4xl">
                    Account Settings
                </h1>

                <p className="mt-3 max-w-2xl text-lg leading-relaxed text-gray-500">
                    Manage your personal information and keep your PawNest profile up to
                    date.
                </p>
            </div>

            {/* Profile form */}
            <form onSubmit={handleSubmit} className="space-y-7">
                {/* Profile information card */}
                <section className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm sm:p-7 lg:p-8">
                    <div className="mb-7">
                        <h2 className="text-2xl font-bold text-[#292044]">
                            Personal Information
                        </h2>

                        <p className="mt-2 text-lg text-gray-500">
                            Update the information associated with your account.
                        </p>
                    </div>

                    {/* Profile image upload */}
                    <div className="mb-8 flex flex-col items-center gap-5 rounded-2xl bg-[#F8F5FF] p-6 sm:flex-row">
                        <div className="relative flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-[#E9D8FD] shadow-sm">
                            {previewImage || profile.image ? (
                                <img
                                    src={previewImage || profile.image}
                                    alt="Profile"
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <FaUser className="text-4xl text-[#7C3AED]" />
                            )}

                            {uploadingImage && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/45">
                                    <FaSpinner className="animate-spin text-3xl text-white" />
                                </div>
                            )}
                        </div>

                        <div className="text-center sm:text-left">
                            <h3 className="text-xl font-bold text-[#292044]">
                                Profile Picture
                            </h3>

                            <p className="mt-2 text-base leading-relaxed text-gray-500">
                                Upload a photo to personalize your PawNest account.
                            </p>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleImageUpload}
                                className="hidden"
                            />

                            <button
                                type="button"
                                onClick={handleImageButtonClick}
                                disabled={uploadingImage}
                                className="mt-4 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#7C3AED] px-5 py-3 text-base font-bold text-white shadow-sm transition hover:bg-[#6929D4] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {uploadingImage ? (
                                    <>
                                        <FaSpinner className="animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <FaUpload />
                                        {profile.image ? "Change Picture" : "Add an Image"}
                                    </>
                                )}
                            </button>

                            <p className="mt-2 text-sm text-gray-400">
                                JPG, PNG or WebP · Maximum 5 MB
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Full name */}
                        <div>
                            <label
                                htmlFor="name"
                                className="flex items-center gap-2 text-lg font-semibold text-[#292044]"
                            >
                                <FaUser className="text-[#7C3AED]" />
                                Full Name
                            </label>

                            <input
                                id="name"
                                type="text"
                                value={profile.name}
                                onChange={(event) =>
                                    handleChange("name", event.target.value)
                                }
                                placeholder="Enter your full name"
                                className={inputClass}
                                required
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="flex items-center gap-2 text-lg font-semibold text-[#292044]"
                            >
                                <FaEnvelope className="text-[#7C3AED]" />
                                Email Address
                            </label>

                            <input
                                id="email"
                                type="email"
                                value={profile.email}
                                className={`${inputClass} cursor-not-allowed opacity-70`}
                                disabled
                            />

                            <p className="mt-2 text-sm text-gray-400">
                                Your account email cannot be changed here.
                            </p>
                        </div>

                        {/* Phone */}
                        <div>
                            <label
                                htmlFor="phone"
                                className="flex items-center gap-2 text-lg font-semibold text-[#292044]"
                            >
                                <FaPhone className="text-[#7C3AED]" />
                                Phone Number
                            </label>

                            <input
                                id="phone"
                                type="tel"
                                value={profile.phone}
                                onChange={(event) =>
                                    handleChange("phone", event.target.value)
                                }
                                placeholder="Enter your phone number"
                                className={inputClass}
                            />
                        </div>

                        {/* Location */}
                        <div>
                            <label
                                htmlFor="location"
                                className="flex items-center gap-2 text-lg font-semibold text-[#292044]"
                            >
                                <FaMapMarkerAlt className="text-[#7C3AED]" />
                                Location
                            </label>

                            <input
                                id="location"
                                type="text"
                                value={profile.location}
                                onChange={(event) =>
                                    handleChange("location", event.target.value)
                                }
                                placeholder="Enter your city or address"
                                className={inputClass}
                            />
                        </div>
                    </div>
                </section>

                {/* Feedback */}
                {error && (
                    <div
                        role="alert"
                        className="rounded-xl border border-red-200 bg-red-50 p-4 text-lg font-medium text-red-600"
                    >
                        {error}
                    </div>
                )}

                {success && (
                    <div
                        role="status"
                        className="rounded-xl border border-green-200 bg-green-50 p-4 text-lg font-medium text-green-700"
                    >
                        {success}
                    </div>
                )}

                {/* Save button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex min-h-14 items-center justify-center gap-3 rounded-xl bg-[#7C3AED] px-8 py-3 text-lg font-bold text-white shadow-sm transition hover:bg-[#6929D4] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {saving ? (
                            <>
                                <FaSpinner className="animate-spin" />
                                Saving Changes...
                            </>
                        ) : (
                            <>
                                <FaSave />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

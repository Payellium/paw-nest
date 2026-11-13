
"use client";

import { useEffect, useRef, useState } from "react";

interface AdminProfile {
    name: string;
    email: string;
    phone: string;
    location: string;
    image: string;
}

export default function AdminSettingsPage() {
    const [profile, setProfile] = useState<AdminProfile>({
        name: "",
        email: "",
        phone: "",
        location: "",
        image: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [passwordSaving, setPasswordSaving] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const fileInputRef = useRef<HTMLInputElement>(null);

    const [uploading, setUploading] = useState(false);
    const [uploadMessage, setUploadMessage] = useState("");
    const [uploadError, setUploadError] = useState("");
    const [previewImage, setPreviewImage] = useState("");

    // Fetch admin profile
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch("/api/user/profile");
                const data = await response.json();

                if (!response.ok || !data.success) {
                    throw new Error(data.message || "Failed to load profile.");
                }

                setProfile({
                    name: data.user.name || "",
                    email: data.user.email || "",
                    phone: data.user.phone || "",
                    location: data.user.location || "",
                    image: data.user.image || "",
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

    useEffect(() => {
        if (!previewImage) return;

        return () => {
            URL.revokeObjectURL(previewImage);
        };
    }, [previewImage]);

    // Update form values
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;

        setProfile((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // Save profile
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setSaving(true);
        setMessage("");
        setError("");

        try {
            const response = await fetch("/api/user/profile", {
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

            setMessage("Your profile has been updated successfully!");
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Something went wrong."
            );
        } finally {
            setSaving(false);
        }
    };

    // Upload admin profile picture
    const handleImageUpload = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];

        if (!file) return;

        setUploadMessage("");
        setUploadError("");

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ];

        if (!allowedTypes.includes(file.type)) {
            setUploadError("Only JPG, PNG, and WebP images are allowed.");
            e.target.value = "";
            return;
        }

        if (file.size === 0 || file.size > 5 * 1024 * 1024) {
            setUploadError("Image size must be less than 5 MB.");
            e.target.value = "";
            return;
        }

        // Show an instant preview
        setPreviewImage(URL.createObjectURL(file));

        setUploading(true);

        try {
            const formData = new FormData();
            formData.append("image", file);

            const response = await fetch(
                "/api/my-account/profile/image",
                {
                    method: "POST",
                    body: formData,
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message || "Failed to upload profile picture."
                );
            }

            // Save the Cloudinary URL in the profile state
            setProfile((previous) => ({
                ...previous,
                image: data.image,
            }));

            setPreviewImage("");
            setUploadMessage("Profile picture updated successfully!");
        } catch (err) {
            setUploadError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong."
            );
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    };

    // Handle password input changes
    const handlePasswordChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;

        setPasswordData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // Submit password change
    const handlePasswordSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        setPasswordSaving(true);
        setPasswordMessage("");
        setPasswordError("");

        try {
            const response = await fetch("/api/user/change-password", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(passwordData),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Failed to change password.");
            }

            setPasswordMessage(data.message);

            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } catch (err) {
            setPasswordError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong."
            );
        } finally {
            setPasswordSaving(false);
        }
    };


    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <p className="text-lg font-medium text-[#7C3AED]">
                    Loading admin settings...
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Page Heading */}
            <div>
                <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#7C3AED]">
                    Administration
                </p>

                <h1 className="text-3xl font-bold text-[#292044] md:text-4xl">
                    Admin Settings
                </h1>

                <p className="mt-3 text-lg text-gray-500">
                    Manage your PawNest administrator profile and account information.
                </p>
            </div>

            {/* Profile Settings */}
            <div className="rounded-3xl border border-purple-100 bg-white p-6 shadow-sm md:p-8">
                <div className="mb-7">
                    <h2 className="text-2xl font-bold text-[#292044]">
                        Profile Information
                    </h2>

                    <p className="mt-2 text-base text-gray-500">
                        Update the personal information associated with your admin account.
                    </p>
                </div>

                {/* Feedback */}
                {message && (
                    <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-base font-medium text-green-700">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-base font-medium text-red-600">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Profile Picture Upload */}
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-purple-100 bg-purple-100 text-3xl font-bold text-[#7C3AED]">
                            {previewImage || profile.image ? (
                                <img
                                    src={previewImage || profile.image}
                                    alt="Admin profile"
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                profile.name.charAt(0).toUpperCase() || "A"
                            )}
                        </div>

                        <div className="space-y-3">
                            <div>
                                <p className="text-lg font-bold text-[#292044]">
                                    {profile.name || "Admin"}
                                </p>

                                <p className="mt-1 text-sm text-gray-500">
                                    Administrator Account
                                </p>
                            </div>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleImageUpload}
                                className="hidden"
                            />

                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                className="rounded-xl border border-purple-200 bg-purple-50 px-5 py-2.5 text-sm font-semibold text-[#7C3AED] transition hover:bg-purple-100 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {uploading
                                    ? "Uploading Photo..."
                                    : profile.image
                                        ? "Change Profile Photo"
                                        : "Upload Profile Photo"}
                            </button>

                            <p className="text-sm text-gray-400">
                                JPG, PNG or WebP. Maximum file size: 5 MB.
                            </p>
                        </div>
                    </div>

                    {uploadMessage && (
                        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-base font-medium text-green-700">
                            {uploadMessage}
                        </div>
                    )}

                    {uploadError && (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-base font-medium text-red-600">
                            {uploadError}
                        </div>
                    )}

                    {/* Name */}
                    <div>
                        <label
                            htmlFor="name"
                            className="mb-2 block text-base font-semibold text-[#292044]"
                        >
                            Full Name
                        </label>

                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={profile.name}
                            onChange={handleChange}
                            required
                            className="w-full rounded-xl border border-purple-100 bg-[#FAF9FF] px-4 py-3 text-base text-[#292044] outline-none transition focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100"
                            placeholder="Enter your full name"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label
                            htmlFor="email"
                            className="mb-2 block text-base font-semibold text-[#292044]"
                        >
                            Email Address
                        </label>

                        <input
                            id="email"
                            type="email"
                            value={profile.email}
                            disabled
                            className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-base text-gray-500"
                        />

                        <p className="mt-2 text-sm text-gray-400">
                            Your account email cannot be changed here.
                        </p>
                    </div>

                    {/* Phone */}
                    <div>
                        <label
                            htmlFor="phone"
                            className="mb-2 block text-base font-semibold text-[#292044]"
                        >
                            Phone Number
                        </label>

                        <input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={profile.phone}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-purple-100 bg-[#FAF9FF] px-4 py-3 text-base text-[#292044] outline-none transition focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100"
                            placeholder="Enter your phone number"
                        />
                    </div>

                    {/* Location */}
                    <div>
                        <label
                            htmlFor="location"
                            className="mb-2 block text-base font-semibold text-[#292044]"
                        >
                            Location
                        </label>

                        <input
                            id="location"
                            name="location"
                            type="text"
                            value={profile.location}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-purple-100 bg-[#FAF9FF] px-4 py-3 text-base text-[#292044] outline-none transition focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100"
                            placeholder="Enter your location"
                        />
                    </div>

                    {/* Save Button */}
                    <div className="border-t border-purple-100 pt-6">
                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-xl bg-[#7C3AED] px-8 py-3.5 text-base font-semibold text-white shadow-md transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {saving ? "Saving Changes..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>


            {/* Change Password */}
            <div className="rounded-3xl border border-purple-100 bg-white p-6 shadow-sm md:p-8">
                <div className="mb-7">
                    <h2 className="text-2xl font-bold text-[#292044]">
                        Change Password
                    </h2>

                    <p className="mt-2 text-base text-gray-500">
                        Keep your administrator account secure by updating your password.
                    </p>
                </div>

                {passwordMessage && (
                    <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-base font-medium text-green-700">
                        {passwordMessage}
                    </div>
                )}

                {passwordError && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-base font-medium text-red-600">
                        {passwordError}
                    </div>
                )}

                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                    {/* Current Password */}
                    <div>
                        <label
                            htmlFor="currentPassword"
                            className="mb-2 block text-base font-semibold text-[#292044]"
                        >
                            Current Password
                        </label>

                        <input
                            id="currentPassword"
                            name="currentPassword"
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            required
                            autoComplete="current-password"
                            className="w-full rounded-xl border border-purple-100 bg-[#FAF9FF] px-4 py-3 text-base text-[#292044] outline-none transition focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100"
                            placeholder="Enter your current password"
                        />
                    </div>

                    {/* New Password */}
                    <div>
                        <label
                            htmlFor="newPassword"
                            className="mb-2 block text-base font-semibold text-[#292044]"
                        >
                            New Password
                        </label>

                        <input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            required
                            minLength={8}
                            autoComplete="new-password"
                            className="w-full rounded-xl border border-purple-100 bg-[#FAF9FF] px-4 py-3 text-base text-[#292044] outline-none transition focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100"
                            placeholder="Enter your new password"
                        />

                        <p className="mt-2 text-sm text-gray-400">
                            Use at least 8 characters.
                        </p>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label
                            htmlFor="confirmPassword"
                            className="mb-2 block text-base font-semibold text-[#292044]"
                        >
                            Confirm New Password
                        </label>

                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            required
                            minLength={8}
                            autoComplete="new-password"
                            className="w-full rounded-xl border border-purple-100 bg-[#FAF9FF] px-4 py-3 text-base text-[#292044] outline-none transition focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100"
                            placeholder="Confirm your new password"
                        />
                    </div>

                    {/* Submit */}
                    <div className="border-t border-purple-100 pt-6">
                        <button
                            type="submit"
                            disabled={passwordSaving}
                            className="rounded-xl bg-[#7C3AED] px-8 py-3.5 text-base font-semibold text-white shadow-md transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {passwordSaving
                                ? "Updating Password..."
                                : "Update Password"}
                        </button>
                    </div>
                </form>
            </div>

        </div>
    );
}

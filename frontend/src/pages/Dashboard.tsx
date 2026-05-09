import { useEffect, useState } from "react";
import {
  useGetUserProfile,
  useUpdateUserProfile,
} from "../lib/hooks/api/useUser";
import { useStore } from "../lib/store";

export default function Profile() {
  const { user: storedUser } = useStore((state) => state);
  const { data: profile, isLoading } = useGetUserProfile();
  const updateProfileMutation = useUpdateUserProfile();

  const currentUser = profile || storedUser;

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || "");
      setBio(currentUser.bio || "");
      setPreview(currentUser.profilePicture || "");
    }
  }, [currentUser]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("bio", bio);

    if (file) {
      formData.append("profilePicture", file);
    }

    updateProfileMutation.mutate(formData);
  };

  if (isLoading) {
    return <div className="p-6">Loading profile...</div>;
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="mb-6 flex items-center gap-4">
        <img
          src={preview || "/default-avatar.png"}
          alt={currentUser?.name || "User"}
          className="h-20 w-20 rounded-full object-cover"
        />
        <div>
          <h1 className="text-2xl font-bold">{currentUser?.name}</h1>
          <p className="text-sm text-gray-500">{currentUser?.email}</p>
          <p className="text-sm capitalize text-blue-600">
            {currentUser?.role}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border px-4 py-3"
          placeholder="Name"
        />

        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full rounded-lg border px-4 py-3"
          placeholder="Bio"
          rows={4}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const selected = e.target.files?.[0] || null;
            setFile(selected);
            if (selected) setPreview(URL.createObjectURL(selected));
          }}
        />

        <button
          type="submit"
          disabled={updateProfileMutation.isPending}
          className="rounded-lg bg-black px-5 py-3 text-white"
        >
          {updateProfileMutation.isPending ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
}
